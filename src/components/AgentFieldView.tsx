import React, { useState } from 'react';
import { BuyQuoteRequest } from '../types';
import { UserCheck, MapPin, Phone, CheckCircle2, XCircle, IndianRupee, Smartphone, ShieldAlert, ArrowRight, Camera, Wrench } from 'lucide-react';

interface AgentFieldViewProps {
  buyRequests: BuyQuoteRequest[];
  onUpdateBuyRequest: (updatedReq: BuyQuoteRequest, sendToRepair: boolean) => void;
}

export const AgentFieldView: React.FC<AgentFieldViewProps> = ({
  buyRequests,
  onUpdateBuyRequest
}) => {
  const [activeRequest, setActiveRequest] = useState<BuyQuoteRequest | null>(buyRequests[0] || null);

  // Agent Doorstep Checklist State
  const [touchOk, setTouchOk] = useState(true);
  const [cameraOk, setCameraOk] = useState(true);
  const [batteryOk, setBatteryOk] = useState(true);
  const [speakersOk, setSpeakersOk] = useState(true);
  const [imeiMatched, setImeiMatched] = useState(true);

  // Price offering
  const [finalPriceOffer, setFinalPriceOffer] = useState<number>(activeRequest?.roughQuoteMin || 28000);
  const [agentNotes, setAgentNotes] = useState<string>('Screen and body match questionnaire description. Battery health verified.');
  const [needsRepair, setNeedsRepair] = useState<boolean>(false);
  const [payoutSuccess, setPayoutSuccess] = useState<boolean>(false);

  const localRequests = buyRequests.filter(r => r.isLocalRadius);

  const handleSelectRequest = (req: BuyQuoteRequest) => {
    setActiveRequest(req);
    setFinalPriceOffer(req.roughQuoteMin || 25000);
    setPayoutSuccess(false);
  };

  const handleTriggerDoorstepPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequest) return;

    setPayoutSuccess(true);

    setTimeout(() => {
      const updated: BuyQuoteRequest = {
        ...activeRequest,
        finalAgreedPrice: finalPriceOffer,
        status: 'completed_paid',
        payoutTxnId: `UPI-RAZORPAYX-${Math.floor(10000000 + Math.random() * 90000000)}`,
        agentNotes
      };

      onUpdateBuyRequest(updated, needsRepair);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-slate-900">
      {/* Agent Doorstep Portal Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1 w-fit mb-2">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            Field Agent Doorstep Inspection Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900">Doorstep Verification & Instant UPI Payout</h1>
          <p className="text-xs text-slate-500 mt-1">
            Agent Assigned: <strong>Agent Rajesh (Khekra 250101 Central Hub)</strong>
          </p>
        </div>

        <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Assigned Local Pickups</span>
          <p className="text-xl font-black text-emerald-600 font-mono">{localRequests.length} Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Assigned Pickups List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-800 px-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Pickups Queue (5km Radius)
          </h2>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {localRequests.map(req => (
              <div
                key={req.id}
                onClick={() => handleSelectRequest(req)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeRequest?.id === req.id
                    ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-start text-xs">
                  <span className="font-mono text-indigo-600 font-bold">{req.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    req.status === 'completed_paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.status === 'completed_paid' ? 'PAID & STORED' : 'INSPECTION DUE'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-1">{req.modelName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <span>{req.sellerName}</span> • <Phone className="w-3 h-3 text-slate-400" /> <span>{req.sellerPhone}</span>
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-1">📍 {req.address} ({req.pincode})</p>

                <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Rough Quote:</span>
                  <span className="font-mono font-bold text-emerald-600">₹{req.roughQuoteMin.toLocaleString('en-IN')} - ₹{req.roughQuoteMax.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Doorstep Diagnostics & Payout Workstation */}
        {activeRequest ? (
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <span className="text-xs text-emerald-600 font-bold">Active Doorstep Inspection</span>
                <h2 className="text-xl font-black text-slate-900">{activeRequest.modelName}</h2>
                <p className="text-xs text-slate-500">Seller: <strong>{activeRequest.sellerName}</strong> ({activeRequest.sellerPhone})</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target UPI ID</span>
                <p className="text-xs font-mono font-bold text-indigo-600">{activeRequest.upiId}</p>
              </div>
            </div>

            {/* Seller Submitted Photos Preview */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-600" />
                Seller Uploaded Photos
              </label>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {activeRequest.photos.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-20 h-20 object-cover rounded-2xl border border-slate-200 bg-slate-50 shrink-0 shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Doorstep Hardware Testing Checklist */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                Physical Device Inspection Checklist
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${touchOk ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                  <input type="checkbox" checked={touchOk} onChange={(e) => setTouchOk(e.target.checked)} className="accent-emerald-600" />
                  <span>Touch Response Passed</span>
                </label>

                <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${cameraOk ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                  <input type="checkbox" checked={cameraOk} onChange={(e) => setCameraOk(e.target.checked)} className="accent-emerald-600" />
                  <span>Cameras & Flash OK</span>
                </label>

                <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${batteryOk ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                  <input type="checkbox" checked={batteryOk} onChange={(e) => setBatteryOk(e.target.checked)} className="accent-emerald-600" />
                  <span>Battery Health Verified</span>
                </label>

                <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${speakersOk ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                  <input type="checkbox" checked={speakersOk} onChange={(e) => setSpeakersOk(e.target.checked)} className="accent-emerald-600" />
                  <span>Speaker & Mic OK</span>
                </label>

                <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${imeiMatched ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}>
                  <input type="checkbox" checked={imeiMatched} onChange={(e) => setImeiMatched(e.target.checked)} className="accent-emerald-600" />
                  <span>IMEI Clean / Matched</span>
                </label>
              </div>
            </div>

            {/* Final Price Negotiation & Payout Form */}
            <form onSubmit={handleTriggerDoorstepPayout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Final Agreed Doorstep Price (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      value={finalPriceOffer}
                      onChange={(e) => setFinalPriceOffer(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-lg font-black font-mono text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Rough Quote Range: ₹{activeRequest.roughQuoteMin.toLocaleString('en-IN')} - ₹{activeRequest.roughQuoteMax.toLocaleString('en-IN')}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Route Destination after Pickup
                  </label>
                  <label className={`p-3 rounded-2xl border flex items-center gap-2 cursor-pointer text-xs transition-all ${needsRepair ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <input
                      type="checkbox"
                      checked={needsRepair}
                      onChange={(e) => setNeedsRepair(e.target.checked)}
                      className="accent-amber-600"
                    />
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-amber-600" />
                      <span>Send to Repair Queue (Needs refurbishment)</span>
                    </div>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agent Verification Notes</label>
                  <input
                    type="text"
                    value={agentNotes}
                    onChange={(e) => setAgentNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              {payoutSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-800 space-y-1">
                  <p className="font-bold text-sm">Instant UPI Payout Triggered Successfully!</p>
                  <p className="text-xs font-mono">Txn Ref: UPI-RAZORPAYX-{Math.floor(10000000 + Math.random() * 90000000)}</p>
                  <p className="text-[11px] text-emerald-600">Device added to {needsRepair ? 'Repair Job Queue' : 'Store Resale Catalog'}.</p>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={activeRequest.status === 'completed_paid'}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-full text-base shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {activeRequest.status === 'completed_paid' ? 'Paid & Completed' : `Confirm Final Price ₹${finalPriceOffer.toLocaleString('en-IN')} & Transfer Instant UPI`}
                </button>
              )}
            </form>
          </div>
        ) : (
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 font-medium shadow-sm">
            Select a buy request from the queue to start doorstep inspection.
          </div>
        )}
      </div>
    </div>
  );
};
