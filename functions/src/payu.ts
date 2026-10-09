import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import { requestHash, validResponse, sha512, capturedPayment } from './payuProtocol';
const key = defineSecret('PAYU_MERCHANT_KEY');
const salt = defineSecret('PAYU_MERCHANT_SALT');
const options = { secrets: [key, salt], region: 'asia-south1' };
const callbackUrl = 'https://asia-south1-recell-new.cloudfunctions.net/payuCallback';
const db = () => admin.firestore();
function text(value: unknown, max = 200): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max || value.includes('|')) {
    throw new HttpsError('invalid-argument', 'Please enter valid shipping details.');
  }
  return value.trim();
}
export const createPayuCheckout = onCall(options, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Please sign in before paying.');
  const data = request.data || {};
  const ids = data.productIds;
  if (!Array.isArray(ids) || !ids.length || ids.length > 20 || ids.some(id => typeof id !== 'string') || new Set(ids).size !== ids.length) {
    throw new HttpsError('invalid-argument', 'Please select valid products.');
  }
  const shipping = {
    customerName: text(data.customerName, 80), customerPhone: text(data.customerPhone, 15),
    customerEmail: text(data.customerEmail), shippingAddress: text(data.shippingAddress, 500),
    pincode: text(data.pincode, 6), city: text(data.city, 80), state: text(data.state, 80)
  };
  if (!/^\d{10}$/.test(shipping.customerPhone) || !/^\d{6}$/.test(shipping.pincode) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.customerEmail)) {
    throw new HttpsError('invalid-argument', 'Check your phone, email and pincode.');
  }
  const catalog = (await db().doc('system/catalog').get()).data()?.products;
  if (!Array.isArray(catalog)) throw new HttpsError('failed-precondition', 'Online catalog is unavailable. Please contact support.');
  const items = ids.map(id => {
    const product = catalog.find(p => p.id === id);
    if (!product || !product.inStock || product.stockCount < 1 || !Number.isFinite(product.refurbPrice) || product.refurbPrice <= 0) {
      throw new HttpsError('failed-precondition', 'A product is unavailable. Refresh your cart.');
    }
    return { productId: id, title: product.title, refurbPrice: product.refurbPrice,
      image: product.images?.[0] || '', serialImei: product.serialImei || '', warrantyMonths: product.warrantyMonths || 3 };
  });
  const totalAmount = items.reduce((sum, item) => sum + Math.round(item.refurbPrice * 100), 0) / 100;
  const txnid = randomUUID().replace(/-/g, '');
  const orderId = `ORD-${txnid}`;
  const now = new Date();
  const order = { id: orderId, date: now.toISOString(), ...shipping, items, totalAmount,
    paymentMethod: 'PayU', paymentStatus: 'Pending Token', orderStatus: 'Awaiting Payment',
    courierPartner: 'Delhivery Express', trackingNumber: '', trackingHistory: [],
    returnWindowExpiry: '', warrantyExpiry: '' };
  const fields: Record<string, string> = { key: key.value(), txnid, amount: totalAmount.toFixed(2),
    productinfo: 'Recell mobile order', firstname: shipping.customerName, email: shipping.customerEmail,
    phone: shipping.customerPhone, surl: callbackUrl, furl: callbackUrl, udf1: orderId };
  fields.hash = requestHash(fields, salt.value());
  // Private payment session is the immutable source of amount/ownership. Client-created orders cannot be charged.
  const batch = db().batch();
  batch.create(db().doc(`orders/${orderId}`), order);
  batch.create(db().doc(`payu_sessions/${txnid}`), { ownerUid: request.auth.uid, orderId,
    amount: fields.amount, firstname: fields.firstname, email: fields.email, productinfo: fields.productinfo,
    status: 'pending', createdAt: now.toISOString() });
  await batch.commit();
  return { action: 'https://secure.payu.in/_payment', fields, orderId };
});
async function reconcile(txnid: string): Promise<string> {
  const sessionRef = db().doc(`payu_sessions/${txnid}`);
  const session = (await sessionRef.get()).data();
  if (!session) throw new HttpsError('not-found', 'Payment session not found.');
  if (session.status === 'paid') return 'paid';
  const body = new URLSearchParams({ key: key.value(), command: 'verify_payment', var1: txnid,
    hash: sha512(`${key.value()}|verify_payment|${txnid}|${salt.value()}`) });
  const response = await fetch('https://info.payu.in/merchant/postservice.php?form=2', {
    method: 'POST', body, signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new HttpsError('unavailable', 'Payment verification unavailable. Please check again later.');
  const result = await response.json() as { transaction_details?: Record<string, Record<string, unknown>> };
  const detail = result.transaction_details?.[txnid];
  if (!detail) return 'pending';
  if (!capturedPayment(detail, txnid, session.amount)) return detail.status === 'failure' ? 'failed' : 'pending';
  await db().runTransaction(async transaction => {
    const fresh = (await transaction.get(sessionRef)).data()!;
    if (fresh.status === 'paid') return;
    const orderRef = db().doc(`orders/${fresh.orderId}`);
    const order = (await transaction.get(orderRef)).data();
    if (!order || order.paymentMethod !== 'PayU' || Number(order.totalAmount) !== Number(fresh.amount)) {
      throw new HttpsError('failed-precondition', 'Order requires support review.');
    }
    const now = new Date();
    transaction.update(orderRef, { paymentStatus: 'Paid', orderStatus: 'Confirmed', payuPaymentId: String(detail.mihpayid),
      returnWindowExpiry: new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0],
      warrantyExpiry: new Date(now.getTime() + 90 * 86400000).toISOString().split('T')[0],
      trackingHistory: admin.firestore.FieldValue.arrayUnion({ time: now.toLocaleString('en-IN'), status: 'PayU payment verified; order confirmed', location: 'Recell Central Hub, Khekra' }) });
    transaction.update(sessionRef, { status: 'paid', paymentId: String(detail.mihpayid) });
    transaction.create(db().doc(`payments/PAYU-${txnid}`), { paymentId: `PAYU-${txnid}`, orderId: fresh.orderId,
      amount: Number(fresh.amount), customerName: order.customerName, customerPhone: order.customerPhone,
      paymentMethod: 'PayU', status: 'SUCCESS', payuPaymentId: String(detail.mihpayid), payuTxnId: txnid, createdAt: now.toISOString() });
  });
  return 'paid';
}
export const verifyPayuPayment = onCall(options, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Please sign in to check payment.');
  const txnid = text(request.data?.txnid, 32);
  if (!/^[a-f0-9]{32}$/.test(txnid)) throw new HttpsError('invalid-argument', 'Invalid payment reference.');
  const session = (await db().doc(`payu_sessions/${txnid}`).get()).data();
  if (!session || session.ownerUid !== request.auth.uid) throw new HttpsError('permission-denied', 'Payment does not belong to this account.');
  return { status: await reconcile(txnid), orderId: session.orderId };
});
async function handlePayuResponse(request: Request, response: Response, webhook: boolean): Promise<void> {
  if (request.method !== 'POST') { response.status(405).send('POST required'); return; }
  const fields = request.body as Record<string, string>;
  if (!fields || typeof fields.txnid !== 'string' || !/^[a-f0-9]{32}$/.test(fields.txnid) ||
      fields.key !== key.value() || !validResponse(fields, salt.value())) {
    response.status(400).send('Invalid payment response'); return;
  }
  try {
    const session = (await db().doc(`payu_sessions/${fields.txnid}`).get()).data();
    if (!session || fields.udf1 !== session.orderId || fields.amount !== session.amount ||
        fields.firstname !== session.firstname || fields.email !== session.email || fields.productinfo !== session.productinfo) {
      response.status(400).send('Payment details do not match'); return;
    }
    await reconcile(fields.txnid);
    if (webhook) response.status(200).send('OK');
    else response.redirect(303, `https://recell.co.in/?payu_txn=${fields.txnid}`);
  } catch {
    // A temporary Verify API outage never turns a payment into success/failure. Customer can reconcile after returning.
    if (webhook) response.status(503).send('Verification temporarily unavailable');
    else response.redirect(303, `https://recell.co.in/?payu_txn=${fields.txnid}`);
  }
}
export const payuCallback = onRequest(options, (request, response) => handlePayuResponse(request, response, false));
export const payuWebhook = onRequest(options, (request, response) => handlePayuResponse(request, response, true));
