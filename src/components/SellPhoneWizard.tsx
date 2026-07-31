import React, { useState } from 'react';
import { DeviceModel, ConditionAnswers, BuyQuoteRequest, PricingRules } from '../types';
import { calculateRoughQuote, isLocalPincode } from '../utils/pricingEngine';
import { Smartphone, Check, AlertCircle, Camera, Upload, Calendar, Clock, MapPin, IndianRupee, Sparkles, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

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
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null);
  const [searchModelQuery, setSearchModelQuery] = useState<string>('');

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
    pincode: '250101',
    photos: {}
  });

  // Photo uploads simulation state
  const [photos, setPhotos] = useState<{
    front?: string;
    back?: string;
    screenOn?: string;
    chargingPort?: string;
    damage?: string;
  }>({});

  // Seller details state
  const [sellerName, setSellerName] = useState<string>('');
  const [sellerPhone, setSellerPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-08-01');
  const [scheduledSlot, setScheduledSlot] = useState<string>('02:00 PM - 04:00 PM');

  // Request state after creation
  const [createdRequest, setCreatedRequest] = useState<BuyQuoteRequest | null>(null);

  const brands = ['All', 'Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Realme'];

  const filteredModels = deviceModels.filter(m => {
    const matchesBrand = selectedBrand === 'All' || m.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesSearch = m.name.toLowerCase().includes(searchModelQuery.toLowerCase()) ||
                          m.brand.toLowerCase().includes(searchModelQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const handlePhotoUploadSim = (type: 'front' | 'back' | 'screenOn' | 'chargingPort' | 'damage') => {
    // Simulated upload URLs with high resolution phone condition photos
    const samplePhotos: Record<string, string> = {
      front: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80',
      back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      screenOn: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=600&q=80',
      chargingPort: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
      damage: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80'
    };
    const newPhotos = { ...photos, [type]: samplePhotos[type] };
    setPhotos(newPhotos);
    setAnswers({ ...answers, photos: newPhotos });
  };

  const currentQuoteBreakdown = selectedModel
    ? calculateRoughQuote(selectedModel.baseMarketPrice, answers, pricingRules)
    : null;

  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel || !currentQuoteBreakdown) return;

    const isLocal = isLocalPincode(answers.pincode);
    const photoList = Object.values(photos).filter(Boolean) as string[];

    const newReq: BuyQuoteRequest = {
      id: `REQ-${answers.pincode}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString(),
      modelId: selectedModel.id,
      modelName: `${selectedModel.brand} ${selectedModel.name} (${selectedModel.variant})`,
      brand: selectedModel.brand,
      sellerName: sellerName || 'Seller',
      sellerPhone: sellerPhone || '+91 98765 00000',
      address: address || 'Meerut Cantonment, Local Address',
      pincode: answers.pincode,
      isLocalRadius: isLocal,
      conditionAnswers: answers,
      roughQuoteMin: currentQuoteBreakdown.roughQuoteMin,
      roughQuoteMax: currentQuoteBreakdown.roughQuoteMax,
      scheduledDate,
      scheduledSlot,
      upiId: upiId || 'seller@upi',
      status: 'pickup_scheduled',
      assignedAgent: isLocal ? 'Agent Rajesh (Meerut 250101 Hub)' : 'Courier Pickup Desk',
      photos: photoList.length > 0 ? photoList : [selectedModel.imageUrl]
    };

    setCreatedRequest(newReq);
    onSubmitBuyRequest(newReq);
    setStep(5); // Confirmation step
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Header Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 text-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Smartphone className="w-7 h-7 text-indigo-600" />
              Sell Your Phone in 60 Seconds
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Serving <strong>Pincode 250101 (Meerut) &bull; 5km Radius</strong> — Instant UPI payout on doorstep physical verification.
            </p>
          </div>
          <span className="hidden sm:inline bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono text-xs px-3.5 py-1 rounded-full font-bold">
            Step {step} of 5
          </span>
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-5 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
          <div className={`py-2 rounded-xl font-bold transition-all ${step >= 1 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
            1. Model
          </div>
          <div className={`py-2 rounded-xl font-bold transition-all ${step >= 2 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
            2. Condition
          </div>
          <div className={`py-2 rounded-xl font-bold transition-all ${step >= 3 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
            3. Photos
          </div>
          <div className={`py-2 rounded-xl font-bold transition-all ${step >= 4 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
            4. Quote
          </div>
          <div className={`py-2 rounded-xl font-bold transition-all ${step >= 5 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
            5. Schedule
          </div>
        </div>
      </div>

      {/* STEP 1: MODEL SELECTION */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Select Phone Model</h2>
              <p className="text-slate-500 text-sm">Choose your exact model to get an instant quote</p>
            </div>
            <input
              type="text"
              placeholder="Search e.g. iPhone 14, S23 Ultra, OnePlus 11..."
              value={searchModelQuery}
              onChange={(e) => setSearchModelQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs w-full md:w-72 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Brand Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {brands.map(b => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedBrand === b
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Device Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredModels.map(m => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedModel(m);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                  selectedModel?.id === m.id
                    ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-600/30 shadow-sm'
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  className="w-16 h-16 object-cover rounded-xl bg-white border border-slate-200"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{m.brand}</span>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{m.name}</h3>
                  <p className="text-xs text-slate-500">{m.variant}</p>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    Up to <span className="text-indigo-600 font-bold font-mono">₹{(m.baseMarketPrice * 0.88).toLocaleString('en-IN')}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {selectedModel && (
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-sm transition-all text-xs"
              >
                Continue with {selectedModel.name}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: CONDITION QUESTIONNAIRE */}
      {step === 2 && selectedModel && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Device Condition Questionnaire
              </h2>
              <p className="text-slate-500 text-sm">Answering accurately ensures your doorstep price matches your quote</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Selected Device</span>
              <p className="text-sm font-bold text-indigo-600">{selectedModel.brand} {selectedModel.name} ({selectedModel.variant})</p>
            </div>
          </div>

          {/* Screen Condition */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">1. Screen & Display Condition</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'flawless', label: 'Flawless / Scratchless', sub: 'Zero marks' },
                { key: 'minor_scratches', label: 'Minor Scratches', sub: 'Light hair-line marks' },
                { key: 'cracked', label: 'Screen Cracked', sub: 'Glass broken' },
                { key: 'display_fault', label: 'Display Lines / Fault', sub: 'Spots / Green line' }
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAnswers({ ...answers, screenCondition: opt.key as any })}
                  className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                    answers.screenCondition === opt.key
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-slate-900">{opt.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Body Condition */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">2. Body / Frame Condition</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'flawless', label: 'Flawless', sub: 'Like new frame' },
                { key: 'minor_scratches', label: 'Minor Scratches', sub: 'Normal usage' },
                { key: 'dents', label: 'Visible Dents', sub: 'Corner drops' },
                { key: 'broken_back', label: 'Broken Back Glass', sub: 'Cracked back' }
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAnswers({ ...answers, bodyCondition: opt.key as any })}
                  className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                    answers.bodyCondition === opt.key
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-slate-900">{opt.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Functional Checkboxes */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">3. Functional Verification</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'touchWorking', label: 'Touch Screen Working' },
                { key: 'cameraWorking', label: 'Front & Back Camera OK' },
                { key: 'speakerWorking', label: 'Speaker & Mic OK' },
                { key: 'chargingPortWorking', label: 'Charging Port Working' }
              ].map(item => (
                <label
                  key={item.key}
                  className={`p-3.5 rounded-2xl border flex items-center gap-2 cursor-pointer text-xs font-semibold ${
                    (answers as any)[item.key]
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(answers as any)[item.key]}
                    onChange={(e) => setAnswers({ ...answers, [item.key]: e.target.checked })}
                    className="accent-indigo-600 rounded"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Accessories Included */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">4. Original Accessories Handover</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`p-3.5 rounded-2xl border flex items-center gap-2 cursor-pointer text-xs font-semibold ${answers.boxIncluded ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <input
                  type="checkbox"
                  checked={answers.boxIncluded}
                  onChange={(e) => setAnswers({ ...answers, boxIncluded: e.target.checked })}
                  className="accent-indigo-600 rounded"
                />
                <span>Original Box Included (+₹600 value)</span>
              </label>
              <label className={`p-3.5 rounded-2xl border flex items-center gap-2 cursor-pointer text-xs font-semibold ${answers.chargerIncluded ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <input
                  type="checkbox"
                  checked={answers.chargerIncluded}
                  onChange={(e) => setAnswers({ ...answers, chargerIncluded: e.target.checked })}
                  className="accent-indigo-600 rounded"
                />
                <span>Original Fast Charger Included (+₹900 value)</span>
              </label>
            </div>
          </div>

          {/* Pincode Check */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              Pickup Pincode Check (Local 5km Radius)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                maxLength={6}
                value={answers.pincode}
                onChange={(e) => setAnswers({ ...answers, pincode: e.target.value })}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-mono w-36 focus:ring-2 focus:ring-indigo-500"
                placeholder="250101"
              />
              <div className="flex-1 flex items-center text-xs">
                {isLocalPincode(answers.pincode) ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <strong>Pincode {answers.pincode} Serviced!</strong> Instant same-day doorstep visit & UPI payout.
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Outside local 250101 radius. Pan-India reverse courier pickup applies.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-sm text-xs transition-all"
            >
              Upload Device Photos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PHOTO UPLOADS */}
      {step === 3 && selectedModel && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              Required Device Photos (3-5 Shots)
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Upload or snap photos of your device. These help our doorstep agent verify condition instantly before visiting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'front', title: '1. Front Screen Shot', req: true },
              { id: 'back', title: '2. Back Body Shot', req: true },
              { id: 'screenOn', title: '3. Display Screen ON', req: true },
              { id: 'chargingPort', title: '4. Charging Port Close-up', req: false },
              { id: 'damage', title: '5. Scratches / Dents Close-up', req: false }
            ].map((shot) => {
              const photoUrl = (photos as any)[shot.id];
              return (
                <div key={shot.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{shot.title}</span>
                    {shot.req && <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">Required</span>}
                  </div>

                  {photoUrl ? (
                    <div className="relative group rounded-xl overflow-hidden border border-emerald-500 h-36">
                      <img src={photoUrl} alt={shot.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handlePhotoUploadSim(shot.id as any)}
                          className="text-xs bg-white text-slate-900 px-3 py-1.5 rounded-full font-bold shadow-md"
                        >
                          Retake
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePhotoUploadSim(shot.id as any)}
                      className="h-36 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-600 hover:bg-indigo-50/50 flex flex-col items-center justify-center gap-2 text-slate-500 transition-all"
                    >
                      <Upload className="w-5 h-5 text-indigo-600" />
                      <span className="text-xs font-bold">Click to Upload / Snap</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-sm text-xs transition-all"
            >
              Calculate Rough Quote
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ROUGH QUOTE DISPLAY */}
      {step === 4 && selectedModel && currentQuoteBreakdown && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-sm space-y-6">
          {/* Quote Card Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 w-fit mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Estimated Instant Doorstep Quote
                </span>
                <h2 className="text-2xl font-black text-white">{selectedModel.brand} {selectedModel.name}</h2>
                <p className="text-xs text-slate-400 mt-1">Based on condition selection and local market demand</p>
              </div>

              <div className="bg-slate-800/90 border border-emerald-500/50 p-5 rounded-2xl text-center min-w-[220px]">
                <span className="text-xs text-slate-400">Doorstep Offer Range</span>
                <div className="text-3xl font-black text-emerald-400 font-mono my-1 flex items-center justify-center">
                  <IndianRupee className="w-7 h-7" />
                  {currentQuoteBreakdown.roughQuoteMin.toLocaleString('en-IN')} - {currentQuoteBreakdown.roughQuoteMax.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-emerald-300 font-bold">Instant Doorstep UPI Transfer</p>
              </div>
            </div>
          </div>

          {/* Detailed Itemized Valuation Rules Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Rule-Based Valuation Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Base Market Value (Mint Model)</span>
                <span className="font-mono font-bold text-slate-900">₹{currentQuoteBreakdown.basePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Screen Grade ({answers.screenCondition.replace('_', ' ')})</span>
                <span className="font-mono font-bold text-indigo-600">{(currentQuoteBreakdown.screenMultiplier * 100).toFixed(0)}% factor</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Body Frame ({answers.bodyCondition.replace('_', ' ')})</span>
                <span className="font-mono font-bold text-indigo-600">{(currentQuoteBreakdown.bodyMultiplier * 100).toFixed(0)}% factor</span>
              </div>
              {currentQuoteBreakdown.localDemandBonus > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-emerald-700 font-bold">Local Pincode 250101 Radius Demand Bonus</span>
                  <span className="font-mono font-bold text-emerald-600">+₹{currentQuoteBreakdown.localDemandBonus}</span>
                </div>
              )}
            </div>

            {currentQuoteBreakdown.deductions.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-amber-700">Applied Fault Deductions:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentQuoteBreakdown.deductions.map((d, i) => (
                    <span key={i} className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {d.label}: -₹{d.amount}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Schedule Doorstep Form */}
          <form onSubmit={handleSubmitSchedule} className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Schedule Free Doorstep Pickup & UPI Payout
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seller Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (For Agent Call)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Complete Doorstep Pickup Address</label>
                <input
                  type="text"
                  required
                  placeholder="House/Shop No, Street, Landmark, Meerut Area..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Pickup Date</label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                <select
                  value={scheduledSlot}
                  onChange={(e) => setScheduledSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID for Instant Spot Payout</label>
                <input
                  type="text"
                  required
                  placeholder="yourname@upi / GPay / Paytm number"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2 shadow-sm text-sm transition-all"
              >
                Confirm Pickup Request
                <Check className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 5: CONFIRMATION & AGENT FIELD LINK */}
      {step === 5 && createdRequest && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-slate-900 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <Check className="w-8 h-8" />
          </div>

          <div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-mono font-bold px-3.5 py-1 rounded-full border border-emerald-100">
              Request ID: {createdRequest.id}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Pickup Request Confirmed!</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
              Our agent <strong>{createdRequest.assignedAgent}</strong> will visit your doorstep on{' '}
              <strong>{createdRequest.scheduledDate} ({createdRequest.scheduledSlot})</strong> to perform physical verification and transfer funds directly to <strong>{createdRequest.upiId}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Device:</span>
              <span className="font-bold text-slate-900">{createdRequest.modelName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rough Quote Range:</span>
              <span className="font-bold text-indigo-600 font-mono">₹{createdRequest.roughQuoteMin.toLocaleString('en-IN')} - ₹{createdRequest.roughQuoteMax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pickup Location:</span>
              <span className="text-slate-800 font-medium">{createdRequest.address} ({createdRequest.pincode})</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onNavigateToAgent}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-full text-xs flex items-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Open Agent Doorstep Simulator
            </button>
            <button
              onClick={() => {
                setStep(1);
                setSelectedModel(null);
              }}
              className="px-5 py-3 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold"
            >
              Sell Another Phone
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
