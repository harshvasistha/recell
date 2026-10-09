import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();


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

// Preserve deployed endpoint names so migration does not delete functions unexpectedly.
// Historical Razorpay orders remain readable; new Razorpay charges are disabled.
export const createRazorpayOrder = onCall({ region: 'asia-south1' }, async () => {
  throw new HttpsError('failed-precondition', 'Razorpay checkout has been replaced by PayU. Refresh the website.');
});
export const verifyRazorpayPayment = onCall({ region: 'asia-south1' }, async () => {
  throw new HttpsError('failed-precondition', 'Please contact support to reconcile a historical Razorpay payment.');
});

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

export { createPayuCheckout, verifyPayuPayment, payuCallback, payuWebhook } from './payu';
