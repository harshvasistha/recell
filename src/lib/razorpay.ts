import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export interface RazorpayOptions {
  razorpayOrderId: string; // real order created server-side by createRazorpayOrder
  razorpayKeyId: string;   // returned alongside razorpayOrderId, never hardcoded
  amount: number; // in Rupees
  name: string;
  description: string;
  prefill: {
    name: string;
    phone: string;
    email?: string;
  };
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Calls the createRazorpayOrder Cloud Function, which reads the real order
// amount from Firestore server-side (never trusts a client-supplied
// amount) and returns a real Razorpay order id to check out against.
export async function createServerRazorpayOrder(orderId: string): Promise<{
  razorpayOrderId: string;
  amount: number;
  keyId: string;
}> {
  const fn = httpsCallable<{ orderId: string }, { razorpayOrderId: string; amount: number; keyId: string }>(
    functions,
    'createRazorpayOrder'
  );
  const res = await fn({ orderId });
  return res.data;
}

// Calls the verifyRazorpayPayment Cloud Function, which checks the HMAC
// signature server-side before marking anything as paid. Throws if
// verification fails - callers must NOT treat the Razorpay checkout
// widget's onSuccess callback alone as proof of payment.
export async function verifyServerRazorpayPayment(params: {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<void> {
  const fn = httpsCallable<typeof params, { verified: boolean }>(functions, 'verifyRazorpayPayment');
  const res = await fn(params);
  if (!res.data?.verified) {
    throw new Error('Payment could not be verified. Please contact support before retrying.');
  }
}

export async function openRazorpayCheckout(options: RazorpayOptions): Promise<void> {
  const loaded = await loadRazorpayScript();

  if (!loaded || !window.Razorpay) {
    // No fake/simulated success here - if the real gateway can't load,
    // the payment did not happen.
    options.onFailure?.({ message: 'Payment gateway failed to load. Please check your connection and try again.' });
    return;
  }

  const razorpayOptions = {
    key: options.razorpayKeyId,
    order_id: options.razorpayOrderId,
    amount: Math.round(options.amount * 100),
    currency: 'INR',
    name: 'Recell Mobile Store',
    description: options.description,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=120&q=80',
    handler: function (response: any) {
      // response.razorpay_signature is present because we passed a real
      // order_id above - Razorpay only returns a signature for orders it
      // created itself. This alone is NOT treated as proof of payment;
      // the caller must still call verifyServerRazorpayPayment.
      options.onSuccess({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      });
    },
    prefill: {
      name: options.prefill.name,
      contact: options.prefill.phone,
      email: options.prefill.email || `${options.prefill.phone}@recell.in`
    },
    notes: {
      store_address: 'Recell store, Pathsala road, Khekra, Baghpat, U.P., 250101',
      customer_phone: options.prefill.phone
    },
    theme: {
      color: '#0052FF'
    },
    modal: {
      ondismiss: function () {
        options.onFailure?.({ message: 'Payment cancelled by user' });
      }
    }
  };

  try {
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', function (response: any) {
      options.onFailure?.(response.error || { message: 'Payment failed' });
    });
    rzp.open();
  } catch (e) {
    options.onFailure?.(e);
  }
}
