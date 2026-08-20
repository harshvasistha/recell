import React, { useEffect, useState } from 'react';
import { Order } from '../../types';
import { fetchOrdersFromDB } from '../../lib/dbService';
import { RecellLogo } from '../RecellLogo';
import {
  User, Smartphone, Mail, MapPin, ShieldCheck, Package, Truck, LogOut,
  BadgeCheck, ArrowLeft, RefreshCw, Clock, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';

interface ProfilePageProps {
  user: { name: string; phone: string; role: string; email?: string; pincode?: string };
  onSignOut: () => void;
  onBackHome: () => void;
}

// Order documents store whatever the customer typed into the checkout form
// at the time (customerPhone/customerEmail), which doesn't always exactly
// match the normalized phone stored on the account profile (e.g. "+91
// 93105 52055" on the account vs "9310552055" typed at checkout). Comparing
// the last 10 digits (and case-insensitive email) is a deliberately forgiving
// match so a customer's real order history still shows up despite that.
function last10Digits(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10);
}

function matchesUser(order: Order, user: { phone: string; email?: string }): boolean {
  const phoneMatch = !!user.phone && last10Digits(order.customerPhone) === last10Digits(user.phone);
  const emailMatch = !!user.email && !!order.customerEmail &&
    order.customerEmail.trim().toLowerCase() === user.email.trim().toLowerCase();
  return phoneMatch || emailMatch;
}

const STATUS_STYLES: Record<Order['orderStatus'], string> = {
  'Confirmed': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Packed': 'bg-amber-50 text-amber-700 border-amber-100',
  'In Transit': 'bg-amber-50 text-amber-700 border-amber-100',
  'Out for Delivery': 'bg-blue-50 text-blue-700 border-blue-100',
  'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Returned': 'bg-rose-50 text-rose-700 border-rose-100'
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onSignOut, onBackHome }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setLoadError(false);
      // Reads the most recent 50 store-wide orders and filters to this
      // customer's - fine at current order volume, but if the store
      // outgrows that, this should become a real indexed
      // where(customerPhone == ...) Firestore query instead.
      const all = await fetchOrdersFromDB();
      if (cancelled) return;
      const mine = all
        .filter(o => matchesUser(o, user))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(mine);
      if (all.length === 0) setLoadError(true);
      setIsLoading(false);
      if (mine.length > 0) setExpandedOrderId(mine[0].id);
    })();
    return () => { cancelled = true; };
  }, [user.phone, user.email]);

  const activeOrder = orders.find(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Returned') || orders[0];
  const totalSpent = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + (o.codTokenAmount ?? o.totalAmount), 0);
  const activeWarrantyCount = orders.filter(o => o.warrantyExpiry && new Date(o.warrantyExpiry) > new Date()).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Top bar */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackHome}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Recell
            </button>
            <div className="hidden sm:block w-px h-4 bg-slate-700" />
            <div className="hidden sm:block">
              <RecellLogo variant="badge" />
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-full border border-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Identity card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#0052FF] to-indigo-700 p-6 sm:p-8 text-white relative">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white text-[#0052FF] font-black text-3xl flex items-center justify-center shadow-lg shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black truncate">{user.name}</h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-white/15 text-white px-2.5 py-0.5 rounded-full border border-white/25">
                    <BadgeCheck className="w-3 h-3 text-emerald-300" />
                    Verified Account
                  </span>
                  {user.role === 'admin' && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-100 mt-1">Your account, orders and delivery status - all in one place.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="p-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-[#0052FF]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mobile</p>
                <p className="text-sm font-bold text-slate-900 font-mono truncate">{user.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="p-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#0052FF]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</p>
                <p className="text-sm font-bold text-slate-900 truncate">{user.email || 'Not provided'}</p>
              </div>
            </div>
            <div className="p-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#0052FF]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pincode</p>
                <p className="text-sm font-bold text-slate-900 font-mono truncate">{user.pincode || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-center shadow-sm">
            <p className="text-xl sm:text-2xl font-black text-slate-900">{orders.length}</p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Total Orders</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-center shadow-sm">
            <p className="text-xl sm:text-2xl font-black text-slate-900">₹{totalSpent.toLocaleString('en-IN')}</p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Total Paid</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-center shadow-sm">
            <p className="text-xl sm:text-2xl font-black text-slate-900">{activeWarrantyCount}</p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Active Warranties</p>
          </div>
        </div>

        {/* Loading / error / empty states */}
        {isLoading && (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
            <RefreshCw className="w-5 h-5 text-slate-400 animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400">Loading your orders...</p>
          </div>
        )}

        {!isLoading && loadError && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-700">Couldn't load your orders right now.</p>
            <p className="text-xs text-slate-400 mt-1">Please check your connection and reload this page.</p>
          </div>
        )}

        {!isLoading && !loadError && orders.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No orders yet</p>
            <p className="text-xs text-slate-400 mt-1">Once you place an order, it'll show up here with live tracking.</p>
          </div>
        )}

        {/* Current shipment status */}
        {!isLoading && activeOrder && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                Current Shopping Status
              </h2>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_STYLES[activeOrder.orderStatus]}`}>
                {activeOrder.orderStatus}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <p className="text-xs font-mono font-bold text-indigo-600">{activeOrder.id}</p>
                <p className="text-sm font-bold text-slate-900">{activeOrder.items[0]?.title}{activeOrder.items.length > 1 ? ` +${activeOrder.items.length - 1} more` : ''}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{activeOrder.courierPartner} AWB</p>
                <p className="text-xs font-mono font-bold text-slate-700">{activeOrder.trackingNumber}</p>
              </div>
            </div>
            <div className="space-y-3">
              {activeOrder.trackingHistory.map((hist, idx) => {
                const isLast = idx === activeOrder.trackingHistory.length - 1;
                return (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isLast ? 'bg-emerald-100 border border-emerald-300 text-emerald-700' : 'bg-slate-100 border border-slate-200 text-slate-500'}`}>
                      {isLast ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-slate-900">{hist.status}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{hist.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{hist.location}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {activeOrder.codBalanceDue ? (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-xs text-amber-800 font-bold">
                ₹{activeOrder.codBalanceDue.toLocaleString('en-IN')} balance due to the courier on delivery.
              </div>
            ) : null}
          </div>
        )}

        {/* Order history */}
        {!isLoading && orders.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                Purchase History
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {orders.map(order => {
                const isExpanded = expandedOrderId === order.id;
                return (
                  <div key={order.id}>
                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="w-full flex items-center gap-4 p-4 sm:p-6 hover:bg-slate-50 transition-colors text-left"
                    >
                      <img
                        src={order.items[0]?.image}
                        alt={order.items[0]?.title}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-indigo-600">{order.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.orderStatus]}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {order.items[0]?.title}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                        </p>
                        <p className="text-[11px] text-slate-400">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center justify-end gap-1">
                          {isExpanded ? <>Hide <ChevronUp className="w-3 h-3" /></> : <>Track <ChevronDown className="w-3 h-3" /></>}
                        </p>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-6 -mt-1">
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                          {order.trackingHistory.map((hist, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-xs">
                              <div className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[9px] font-bold">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center gap-2">
                                  <span className="font-bold text-slate-800">{hist.status}</span>
                                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{hist.time}</span>
                                </div>
                                <p className="text-[11px] text-slate-500">{hist.location}</p>
                              </div>
                            </div>
                          ))}
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-[11px]">
                            <div>
                              <span className="text-slate-400 font-bold">Return window:</span>{' '}
                              <span className="text-slate-700 font-bold">{order.returnWindowExpiry}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Warranty until:
                              </span>{' '}
                              <span className="text-slate-700 font-bold">{order.warrantyExpiry}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
