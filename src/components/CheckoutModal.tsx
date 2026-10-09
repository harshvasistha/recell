import React, { useState, useEffect } from 'react';
import { CatalogProduct, Order } from '../types';
import { X, Check, Truck, Lock, SmartphoneCharging } from 'lucide-react';
import { saveOrderToDB } from '../lib/dbService';
import { startPayuCheckout } from '../lib/payu';

interface CheckoutModalProps {
  items: CatalogProduct[];
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  isOpen,
  onClose,
  onOrderCreated
}) => {
  // Hooks must run unconditionally on every render of this component -
  // this modal stays mounted for the app's whole lifetime (App.tsx always
  // renders <CheckoutModal isOpen={...} .../>, it never unmounts it), so an
  // early return placed BEFORE these hooks used to make React execute a
  // different number of hooks between the "closed" and "open" renders of
  // the very same component instance. That is a Rules-of-Hooks violation
  // and made React throw ("Rendered more hooks than during the previous
  // render") - crashing to the ErrorBoundary the first time a customer
  // actually opened checkout. The isOpen/items.length guard now lives
  // AFTER all hooks are declared, right before the JSX return instead.
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');

  // Customer Form - empty defaults
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'PayU' | 'Cash on Delivery' | 'UPI Canara Bank' | 'UPI PayU Address'>('PayU');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [upiReference, setUpiReference] = useState('');
  const isManualUpi = paymentMethod === 'UPI Canara Bank' || paymentMethod === 'UPI PayU Address';
  const upiAddress = paymentMethod === 'UPI Canara Bank' ? '120039128600@cnrb' : 'atul.rathore@payu.in';
  const [paymentError, setPaymentError] = useState('');

  const totalAmount = items.reduce((acc, item) => acc + item.refurbPrice, 0);

  // Since this component now stays mounted across opens/closes (fixing the
  // hooks-order bug above means it can no longer unmount to reset its own
  // state for free), reset back to a clean shipping-details form each time
  // it's opened - otherwise a second purchase would reopen showing the
  // previous order's success screen or a stale payment error.
  useEffect(() => {
    if (isOpen) {
      setStep('shipping');
      setPaymentError('');
      setIsProcessing(false);
      setCreatedOrder(null);
      setUpiReference('');
    }
  }, [isOpen]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError('');

    if (paymentMethod === 'PayU') {
      try {
        await startPayuCheckout({ productIds: items.map(item => item.id), customerName, customerPhone, customerEmail, shippingAddress: address, pincode, city, state });
      } catch (err: any) {
        setPaymentError(err?.message || 'Could not open PayU. Please try again.');
        setIsProcessing(false);
      }
      return;
    }

    if (isManualUpi && !/^[0-9]{12}$/.test(upiReference.trim())) {
      setPaymentError('Enter the 12-digit UPI transaction reference from your payment app.');
      setIsProcessing(false);
      return;
    }
    const orderId = `ORD-IN-${crypto.randomUUID()}`;
    const now = new Date();
    const returnExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const warrantyExpiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // COD orders stay unpaid until the courier collects payment.
    const confirmedOrder: Order = {
      id: orderId,
      date: now.toISOString(),
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress: address,
      pincode,
      city,
      state,
      items: items.map(item => ({
        productId: item.id,
        title: item.title,
        refurbPrice: item.refurbPrice,
        image: item.images[0],
        serialImei: item.serialImei,
        warrantyMonths: item.warrantyMonths
      })),
      totalAmount,
      paymentMethod,
      ...(isManualUpi ? { upiAddress, upiReference: upiReference.trim() } : {}),
      paymentStatus: 'Pending Token',
      orderStatus: isManualUpi ? 'Awaiting Payment' : 'Confirmed',
      courierPartner: 'Delhivery Express',
      trackingNumber: '',
      trackingHistory: [
        { time: now.toLocaleString('en-IN'), status: isManualUpi ? 'UPI reference submitted - awaiting merchant verification' : 'Order Placed - Cash on Delivery', location: 'Recell Central Hub, Khekra' }
      ],
      returnWindowExpiry: isManualUpi ? '' : returnExpiry,
      warrantyExpiry: isManualUpi ? '' : warrantyExpiry
    };

    try {
      const saved = await saveOrderToDB(confirmedOrder);
      if (!saved) throw new Error('Could not create your order. Please try again.');

      setCreatedOrder(confirmedOrder);
      onOrderCreated(confirmedOrder);
      setIsProcessing(false);
      setStep('success');
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentError(err?.message || 'Something went wrong creating your order. Please try again.');
    }
  };

  if (!isOpen || items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full text-white shadow-2xl relative my-8 overflow-hidden">
        {/* Header bar */}
        <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-stone-950 font-black flex items-center justify-center text-sm">
              R
            </div>
            <span className="font-bold text-white text-sm">RePhone Pan-India Express Checkout</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'shipping' && (
            <form onSubmit={(e) => { e.preventDefault(); setStep('payment'); }} className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-400" />
                Shipping & Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Phone Number (For Tracking Updates)</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-300 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-300 mb-1 font-semibold">Address (Flat/Street/Locality)</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">City / District</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div><label className="block text-stone-300 mb-1 text-xs">State</label><input required value={state} onChange={e => setState(e.target.value)} className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-white" /></div>

              {/* Order Summary Box */}
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2 text-xs">
                <span className="font-bold text-stone-300">Order Items ({items.length}):</span>
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-stone-400">
                    <span>{item.title}</span>
                    <span className="font-mono font-bold text-white">₹{item.refurbPrice.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-sm text-white">
                  <span>Total Payable:</span>
                  <span className="text-emerald-400 font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-600/30 text-sm"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  Confirm Your Order
                </h2>
                <span className="text-xs text-stone-400 font-mono">
                  Amount: ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {paymentError && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-xl">
                  {paymentError}
                </div>
              )}

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3 text-sm">
                <label className="flex items-center gap-2"><input type="radio" name="paymentMethod" checked={paymentMethod === 'PayU'} onChange={() => setPaymentMethod('PayU')} />Pay online securely with PayU</label>
                <p className="text-xs text-stone-400">Choose UPI, cards or net banking on PayU’s hosted checkout. Your order is confirmed after payment verification.</p>
                <label className="flex items-center gap-2"><input type="radio" name="paymentMethod" checked={paymentMethod === 'UPI Canara Bank'} onChange={() => { setPaymentMethod('UPI Canara Bank'); setUpiReference(''); }} />UPI — Canara Bank QR</label>
                <label className="flex items-center gap-2"><input type="radio" name="paymentMethod" checked={paymentMethod === 'UPI PayU Address'} onChange={() => { setPaymentMethod('UPI PayU Address'); setUpiReference(''); }} />UPI — atul.rathore@payu.in</label>
                <label className="flex items-center gap-2"><input type="radio" name="paymentMethod" checked={paymentMethod === 'Cash on Delivery'} onChange={() => setPaymentMethod('Cash on Delivery')} />Cash on Delivery</label>
              </div>

              {isManualUpi && (
                <div className="rounded-xl border border-orange-500/40 bg-stone-950 p-4 space-y-3">
                  {paymentMethod === 'UPI Canara Bank' && <a href="/payments/canara-upi-qr.jpeg" target="_blank" rel="noreferrer"><img src="/payments/canara-upi-qr.jpeg" alt="Canara Bank UPI payment QR for 120039128600@cnrb" className="mx-auto w-full max-w-xs rounded-lg" /></a>}
                  <p className="text-xs text-stone-300">UPI ID: <strong className="break-all text-white select-all">{upiAddress}</strong></p>
                  <a href={`upi://pay?pa=${encodeURIComponent(upiAddress)}&pn=Recell&am=${totalAmount.toFixed(2)}&cu=INR`} className="inline-block rounded-lg bg-orange-700 px-4 py-2 text-sm font-bold">Open UPI app</a>
                  <p className="text-xs text-stone-300">Pay ₹{totalAmount.toLocaleString('en-IN')} to the selected UPI ID, then enter your transaction reference. Your order will remain awaiting payment verification until we confirm receipt.</p>
                  <label className="block text-xs text-stone-300">12-digit UPI transaction reference<input required inputMode="numeric" pattern="[0-9]{12}" maxLength={12} value={upiReference} onChange={e => setUpiReference(e.target.value.replace(/[^0-9]/g, ''))} className="mt-1 block w-full rounded-lg border border-stone-700 bg-stone-800 p-3 text-white" /></label>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs text-stone-400 hover:text-white"
                >
                  Back to Address
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black px-8 py-3.5 rounded-xl shadow-xl shadow-emerald-500/25 text-sm flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <SmartphoneCharging className="w-4 h-4 animate-spin" />
                      {paymentMethod === 'PayU' ? 'Opening PayU...' : 'Placing Order...'}
                    </>
                  ) : (
                    <>{paymentMethod === 'PayU' ? 'Pay with PayU' : isManualUpi ? 'Submit UPI payment reference' : `Confirm COD Order (₹${totalAmount.toLocaleString('en-IN')})`}</>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && createdOrder && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  Order ID: {createdOrder.id}
                </span>
                <h2 className="text-2xl font-black text-white mt-3">{createdOrder.orderStatus === 'Awaiting Payment' ? 'Payment Reference Submitted' : 'Order Confirmed!'}</h2>
                <p className="text-xs text-stone-300 mt-1">
                  Thank you, <strong>{createdOrder.customerName}</strong>! {createdOrder.orderStatus === 'Awaiting Payment' ? 'Your order is awaiting merchant payment verification. Submitting a reference does not confirm payment.' : 'Your order has been placed successfully. Shipping details will appear after dispatch.'}
                </p>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">Tracking AWB Number:</span>
                  <span className="font-mono font-bold text-emerald-400">{createdOrder.trackingNumber || 'Awaiting dispatch'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Shipping Address:</span>
                  <span className="text-stone-200">{createdOrder.shippingAddress}, {createdOrder.city} ({createdOrder.pincode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">3-Month Recell Warranty Active Until:</span>
                  <span className="font-bold text-orange-400">{createdOrder.warrantyExpiry || 'Awaiting payment verification'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{createdOrder.upiReference ? 'UPI amount awaiting verification:' : 'Amount Due on Delivery:'}</span>
                  <span className="font-bold text-amber-400">₹{createdOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-orange-600/30"
              >
                Continue Shopping / Track Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
