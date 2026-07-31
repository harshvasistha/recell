import React, { useState } from 'react';
import { Smartphone, Banknote, ShieldCheck, Truck, RotateCcw, Wrench, CheckCircle2, ChevronRight } from 'lucide-react';

export const HowItWorks: React.FC<{ onNavigate: (tab: 'sell' | 'buy' | 'track') => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'selling' | 'buying' | 'repair'>('selling');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10 text-slate-900">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-indigo-100 uppercase tracking-wider inline-block">
          Complete Operational Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">How Recell Works</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
          Whether you are selling an old device for instant cash, buying a 3-month warranted phone, or booking doorstep repair, here is our transparent 3-step process.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex justify-center gap-2 bg-slate-100 p-1.5 rounded-full max-w-md mx-auto border border-slate-200">
        <button
          onClick={() => setActiveTab('selling')}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
            activeTab === 'selling' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Selling Your Phone
        </button>
        <button
          onClick={() => setActiveTab('buying')}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
            activeTab === 'buying' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Buying Refurbished
        </button>
        <button
          onClick={() => setActiveTab('repair')}
          className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
            activeTab === 'repair' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Doorstep Repair
        </button>
      </div>

      {/* Selling Process */}
      {activeTab === 'selling' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4 relative">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-mono font-black text-lg flex items-center justify-center">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base">Select Model &amp; Answer 32-Point Diagnostic Questions</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose your exact brand, model, storage, screen scratches, battery health, and body condition. Our 60-second AI quote engine generates an instant valuation range.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4 relative">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-mono font-black text-lg flex items-center justify-center">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base">Book Free Doorstep Pickup Slot</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your convenient date, time slot, and address in Meerut Pincode 250101 or surrounding radius. Our agent is assigned to visit your doorstep.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4 relative">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-mono font-black text-lg flex items-center justify-center">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base">Live Agent Testing &amp; Instant UPI Cash</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our certified field agent conducts a 2-minute live hardware test at your doorstep, confirms final price, and transfers instant UPI or Cash before picking up the phone.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('sell')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-md inline-flex items-center gap-2"
            >
              Get Instant 60s Quote Now
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Buying Process */}
      {activeTab === 'buying' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 font-mono font-black text-lg flex items-center justify-center">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base">Browse Certified Grade A/B Catalog</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore transparently graded devices with exact condition tags (Like New, Superb, Good), real IMEI tags, battery health percentages, and included accessories.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 font-mono font-black text-lg flex items-center justify-center">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base">Secure Razorpay UPI / Card Checkout</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pay safely via Razorpay UPI, Credit/Debit cards, Netbanking, or partial COD deposit. Your order is instantly logged for express packing.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 font-mono font-black text-lg flex items-center justify-center">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base">Pan-India Express Shipping &amp; 3-Month Warranty</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Track live Delhivery express shipping. Receive your sanitized sealed device protected by 3-Month Recell Warranty and 7-Day Easy Return policy.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('buy')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-md inline-flex items-center gap-2"
            >
              Browse Certified Catalog
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Repair Process */}
      {activeTab === 'repair' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 font-mono font-black text-lg flex items-center justify-center">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base">Select Fault &amp; Upfront Price</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose screen glass replacement, original battery swap, camera module fix, or charging port repair. Get fixed upfront pricing.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 font-mono font-black text-lg flex items-center justify-center">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base">Technician Visits Your Doorstep</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Level-2 trained mobile technician arrives at your location with portable ESD-safe tools and original replacement components.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 font-mono font-black text-lg flex items-center justify-center">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base">30-Min Live Repair &amp; 6-Month Warranty</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Watch the repair happen live in front of your eyes. Test the device and receive a 6-Month Repair Warranty card.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
