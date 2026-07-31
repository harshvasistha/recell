import React, { useState } from 'react';
import { Order, ReturnRequest, WarrantyClaim } from '../types';
import { Search, Truck, ShieldCheck, RefreshCw, CheckCircle2, Clock, Wrench, AlertCircle, MapPin, ArrowRight } from 'lucide-react';

interface TrackOrderAndWarrantyProps {
  orders: Order[];
  onSubmitReturn: (req: ReturnRequest) => void;
  onSubmitWarranty: (claim: WarrantyClaim) => void;
}

export const TrackOrderAndWarranty: React.FC<TrackOrderAndWarrantyProps> = ({
  orders,
  onSubmitReturn,
  onSubmitWarranty
}) => {
  const [searchOrderId, setSearchOrderId] = useState<string>('ORD-IN-80249');
  const [foundOrder, setFoundOrder] = useState<Order | null>(orders[0] || null);

  // Return Form State
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('Changed mind within 7-day window');
  const [returnDetails, setReturnDetails] = useState('Device in original state, requesting refund.');
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  // Warranty Claim Form State
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [issueType, setIssueType] = useState<WarrantyClaim['issueType']>('Battery Fault');
  const [issueDetails, setIssueDetails] = useState('Battery drains quickly after 20 minutes of usage.');
  const [warrantySubmitted, setWarrantySubmitted] = useState(false);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const match = orders.find(o => o.id.toLowerCase().includes(searchOrderId.toLowerCase().trim()));
    if (match) {
      setFoundOrder(match);
    } else {
      alert(`No order found matching ID "${searchOrderId}". Check order number.`);
    }
  };

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundOrder) return;

    const newReturn: ReturnRequest = {
      id: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: foundOrder.id,
      customerName: foundOrder.customerName,
      itemTitle: foundOrder.items[0]?.title || 'Refurbished Device',
      reason: returnReason,
      details: returnDetails,
      status: 'Reverse Pickup Scheduled',
      reverseTrackingId: `SHIP-REV-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0]
    };

    onSubmitReturn(newReturn);
    setReturnSubmitted(true);
  };

  const handleCreateWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundOrder) return;

    const newClaim: WarrantyClaim = {
      id: `WAR-${Math.floor(3000 + Math.random() * 9000)}`,
      orderId: foundOrder.id,
      serialImei: foundOrder.items[0]?.serialImei || '358910293847102',
      customerName: foundOrder.customerName,
      customerPhone: foundOrder.customerPhone,
      issueType,
      issueDetails,
      status: 'In Repair Queue',
      reverseTrackingId: `SHIP-WAR-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0]
    };

    onSubmitWarranty(newClaim);
    setWarrantySubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-slate-900">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1 w-fit mb-2">
            <Truck className="w-3.5 h-3.5 text-indigo-600" />
            Post-Purchase Support & Warranty Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900">Track Order, 7-Day Returns & 3-Month Warranty</h1>
          <p className="text-xs text-slate-500 mt-1">Check live express shipment status or register a fault claim for doorstep repair.</p>
        </div>

        {/* Search Order ID Form */}
        <form onSubmit={handleSearchOrder} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            placeholder="Enter Order ID e.g. ORD-IN-80249"
            className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-full text-xs flex items-center gap-1 shadow-sm transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            Track
          </button>
        </form>
      </div>

      {foundOrder ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-600">{foundOrder.id}</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {foundOrder.orderStatus}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{foundOrder.items[0]?.title}</h2>
              <p className="text-xs text-slate-500">Buyer: {foundOrder.customerName} ({foundOrder.customerPhone})</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Delhivery Tracking</span>
              <p className="text-xs font-mono font-bold text-indigo-600">{foundOrder.trackingNumber}</p>
            </div>
          </div>

          {/* Shipment Timeline Status */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-indigo-600" />
              Pan-India Express Tracking Timeline
            </h3>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              {foundOrder.trackingHistory.map((hist, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs relative">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{hist.status}</span>
                      <span className="text-[10px] font-mono text-slate-400">{hist.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">📍 Location: {hist.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warranty & Return Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* 7-Day Return Box */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-emerald-600" />
                    7-Day Hassle-Free Return Window
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full font-mono">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Return window active until <strong>{foundOrder.returnWindowExpiry}</strong>. Includes free reverse courier pickup from your address.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowReturnModal(true);
                  setReturnSubmitted(false);
                }}
                className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                Request 7-Day Return & Refund
              </button>
            </div>

            {/* 3-Month Warranty Box */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    3-Month Warranty Claim
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full font-mono">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Hardware coverage active until <strong>{foundOrder.warrantyExpiry}</strong>. Reverse pickup sends device to repair module queue.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowWarrantyModal(true);
                  setWarrantySubmitted(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                File Warranty Repair Claim
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 font-medium shadow-sm">
          Enter an order ID above to view tracking & warranty details.
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && foundOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl text-slate-900">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-600" />
              Request 7-Day Easy Return
            </h3>

            {returnSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <p className="font-bold text-emerald-800 text-sm">Reverse Pickup Arranged!</p>
                <p className="text-slate-600">Delhivery agent will pick up the device from {foundOrder.shippingAddress}. Refund processed after inspection.</p>
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-full mt-2 text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateReturn} className="space-y-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Reason for Return</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  >
                    <option value="Changed mind within 7-day window">Changed mind within 7-day window</option>
                    <option value="Color or model mismatch">Color or model mismatch</option>
                    <option value="Minor cosmetic dislike">Minor cosmetic dislike</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Additional Comments</label>
                  <input
                    type="text"
                    value={returnDetails}
                    onChange={(e) => setReturnDetails(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-full"
                  >
                    Submit Return Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Warranty Claim Modal */}
      {showWarrantyModal && foundOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl text-slate-900">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              File 3-Month Warranty Claim
            </h3>

            {warrantySubmitted ? (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-2">
                <p className="font-bold text-indigo-900 text-sm">Warranty Claim Ticket Raised!</p>
                <p className="text-slate-600">Reverse pickup scheduled. Device will enter our repair queue for technician diagnosis.</p>
                <button
                  onClick={() => setShowWarrantyModal(false)}
                  className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-full mt-2 text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateWarranty} className="space-y-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Reported Hardware Fault</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  >
                    <option value="Battery Fault">Battery Fault</option>
                    <option value="Display/Touch Issue">Display/Touch Issue</option>
                    <option value="Speaker/Mic">Speaker/Mic</option>
                    <option value="Charging Failure">Charging Failure</option>
                    <option value="Software/Other">Software/Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Describe Problem Details</label>
                  <textarea
                    rows={3}
                    value={issueDetails}
                    onChange={(e) => setIssueDetails(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWarrantyModal(false)}
                    className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-full"
                  >
                    Submit Claim to Repair Queue
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
