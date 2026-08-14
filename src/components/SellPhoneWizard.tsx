import React, { useState } from 'react';
import { DeviceModel, ConditionAnswers, BuyQuoteRequest, PricingRules } from '../types';
import { calculateRoughQuote, isLocalPincode } from '../utils/pricingEngine';
import { Smartphone, Check, AlertCircle, Camera, Upload, Calendar, Clock, MapPin, IndianRupee, Sparkles, ShieldCheck, ArrowRight, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { MAJOR_MOBILE_BRANDS } from '../data/brandsData';

interface SellPhoneWizardProps {
  deviceModels: DeviceModel[];
  pricingRules: PricingRules;
  onSubmitBuyRequest: (req: BuyQuoteRequest) => void;
  onNavigateToAgent: () => void;
}

export const SellPhoneWizard: React.FC<SellPhoneWizardProps> = ({
  deviceModels,
  pricingRules,
  onSubmitBuyRequest,
  onNavigateToAgent
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null);
  const [searchModelQuery, setSearchModelQuery] = useState<string>('');
  const [manufacturingYear, setManufacturingYear] = useState<number | null>(null);

  // Questionnaire state
  const [answers, setAnswers] = useState<ConditionAnswers>({
    screenCondition: 'flawless',
    bodyCondition: 'minor_scratches',
    batteryHealth: 'above_85',
    touchWorking: true,
    cameraWorking: true,
    speakerWorking: true,
    chargingPortWorking: true,
    boxIncluded: true,
    chargerIncluded: true,
    pincode: '',
    photos: {}
  });

  // Seller details state
  const [sellerName, setSellerName] = useState<string>('');
  const [sellerPhone, setSellerPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledSlot, setScheduledSlot] = useState<string>('02:00 PM - 04:00 PM');

  const filteredModels = deviceModels.filter(m => {
    const matchesBrand = selectedBrand === '' || m.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesSearch = m.name.toLowerCase().includes(searchModelQuery.toLowerCase()) ||
                          m.brand.toLowerCase().includes(searchModelQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const currentQuoteBreakdown = selectedModel
    ? calculateRoughQuote(selectedModel.baseMarketPrice, answers, pricingRules)
    : null;

  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel || !currentQuoteBreakdown) return;

    const isLocal = isLocalPincode(answers.pincode);

    const newReq: BuyQuoteRequest = {
      id: `REQ-${answers.pincode || '250101'}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString(),
      modelId: selectedModel.id,
      modelName: `${selectedModel.brand} ${selectedModel.name} (${selectedModel.variant}) - ${manufacturingYear}`,
      brand: selectedModel.brand,
      sellerName: sellerName || 'Seller',
      sellerPhone: sellerPhone || '+91 98765 00000',
      address: address || 'Khekra Area',
      pincode: answers.pincode || '250101',
      isLocalRadius: isLocal,
      conditionAnswers: answers,
      roughQuoteMin: currentQuoteBreakdown.roughQuoteMin,
      roughQuoteMax: currentQuoteBreakdown.roughQuoteMax,
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      scheduledSlot,
      upiId: upiId || 'seller@upi',
      status: 'pickup_scheduled',
      assignedAgent: isLocal ? 'Agent Rajesh (Khekra Hub)' : 'Courier Pickup Desk',
      photos: [selectedModel.imageUrl]
    };

    onSubmitBuyRequest(newReq);
    setStep(6); // Confirmation step
  };

  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Wizard Header Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 text-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Smartphone className="w-7 h-7 text-indigo-600" />
              Sell Old Mobile Phone
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Get an instant quote and doorstep spot UPI payment in 60 seconds.
            </p>
          </div>
          <span className="hidden sm:inline bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono text-xs px-3.5 py-1 rounded-full font-bold">
            Step {step} of 5
          </span>
        </div>

        {/* Breadcrumb / Step Indicator */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs font-bold text-slate-400">
          <button onClick={() => setStep(1)} className={`transition-all ${step >= 1 ? 'text-indigo-600' : ''}`}>1. Brand</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => setStep(2)} disabled={step < 2} className={`transition-all ${step >= 2 ? 'text-indigo-600' : ''}`}>2. Model</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => setStep(3)} disabled={step < 3} className={`transition-all ${step >= 3 ? 'text-indigo-600' : ''}`}>3. Year</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => setStep(4)} disabled={step < 4} className={`transition-all ${step >= 4 ? 'text-indigo-600' : ''}`}>4. Diagnostics</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => setStep(5)} disabled={step < 5} className={`transition-all ${step >= 5 ? 'text-indigo-600' : ''}`}>5. Quote</button>
        </div>
      </div>

      {/* STEP 1: BRAND SELECTION */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 mb-6 font-heading">Select Mobile Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {MAJOR_MOBILE_BRANDS.map(brand => (
              <button
                key={brand.id}
                onClick={() => {
                  setSelectedBrand(brand.name);
                  setSearchModelQuery('');
                  setStep(2);
                }}
                className="group p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center gap-4 relative overflow-hidden"
              >
                <div className="h-24 flex items-center justify-center w-full">
                  <img src={brand.logoUrl} alt={brand.name} className="max-h-20 max-w-[140px] object-contain filter group-hover:scale-110 transition-transform" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
                <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600">{brand.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: MODEL SELECTION */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <button onClick={() => setStep(1)} className="text-xs text-indigo-600 font-bold mb-2 flex items-center gap-1 hover:underline"><ArrowLeft className="w-3 h-3" /> Back to Brands</button>
              <h2 className="text-2xl font-black text-slate-900 font-heading">Select {selectedBrand} Model</h2>
            </div>
            <input
              type="text"
              placeholder={`Search ${selectedBrand} models...`}
              value={searchModelQuery}
              onChange={(e) => setSearchModelQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm w-full md:w-80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredModels.length > 0 ? (
              filteredModels.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedModel(m);
                    setStep(3);
                  }}
                  className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all flex flex-col items-center gap-3 text-center"
                >
                  <img
                    src={m.imageUrl}
                    alt={m.name}
                    className="w-28 h-28 object-contain"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{m.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{m.variant}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                No models found for {selectedBrand}. <br />
                <span className="text-xs">We are continuously adding more models.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: YEAR SELECTION */}
      {step === 3 && selectedModel && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
          <button onClick={() => setStep(2)} className="text-xs text-indigo-600 font-bold mb-2 flex items-center gap-1 hover:underline"><ArrowLeft className="w-3 h-3" /> Back to Models</button>
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-slate-900 font-heading">Manufacturing Year</h2>
            <p className="text-slate-500 text-sm">When was your {selectedModel.name} manufactured?</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
            {years.map(year => (
              <button
                key={year}
                onClick={() => {
                  setManufacturingYear(year);
                  setStep(4);
                }}
                className="py-4 px-2 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: HARDWARE DIAGNOSTICS */}
      {step === 4 && selectedModel && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <button onClick={() => setStep(3)} className="text-xs text-indigo-600 font-bold mb-2 flex items-center gap-1 hover:underline"><ArrowLeft className="w-3 h-3" /> Back to Year</button>
              <h2 className="text-2xl font-black text-slate-900 font-heading flex items-center gap-2">
                Hardware Diagnostic Engine
              </h2>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 font-bold">Selected Device</span>
              <p className="text-sm font-black text-indigo-600">{selectedModel.name} ({manufacturingYear})</p>
            </div>
          </div>

          <div className="space-y-8">
             {/* 1. Screen Condition */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2"><Smartphone className="w-4 h-4 text-indigo-600" /> 1. Screen & Display Condition</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'flawless', label: 'Flawless', sub: 'Zero marks' },
                  { key: 'minor_scratches', label: 'Minor Scratches', sub: 'Light hair-line marks' },
                  { key: 'cracked', label: 'Screen Cracked', sub: 'Glass broken' },
                  { key: 'display_fault', label: 'Display Fault', sub: 'Spots / Green line' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAnswers({ ...answers, screenCondition: opt.key as any })}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      answers.screenCondition === opt.key
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm ring-1 ring-indigo-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-bold text-sm">{opt.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Body Condition */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-600" /> 2. Body & Back Panel</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'flawless', label: 'Flawless', sub: 'Like new' },
                  { key: 'minor_scratches', label: 'Minor Scratches', sub: 'Regular wear' },
                  { key: 'dented', label: 'Dented', sub: 'Deep dents on frame' },
                  { key: 'cracked', label: 'Back Cracked', sub: 'Glass shattered' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setAnswers({ ...answers, bodyCondition: opt.key as any })}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      answers.bodyCondition === opt.key
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm ring-1 ring-indigo-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-bold text-sm">{opt.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Functional Toggles */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800">3. Hardware Functionality</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'touchWorking', label: 'Touch Screen Working Perfectly?' },
                  { key: 'cameraWorking', label: 'Front & Back Camera Working?' },
                  { key: 'speakerWorking', label: 'Speakers & Mic Working?' },
                  { key: 'chargingPortWorking', label: 'Charging Port & Battery OK?' }
                ].map(opt => (
                  <div key={opt.key} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                    <div className="flex bg-slate-200 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setAnswers({ ...answers, [opt.key]: true })}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${answers[opt.key as keyof ConditionAnswers] === true ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
                      >Yes</button>
                      <button
                        type="button"
                        onClick={() => setAnswers({ ...answers, [opt.key]: false })}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${answers[opt.key as keyof ConditionAnswers] === false ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}
                      >No</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 4. Accessories */}
             <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800">4. Original Accessories</label>
              <div className="grid grid-cols-2 gap-3">
                 <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, boxIncluded: !answers.boxIncluded })}
                    className={`p-4 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 ${
                      answers.boxIncluded
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${answers.boxIncluded ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <p className="font-bold text-sm">Original Box</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, chargerIncluded: !answers.chargerIncluded })}
                    className={`p-4 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 ${
                      answers.chargerIncluded
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${answers.chargerIncluded ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <p className="font-bold text-sm">Original Charger</p>
                  </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setStep(5)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 text-base transition-all transform hover:-translate-y-1"
            >
              Calculate Quote
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: QUOTE & SCHEDULE */}
      {step === 5 && selectedModel && currentQuoteBreakdown && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <button onClick={() => setStep(4)} className="text-xs text-indigo-300 font-bold mb-6 flex items-center gap-1 hover:text-white"><ArrowLeft className="w-3 h-3" /> Back to Diagnostics</button>
              
              <div className="relative z-10">
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Highest Value Guaranteed
                </span>
                <p className="text-slate-300 text-sm mt-6 font-medium">Estimated value for {selectedModel.name}</p>
                <div className="flex items-end gap-2 mt-2">
                  <h2 className="text-5xl font-black font-mono tracking-tight drop-shadow-md">
                    ₹{currentQuoteBreakdown.roughQuoteMax.toLocaleString('en-IN')}
                  </h2>
                </div>
                
                <div className="mt-8 space-y-3 pt-6 border-t border-white/10">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Base Value</span>
                    <span>₹{selectedModel.baseMarketPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-rose-300">
                    <span>Condition Deductions</span>
                    <span>-₹{currentQuoteBreakdown.deductions.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-300 font-bold">
                    <span>Final Quote Range</span>
                    <span>₹{currentQuoteBreakdown.roughQuoteMin.toLocaleString('en-IN')} - ₹{currentQuoteBreakdown.roughQuoteMax.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
               <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                 <CheckCircle2 className="w-6 h-6 text-emerald-600" />
               </div>
               <div>
                 <h4 className="font-bold text-slate-900">Price Lock Guarantee</h4>
                 <p className="text-xs text-slate-500 mt-1">This quote is valid for 7 days. Ensure your physical device matches the diagnostic answers to get exactly this price.</p>
               </div>
            </div>
          </div>
          
          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 font-heading mb-6">Schedule Doorstep Pickup</h3>
            
            <form onSubmit={handleSubmitSchedule} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Your Full Name</label>
                  <input required type="text" value={sellerName} onChange={e => setSellerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Rahul Sharma" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mobile Number</label>
                  <input required type="tel" value={sellerPhone} onChange={e => setSellerPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="98765 43210" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pickup Address</label>
                  <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="House No, Street, Landmark" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pincode</label>
                  <input required type="text" value={answers.pincode} onChange={e => setAnswers({...answers, pincode: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="250101" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">UPI ID for Payment (Optional, can provide to agent)</label>
                <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="rahul@oksbi" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date</label>
                  <input required type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Time Slot</label>
                  <select required value={scheduledSlot} onChange={e => setScheduledSlot(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 02:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                    <option>06:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl shadow-lg mt-6 transition-all flex items-center justify-center gap-2">
                Book Free Pickup & Lock Price <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STEP 6: SUCCESS */}
      {step === 6 && selectedModel && (
         <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center max-w-2xl mx-auto shadow-xl">
           <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <Check className="w-10 h-10 text-emerald-600" />
           </div>
           <h2 className="text-3xl font-black text-slate-900 font-heading">Pickup Scheduled Successfully!</h2>
           <p className="text-slate-600 mt-4 leading-relaxed font-medium">
             Our certified agent will visit <strong>{address}</strong> on <strong>{scheduledDate}</strong> between <strong>{scheduledSlot}</strong>.
           </p>
           <div className="bg-slate-50 rounded-2xl p-6 mt-8 border border-slate-100 text-left">
             <h4 className="font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Next Steps</h4>
             <ul className="space-y-3 text-sm text-slate-600">
               <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" /> Keep your original box and charger handy (if declared).</li>
               <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" /> Backup your data. Our agent will perform a secure DoD military-grade wipe in front of you.</li>
               <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" /> Receive instant UPI payment before handing over the device.</li>
             </ul>
           </div>
           <button
              onClick={onNavigateToAgent}
              className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md flex items-center justify-center gap-2 mx-auto"
           >
             Track Pickup Status
           </button>
         </div>
      )}
    </div>
  );
};
