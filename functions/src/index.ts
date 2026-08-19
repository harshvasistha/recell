import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

admin.initializeApp();
const db = admin.firestore();

const RAZORPAY_KEY_ID = defineSecret('RAZORPAY_KEY_ID');
const RAZORPAY_KEY_SECRET = defineSecret('RAZORPAY_KEY_SECRET');

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

    const amountPaise = Math.round(Number(order.totalAmount) * 100);
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
      notes: { recellOrderId: orderId }
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

    await orderRef.update({
      paymentStatus: 'Paid',
      orderStatus: 'Confirmed',
      razorpayPaymentId: razorpay_payment_id,
      trackingHistory: admin.firestore.FieldValue.arrayUnion({
        time: now.toLocaleString('en-IN'),
        status: `Order Confirmed - Razorpay Payment (${razorpay_payment_id}) Verified`,
        location: 'Recell Central Hub, Khekra'
      })
    });

    await db.collection('payments').doc(`PAY-${razorpay_payment_id}`).set({
      paymentId: `PAY-${razorpay_payment_id}`,
      orderId,
      amount: order.totalAmount,
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
