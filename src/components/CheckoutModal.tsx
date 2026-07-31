import React, { useState } from 'react';
import { CatalogProduct, Order } from '../types';
import { X, ShieldCheck, Check, CreditCard, QrCode, Truck, Lock, IndianRupee, SmartphoneCharging } from 'lucide-react';

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
  if (!isOpen || items.length === 0) return null;

  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');

  // Customer Form
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 12345');
  const [customerEmail, setCustomerEmail] = useState('rahul.s@gmail.com');
  const [address, setAddress] = useState('Flat 301, Tower B, Green Acres');
  const [pincode, setPincode] = useState('110001');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');

  // Payment choice
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay UPI' | 'Razorpay Card' | 'COD (Deposit Paid)'>('Razorpay UPI');
  const [upiOption, setUpiOption] = useState<'qr' | 'handle'>('qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const totalAmount = items.reduce((acc, item) => acc + item.refurbPrice, 0);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `ORD-IN-${Math.floor(80000 + Math.random() * 9999)}`;
      const now = new Date();
      const returnExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const warrantyExpiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const newOrder: Order = {
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
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        courierPartner: 'Delhivery Express',
        trackingNumber: `DEL${Math.floor(100000000 + Math.random() * 900000000)}`,
        trackingHistory: [
          { time: now.toLocaleString('en-IN'), status: 'Order Confirmed & Payment Verified via Razorpay', location: 'RePhone Central Warehouse' },
          { time: 'Pending', status: '55-Point Inspection Re-Verification & Sealed Box Pack', location: 'Dispatch Hub' }
        ],
        returnWindowExpiry: returnExpiry,
        warrantyExpiry: warrantyExpiry
      };

      setCreatedOrder(newOrder);
      onOrderCreated(newOrder);
      setIsProcessing(false);
      setStep('success');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full text-white shadow-2xl relative my-8 overflow-hidden">
        {/* Header bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm">
              R
            </div>
            <span className="font-bold text-white text-sm">RePhone Pan-India Express Checkout</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'shipping' && (
            <form onSubmit={() => setStep('payment')} className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400" />
                Shipping & Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Phone Number (For Tracking Updates)</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1 font-semibold">Address (Flat/Street/Locality)</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">City / District</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-300">Order Items ({items.length}):</span>
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-400">
                    <span>{item.title}</span>
                    <span className="font-mono font-bold text-white">₹{item.refurbPrice.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                  <span>Total Payable:</span>
                  <span className="text-emerald-400 font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 text-sm"
              >
                Proceed to Razorpay Payment
              </button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  Razorpay Secure Payment Simulator
                </h2>
                <span className="text-xs text-slate-400 font-mono">Amount: ₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { key: 'Razorpay UPI', label: 'UPI / GPay', icon: QrCode },
                  { key: 'Razorpay Card', label: 'Debit / Credit Card', icon: CreditCard },
                  { key: 'COD (Deposit Paid)', label: 'COD (₹499 Token)', icon: Truck }
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.key}
                      type="button"
                      onClick={() => setPaymentMethod(pm.key as any)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === pm.key
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-indigo-400" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* UPI Options */}
              {paymentMethod === 'Razorpay UPI' && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3">
                  <span className="text-xs font-bold text-emerald-400">Scan Razorpay UPI QR Code to Pay</span>
                  <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
                    {/* Simulated QR Code SVG */}
                    <div className="w-full h-full border-4 border-slate-950 grid grid-cols-4 gap-1 p-1 bg-slate-900">
                      <div className="bg-emerald-400 rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-emerald-400 rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-emerald-400 rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-emerald-400 rounded-sm"></div>
                      <div className="bg-emerald-400 rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-emerald-400 rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-emerald-400 rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-emerald-400 rounded-sm"></div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">Accepts GPay, PhonePe, Paytm, BHIM & All Bank UPI Apps</p>
                </div>
              )}

              {paymentMethod === 'Razorpay Card' && (
                <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    placeholder="Card Number (4532 •••• •••• 8920)"
                    defaultValue="4532 8910 2938 8920"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="08/28"
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="892"
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Back to Address
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-3.5 rounded-xl shadow-xl shadow-emerald-500/25 text-sm flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <SmartphoneCharging className="w-4 h-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Pay ₹{totalAmount.toLocaleString('en-IN')} & Confirm Order
                    </>
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
                <h2 className="text-2xl font-black text-white mt-3">Order Confirmed!</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Thank you, <strong>{createdOrder.customerName}</strong>! Your order has been placed successfully and dispatched via <strong>{createdOrder.courierPartner}</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tracking Number:</span>
                  <span className="font-mono font-bold text-emerald-400">{createdOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping Address:</span>
                  <span className="text-slate-200">{createdOrder.shippingAddress}, {createdOrder.city} ({createdOrder.pincode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">3-Month Warranty Active Until:</span>
                  <span className="font-bold text-indigo-400">{createdOrder.warrantyExpiry}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-indigo-600/30"
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
