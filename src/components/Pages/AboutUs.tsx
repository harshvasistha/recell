import React from 'react';
import { ShieldCheck, Award, Users, MapPin, Leaf, CheckCircle2, Building2, Truck } from 'lucide-react';

export const AboutUs: React.FC<{ onStartSelling: () => void }> = ({ onStartSelling }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12 text-slate-900">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-indigo-100 uppercase tracking-wider inline-block">
          About Recell India
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Pioneering India's Most Transparent Mobile ReCommerce Platform
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Founded with a mission to eliminate unorganized trade-in friction, Recell bridges local doorstep convenience with certified 32-point hardware refurbishment and pan-India express logistics.
        </p>
      </div>

      {/* Core Stats Bento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-black text-indigo-600 font-mono">50,000+</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Devices Recycled &amp; Sold</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">₹12.4 Cr</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Instant UPI Paid</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-black text-amber-600 font-mono">32 Points</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">QC Hardware Check</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-black text-purple-600 font-mono">250101</p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Local Doorstep Hub</p>
        </div>
      </div>

      {/* Company Mission Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Zero-Renege Pricing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike local unorganized shops that drastically reduce quotes at your door, our transparent 60-second valuation engine gives honest quotes supported by automated test checklists.
          </p>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">State-of-the-Art Refurb Facility</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every pre-owned device is inspected by Level-2 certified technicians, sanitized in UV-C chambers, fitted with high-health original battery cells, and re-boxed with warranty cards.
          </p>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Green Eco Responsibility</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            E-waste is a major ecological concern. By extending smartphone lifespans and recycling unsalvageable components, we prevent over 45 tons of lithium e-waste from entering landfills.
          </p>
        </div>
      </div>

      {/* Local Hub Spotlight */}
      <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Central Hub: Recell store, Pathsala road, Khekra, Baghpat, U.P., 250101
          </span>
          <h2 className="text-2xl font-black">Same-Day Doorstep Pickup &amp; Express Delivery</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Our local agents serve Pincode 250101 and surrounding sectors within a 5km radius for instant doorstep cash pickups. Pan-India shipments are handled via express courier partners Delhivery and Shiprocket.
          </p>
        </div>

        <button
          onClick={onStartSelling}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3.5 rounded-full text-xs shadow-md shrink-0 transition-all"
        >
          Check My Phone Price
        </button>
      </div>
    </div>
  );
};
