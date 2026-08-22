import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Order, BuyQuoteRequest, RepairJob, CatalogProduct } from '../types';

// Collection Names
const COLLECTIONS = {
  USERS: 'users',
  ORDERS: 'orders',
  SELL_REQUESTS: 'sell_requests',
  REPAIR_BOOKINGS: 'repair_bookings',
  PAYMENTS: 'payments'
};

export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  pincode?: string;
  role: 'customer' | 'admin';
  createdAt?: string;
}

// 1. User Profile Management
export async function saveUserProfile(user: UserProfile): Promise<void> {
  try {
    // role is intentionally never written here - it must never be settable by client
    // form data. Role changes only happen via ensureUserProfile (first-create default)
    // or a direct edit by a trusted operator in the Firebase console / Admin SDK.
    const { role, ...safeFields } = user;
    const userRef = doc(db, COLLECTIONS.USERS, user.phone || user.uid);
    await setDoc(userRef, {
      ...safeFields,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('[Firestore] User profile saved:', user.phone);
  } catch (err) {
    console.warn('[Firestore] Error saving user profile:', err);
  }
}

// Fetch an existing profile by its doc key, or create a new one defaulting to
// role: 'customer'. Never overwrites an existing profile's role - that field is
// only ever set once on first creation, or manually by a trusted operator.
export async function ensureUserProfile(
  docKey: string,
  data: Omit<UserProfile, 'role'>
): Promise<UserProfile> {
  const userRef = doc(db, COLLECTIONS.USERS, docKey);
  const existing = await getDoc(userRef);
  if (existing.exists()) {
    return existing.data() as UserProfile;
  }
  const newProfile: UserProfile = {
    ...data,
    role: 'customer',
    createdAt: new Date().toISOString()
  };
  await setDoc(userRef, newProfile);
  return newProfile;
}

export async function getUserProfile(phoneOrUid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, phoneOrUid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn('[Firestore] Error fetching user profile:', err);
  }
  return null;
}

// Shared by every login path (phone OTP, email link) once a real credential
// has already been verified by Firebase Auth - this only ever resolves the
// matching Firestore profile, it never re-checks identity. Signing in with
// no existing profile is treated as an implicit first-time signup (identical
// to the phone flow's existing behavior) rather than a dead end, since
// possession of the verified phone/email IS the credential here - there is
// no separate password to have "forgotten" to sign up with first.
export async function resolveUserProfile(
  docKey: string,
  isNewSignup: boolean,
  fallbackData: Omit<UserProfile, 'role'>
): Promise<UserProfile> {
  if (isNewSignup) {
    return ensureUserProfile(docKey, fallbackData);
  }
  const existing = await getUserProfile(docKey);
  if (existing) return existing;
  return ensureUserProfile(docKey, fallbackData);
}

// 2. Orders (Buy Refurbished & Open Box)
export async function saveOrderToDB(order: Order): Promise<boolean> {
  try {
    const orderRef = doc(db, COLLECTIONS.ORDERS, order.id);
    await setDoc(orderRef, {
      ...order,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    console.log('[Firestore] Order created:', order.id);

    // Also log payment record if paid
    if (order.paymentStatus === 'Paid') {
      await savePaymentRecord({
        paymentId: `PAY-${Date.now()}`,
        orderId: order.id,
        amount: order.totalAmount,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        paymentMethod: order.paymentMethod,
        status: 'SUCCESS',
        createdAt: new Date().toISOString()
      });
    }

    return true;
  } catch (err) {
    console.error('[Firestore] Error saving order:', err);
    return false;
  }
}

export async function fetchOrdersFromDB(): Promise<Order[]> {
  try {
    const q = query(collection(db, COLLECTIONS.ORDERS), limit(50));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => {
      orders.push(d.data() as Order);
    });
    return orders;
  } catch (err) {
    console.warn('[Firestore] Error fetching orders:', err);
    return [];
  }
}

export async function updateOrderStatusInDB(orderId: string, status: Order['orderStatus']): Promise<void> {
  try {
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(orderRef, { orderStatus: status });
  } catch (err) {
    console.warn('[Firestore] Error updating order status:', err);
  }
}

// 3. Sell Requests (Trade-in / Doorstep Pickup)
export async function saveSellRequestToDB(sellReq: BuyQuoteRequest): Promise<boolean> {
  try {
    const reqRef = doc(db, COLLECTIONS.SELL_REQUESTS, sellReq.id);
    await setDoc(reqRef, {
      ...sellReq,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    console.log('[Firestore] Sell request saved:', sellReq.id);
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving sell request:', err);
    return false;
  }
}

export async function fetchSellRequestsFromDB(): Promise<BuyQuoteRequest[]> {
  try {
    const q = query(collection(db, COLLECTIONS.SELL_REQUESTS), limit(50));
    const snap = await getDocs(q);
    const requests: BuyQuoteRequest[] = [];
    snap.forEach((d) => {
      requests.push(d.data() as BuyQuoteRequest);
    });
    return requests;
  } catch (err) {
    console.warn('[Firestore] Error fetching sell requests:', err);
    return [];
  }
}

// 4. Doorstep Repair Bookings
export async function saveRepairBookingToDB(repair: RepairJob): Promise<boolean> {
  try {
    const ref = doc(db, COLLECTIONS.REPAIR_BOOKINGS, repair.id);
    await setDoc(ref, {
      ...repair,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    console.log('[Firestore] Repair booking saved:', repair.id);
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving repair booking:', err);
    return false;
  }
}

// 5. Payment Records
export interface PaymentRecord {
  paymentId: string;
  orderId: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
}

export async function savePaymentRecord(payment: PaymentRecord): Promise<void> {
  try {
    const payRef = doc(db, COLLECTIONS.PAYMENTS, payment.paymentId);
    await setDoc(payRef, {
      ...payment,
      timestamp: serverTimestamp()
    });
    console.log('[Firestore] Payment record logged:', payment.paymentId);
  } catch (err) {
    console.warn('[Firestore] Error logging payment record:', err);
  }
}

// 6. Catalog Sync

// Returns whether the write actually succeeded. Callers must surface a
// failure to the admin - a permission-denied write (e.g. the admin's
// session having silently changed identity) used to fail here completely
// silently, so catalog edits that looked fine in the UI were never really
// persisted and vanished on the next reload.
// Firestore's client SDK rejects setDoc() outright if ANY nested field
// anywhere in the payload is literally `undefined` - not null, not simply
// missing, specifically the value `undefined` - throwing "Unsupported
// field value: undefined". Because the whole catalog is saved as ONE
// document, a single product anywhere in the array with one stray
// undefined field (e.g. an optional field a bulk import left out, with
// nothing existing to inherit it from) fails the ENTIRE catalog save -
// every other legitimate edit in the same batch gets silently rejected
// right along with it, and the only visible symptom is a generic "failed
// to save" banner with no hint that the real cause was a data shape
// problem, not an auth one. Stripping undefined values here, right before
// the write, is a last line of defense regardless of which code path
// produced the bad value.
function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(stripUndefinedDeep) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const result: any = {};
    for (const [k, v] of Object.entries(value as object)) {
      if (v === undefined) continue;
      result[k] = stripUndefinedDeep(v);
    }
    return result;
  }
  return value;
}

export async function saveCatalogToDB(catalog: CatalogProduct[]): Promise<boolean> {
  try {
    const docRef = doc(db, 'system', 'catalog');
    await setDoc(docRef, { products: stripUndefinedDeep(catalog) });
    console.log('[Firestore] Catalog saved successfully.');
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving catalog:', err);
    return false;
  }
}

// Deliberately distinguishes THREE outcomes, because collapsing them into
// one null used to cause real, permanent data loss: a transient read error
// (network blip, momentary rules/auth hiccup) was indistinguishable from
// "no catalog doc exists yet", so callers fell back to seed/localStorage
// data and then immediately persisted that fallback back to Firestore -
// silently wiping out real catalog data (including admin-imported
// products) any time a fetch merely failed once. Callers must NOT persist
// anything on status 'error'; only 'not-found' is a legitimate reason to
// seed fresh data, and [] from 'ok' is a deliberately cleared catalog that
// must stick, not fall back to seed data.
export type CatalogFetchResult =
  | { status: 'ok'; products: CatalogProduct[] }
  | { status: 'not-found' }
  | { status: 'error' };

export async function fetchCatalogFromDB(): Promise<CatalogFetchResult> {
  try {
    const docRef = doc(db, 'system', 'catalog');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { status: 'ok', products: (snap.data().products as CatalogProduct[]) || [] };
    }
    return { status: 'not-found' };
  } catch (err) {
    console.error('[Firestore] Error fetching catalog:', err);
    return { status: 'error' };
  }
}
