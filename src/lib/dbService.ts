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
import { Order, BuyQuoteRequest, RepairJob } from '../types';

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
    const userRef = doc(db, COLLECTIONS.USERS, user.phone || user.uid);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('[Firestore] User profile saved:', user.phone);
  } catch (err) {
    console.warn('[Firestore] Error saving user profile:', err);
  }
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
