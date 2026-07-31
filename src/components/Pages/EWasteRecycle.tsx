import React, { useState } from 'react';
import { Leaf, Recycle, ShieldCheck, Award, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

export const EWasteRecycle: React.FC = () => {
  const [deviceDetails, setDeviceDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('250101');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10 text-slate-900">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5" /> Zero-Landfill Eco Initiative
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Dispose Old Dead Phones Responsibly</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            Dead or water-damaged phones sitting in drawers release toxic lead, mercury, and lithium into soil when discarded improperly. Schedule a free eco-pickup with Recell.
          </p>
        </div>

        <div className="bg-emerald-800/60 border border-emerald-700 p-4 rounded-2xl text-center shrink-0 space-y-1">
          <p className="text-3xl font-black text-emerald-300 font-mono">45+ Tons</p>
          <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">E-Waste Diverted</p>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Recycle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Free Doorstep Pickup</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We pick up non-working, broken, or obsolete electronics directly from your address at zero delivery fee.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Sanitized Recycling</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All circuits, metals, and glass components are shredded and re-melted under authorized PCB pollution board norms.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Eco Champion Certificate</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Receive an official RE-PHONE Green Disposal Certificate along with an e-voucher for your next trade-in.
          </p>
        </div>
      </div>

      {/* Pickup Request Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Request Free E-Waste Pickup</h2>
          <p className="text-xs text-slate-500">Dispose dead phones, old chargers, or swollen batteries safely.</p>
        </div>

        {submitted ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-900">Eco-Pickup Request Logged!</h3>
            <p className="text-xs text-emerald-700">
              Thank you for keeping Meerut &amp; India clean! Our courier partner will collect your e-waste from Pincode {pincode}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">E-Waste Item Description</label>
              <textarea
                required
                rows={3}
                value={deviceDetails}
                onChange={(e) => setDeviceDetails(e.target.value)}
                placeholder="e.g. 2 dead Nokia phones, 1 bloated Samsung battery, broken charger cables"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 Phone"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all mt-2"
            >
              Schedule Free Eco-Pickup
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
