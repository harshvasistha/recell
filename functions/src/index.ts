import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

admin.initializeApp();
const db = admin.firestore();

const RAZORPAY_KEY_ID = defineSecret('RAZORPAY_KEY_ID');
const RAZORPAY_KEY_SECRET = defineSecret('RAZORPAY_KEY_SECRET');

// HMI Media (hmimedia.in) is the DLT-registered SMS gateway used for both
// login OTPs and transactional notifications. The username/password are
// real credentials - they live ONLY in the Cloud Functions secret store,
// set via:
//   firebase functions:secrets:set HMI_SMS_USERNAME
//   firebase functions:secrets:set HMI_SMS_API_PASSWORD
// Never put these in a .env file, the client bundle, or anywhere in git.
const HMI_SMS_USERNAME = defineSecret('HMI_SMS_USERNAME');
const HMI_SMS_API_PASSWORD = defineSecret('HMI_SMS_API_PASSWORD');
const HMI_SENDER_ID = 'ALMT';

/**
 * Calls HMI Media's pushsms.php gateway. `message` must already have every
 * {#var#} placeholder substituted with real values, and must match a
 * DLT-approved template BYTE FOR BYTE (same static wording/punctuation) -
 * Indian carriers silently drop any transactional SMS whose text doesn't
 * match its registered template, with no error surfaced back through this
 * API, so never send free-form text here.
 */
async function sendHmiSms(params: {
  to: string; // 10-digit Indian mobile number, no +91/country code/spaces
  message: string;
  entityId: string; // DLT principal entity id (e_id)
  templateId: string; // DLT-approved template id (t_id)
}): Promise<void> {
  const url = new URL('http://hmimedia.in/pushsms.php');
  url.searchParams.set('username', HMI_SMS_USERNAME.value());
  url.searchParams.set('api_password', HMI_SMS_API_PASSWORD.value());
  url.searchParams.set('sender', HMI_SENDER_ID);
  url.searchParams.set('to', params.to);
  url.searchParams.set('message', params.message);
  url.searchParams.set('priority', '4');
  url.searchParams.set('e_id', params.entityId);
  url.searchParams.set('t_id', params.templateId);

  const res = await fetch(url.toString());
  const bodyText = await res.text();
  // pushsms.php doesn't document a structured success/failure response -
  // logging the raw body is the only way to diagnose a bad-credentials,
  // DLT-mismatch, or low-balance failure after the fact.
  console.log('HMI SMS gateway response:', res.status, bodyText);
  if (!res.ok) {
    throw new Error(`HMI SMS gateway returned HTTP ${res.status}: ${bodyText}`);
  }
}

// DLT-approved login-OTP template (registered under this entity/template
// id pair) - the {#num#} placeholder is where the real code gets inserted.
// Do not edit this wording without re-registering the template with HMI
// Media / TRAI DLT first, or delivery will silently fail.
const OTP_ENTITY_ID = '1701178763854221632';
const OTP_TEMPLATE_ID = '1777178896274686724';
const buildOtpMessage = (code: string) =>
  `${code} is your otp for login at ReCell. Thankyou from ALM_TECH. For more visit https://www.recell.co.in/ Regards - ALMT\n`;

// A second DLT template (order-confirmation wording) still needs to be
// registered with HMI Media before order-placed SMS can go out - see
// notifyOrderPlaced below, which no-ops until these are filled in.
const ORDER_SMS_ENTITY_ID = '';
const ORDER_SMS_TEMPLATE_ID = '';

// The admin account used to authenticate via Firebase's native phone-auth
// provider, which auto-populates request.auth.token.phone_number - that's
// what firestore.rules' isAdmin() used to check. Custom tokens (minted by
// verifyOtpCode below) never populate that reserved claim automatically, so
// instead we stamp a plain `admin: true` developer claim onto the token
// ourselves whenever this exact number signs in, and firestore.rules checks
// that claim instead. Keep this in sync with firestore.rules' isAdmin().
const ADMIN_PHONE_UID = '+919310552055';

// COD orders only ever collect this percentage of the order total as a
// refundable deposit through Razorpay up front - the remaining balance is
// collected in cash/UPI by the courier on delivery. Charge amount is decided
// here, server-side, from the order's paymentMethod and its own totalAmount
// (both read from Firestore) - never from anything the client sends - so a
// COD order can never be tricked into charging (or skipping) the full amount.
const COD_DEPOSIT_PERCENT = 0.10;
const computeCodDepositRupees = (totalAmount: number): number =>
  Math.round(Number(totalAmount) * COD_DEPOSIT_PERCENT);

/**
 * Creates a real Razorpay order server-side for an existing, still-pending
 * Firestore order. The amount is read from Firestore ourselves - never
 * trusted from the client - so nobody can tamper with the charge amount by
 * editing request payloads in devtools.
 */
export const createRazorpayOrder = onCall(
  { secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET], region: 'asia-south1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required.');
    }

    const { orderId } = (request.data || {}) as { orderId?: string };
    if (!orderId || typeof orderId !== 'string') {
      throw new HttpsError('invalid-argument', 'orderId is required.');
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      throw new HttpsError('not-found', 'Order not found.');
    }

    const order = orderSnap.data()!;
    if (order.paymentStatus === 'Paid') {
      throw new HttpsError('failed-precondition', 'This order has already been paid.');
    }

    const isCodOrder = order.paymentMethod === 'COD (Deposit Paid)';
    const chargeRupees = isCodOrder
      ? computeCodDepositRupees(order.totalAmount)
      : Number(order.totalAmount);
    const amountPaise = Math.round(chargeRupees * 100);
    if (!amountPaise || amountPaise <= 0) {
      throw new HttpsError('failed-precondition', 'Order has no valid amount.');
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID.value(),
      key_secret: RAZORPAY_KEY_SECRET.value()
    });

    const rzpOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: orderId,
      notes: {
        recellOrderId: orderId,
        chargeType: isCodOrder ? `COD ${COD_DEPOSIT_PERCENT * 100}% deposit` : 'Full order amount'
      }
    });

    await orderRef.update({ razorpayOrderId: rzpOrder.id });

    return {
      razorpayOrderId: rzpOrder.id,
      amount: amountPaise,
      keyId: RAZORPAY_KEY_ID.value()
    };
  }
);

/**
 * Verifies a completed Razorpay checkout's HMAC signature server-side. This
 * is the ONLY place an order's paymentStatus is ever set to 'Paid' - this
 * write goes through the Admin SDK (bypasses Firestore rules), and the
 * rules separately reject any attempt by a client to set paymentStatus to
 * 'Paid' directly. If the signature doesn't check out, nothing is written.
 */
export const verifyRazorpayPayment = onCall(
  { secrets: [RAZORPAY_KEY_SECRET], region: 'asia-south1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required.');
    }

    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = (request.data || {}) as {
      orderId?: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new HttpsError('invalid-argument', 'Missing payment verification fields.');
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      throw new HttpsError('not-found', 'Order not found.');
    }

    const order = orderSnap.data()!;

    if (order.paymentStatus === 'Paid') {
      // Already verified in a previous call - idempotent success.
      return { verified: true };
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      throw new HttpsError('failed-precondition', 'Razorpay order does not match this order.');
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET.value())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new HttpsError('permission-denied', 'Payment signature verification failed.');
    }

    const now = new Date();
    const isCodOrder = order.paymentMethod === 'COD (Deposit Paid)';
    const codDepositRupees = computeCodDepositRupees(order.totalAmount);
    const chargedAmount = isCodOrder ? codDepositRupees : Number(order.totalAmount);

    await orderRef.update({
      paymentStatus: 'Paid',
      orderStatus: 'Confirmed',
      razorpayPaymentId: razorpay_payment_id,
      ...(isCodOrder ? {
        codTokenAmount: codDepositRupees,
        codBalanceDue: Math.max(0, Number(order.totalAmount) - codDepositRupees)
      } : {}),
      trackingHistory: admin.firestore.FieldValue.arrayUnion({
        time: now.toLocaleString('en-IN'),
        status: isCodOrder
          ? `Order Confirmed - Razorpay Deposit (${razorpay_payment_id}) Verified. Balance due on delivery.`
          : `Order Confirmed - Razorpay Payment (${razorpay_payment_id}) Verified`,
        location: 'Recell Central Hub, Khekra'
      })
    });

    await db.collection('payments').doc(`PAY-${razorpay_payment_id}`).set({
      paymentId: `PAY-${razorpay_payment_id}`,
      orderId,
      amount: chargedAmount,
      customerName: order.customerName || '',
      customerPhone: order.customerPhone || '',
      paymentMethod: order.paymentMethod || 'Razorpay',
      status: 'SUCCESS',
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      createdAt: now.toISOString()
    });

    return { verified: true };
  }
);

/**
 * Generates a 6-digit OTP, stores it (short-lived) in Firestore keyed by
 * phone number, and sends it via the HMI Media SMS gateway. The code
 * itself never leaves the server - the client only ever learns whether
 * sending succeeded.
 */
export const sendOtpCode = onCall(
  { secrets: [HMI_SMS_USERNAME, HMI_SMS_API_PASSWORD], region: 'asia-south1' },
  async (request) => {
    const { phone } = (request.data || {}) as { phone?: string };
    const clean = (phone || '').replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      throw new HttpsError('invalid-argument', 'A valid 10-digit mobile number is required.');
    }

    const otpRef = db.collection('otp_codes').doc(clean);
    const existing = await otpRef.get();
    const now = Date.now();
    // Simple resend throttle - one OTP request per number every 30s, so a
    // client bug (or someone hammering the button) can't burn through SMS
    // credits.
    if (existing.exists && now - (existing.data()!.lastSentAt || 0) < 30_000) {
      throw new HttpsError('resource-exhausted', 'Please wait before requesting another OTP.');
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    await otpRef.set({ code, expiresAt, attempts: 0, lastSentAt: now });

    await sendHmiSms({
      to: clean,
      message: buildOtpMessage(code),
      entityId: OTP_ENTITY_ID,
      templateId: OTP_TEMPLATE_ID
    });

    return { sent: true };
  }
);

/**
 * Verifies a previously-sent OTP and, on success, mints a Firebase Auth
 * custom token for uid "+91<number>" - the client signs in with
 * signInWithCustomToken(), which gives a real Firebase Auth session
 * exactly like signInWithPhoneNumber() used to, just backed by our own
 * OTP instead of Firebase's built-in (India-blocked) SMS sending.
 */
export const verifyOtpCode = onCall(
  { region: 'asia-south1' },
  async (request) => {
    const { phone, code } = (request.data || {}) as { phone?: string; code?: string };
    const clean = (phone || '').replace(/\D/g, '').slice(-10);
    if (clean.length !== 10 || !code) {
      throw new HttpsError('invalid-argument', 'Phone and code are required.');
    }

    const otpRef = db.collection('otp_codes').doc(clean);
    const snap = await otpRef.get();
    if (!snap.exists) {
      throw new HttpsError('failed-precondition', 'No OTP was sent to this number. Please request a new one.');
    }

    const data = snap.data()!;
    if (Date.now() > data.expiresAt) {
      await otpRef.delete();
      throw new HttpsError('deadline-exceeded', 'This OTP has expired. Please request a new one.');
    }
    if ((data.attempts || 0) >= 5) {
      await otpRef.delete();
      throw new HttpsError('resource-exhausted', 'Too many incorrect attempts. Please request a new OTP.');
    }
    if (data.code !== code) {
      await otpRef.update({ attempts: (data.attempts || 0) + 1 });
      throw new HttpsError('permission-denied', 'Incorrect OTP.');
    }

    await otpRef.delete();

    const uid = `+91${clean}`;
    // Stamp an `admin: true` claim onto the token for the one known admin
    // number, so firestore.rules' isAdmin() keeps working for this account
    // now that it signs in via a custom token instead of native phone auth.
    const customToken = await admin.auth().createCustomToken(
      uid,
      uid === ADMIN_PHONE_UID ? { admin: true } : undefined
    );
    return { customToken };
  }
);

/**
 * Fires automatically whenever a new order document is created, regardless
 * of which client code path created it - so it can't be skipped by a
 * client simply not calling a "notify" endpoint. No-ops until a second
 * DLT template (order-confirmation wording) is registered with HMI Media
 * and its ids are filled in above - logs and returns instead of sending a
 * message that doesn't match any approved template (which carriers would
 * silently drop anyway).
 */
export const notifyOrderPlaced = onDocumentCreated(
  { document: 'orders/{orderId}', secrets: [HMI_SMS_USERNAME, HMI_SMS_API_PASSWORD], region: 'asia-south1' },
  async (event) => {
    if (!ORDER_SMS_ENTITY_ID || !ORDER_SMS_TEMPLATE_ID) {
      console.log('notifyOrderPlaced: order-confirmation DLT template not configured yet - skipping SMS.');
      return;
    }

    const order = event.data?.data();
    const phoneDigits = String(order?.customerPhone || '').replace(/\D/g, '').slice(-10);
    if (phoneDigits.length !== 10) {
      console.warn('notifyOrderPlaced: no valid customer phone on order', event.params.orderId);
      return;
    }

    // TODO once the template is approved: build the exact approved wording
    // here (order id / amount / etc. substituted into its {#var#} slots)
    // instead of this placeholder.
    const message = '';

    await sendHmiSms({
      to: phoneDigits,
      message,
      entityId: ORDER_SMS_ENTITY_ID,
      templateId: ORDER_SMS_TEMPLATE_ID
    });
  }
);
