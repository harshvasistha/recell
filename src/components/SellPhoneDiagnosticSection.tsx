import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MAJOR_MOBILE_BRANDS } from '../data/brandsData';
import { BrandLogo } from './BrandLogo';
import { SEED_DEVICE_MODELS, DEFAULT_PRICING_RULES } from '../data/initialData';
import { calculateRoughQuote, isLocalPincode } from '../utils/pricingEngine';
import { ConditionAnswers, BuyQuoteRequest, DeviceModel } from '../types';
import { 
  Smartphone, Check, AlertCircle, Camera, Upload, Calendar, 
  Clock, MapPin, IndianRupee, Sparkles, ShieldCheck, ArrowRight, 
  ArrowLeft, Zap, Info, Banknote, User, Phone, CheckCircle2, RotateCcw
} from 'lucide-react';

interface SellPhoneDiagnosticSectionProps {
  selectedBrandFromHub?: string | null;
  onSubmitBuyRequest?: (req: BuyQuoteRequest) => void;
  onNavigateToAgent?: () => void;
  onNavigateToTrack?: () => void;
}

export const SellPhoneDiagnosticSection: React.FC<SellPhoneDiagnosticSectionProps> = ({
  selectedBrandFromHub,
  onSubmitBuyRequest,
  onNavigateToAgent,
  onNavigateToTrack
}) => {
  // Step State
  const [activeStep, setActiveStep] = useState<number>(1);

  // Selected Brand & Model & Purchase Year
  const [brand, setBrand] = useState<string>('Apple');
  const [selectedModel, setSelectedModel] = useState<DeviceModel>(SEED_DEVICE_MODELS[0]);
  const [searchModel, setSearchModel] = useState<string>('');
  const [purchaseYear, setPurchaseYear] = useState<string>('2024');

  // Condition State
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

  // Photo uploads state
  const [photos, setPhotos] = useState<{
    front?: string;
    back?: string;
    screenOn?: string;
    chargingPort?: string;
    damage?: string;
  }>({});

  // Seller & Doorstep details
  const [sellerName, setSellerName] = useState<string>('');
  const [sellerPhone, setSellerPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-08-01');
  const [scheduledSlot, setScheduledSlot] = useState<string>('02:00 PM - 04:00 PM');
  const [createdRequest, setCreatedRequest] = useState<BuyQuoteRequest | null>(null);

  // Pre-select brand if triggered from brand hubs above
  useEffect(() => {
    if (selectedBrandFromHub) {
      setBrand(selectedBrandFromHub);
      const matched = SEED_DEVICE_MODELS.find(
        m => m.brand.toLowerCase() === selectedBrandFromHub.toLowerCase()
      );
      if (matched) {
        setSelectedModel(matched);
      }
    }
  }, [selectedBrandFromHub]);

  // Helper to check if model brand matches selected brand name or alias
  const checkBrandMatch = (modelBrand: string, currentBrand: string) => {
    const mb = modelBrand.toLowerCase();
    const cb = currentBrand.toLowerCase();
    if (mb === cb) return true;
    if (cb.includes('/') || cb.includes(' ')) {
      const parts = cb.split(/[\/\s]+/).filter(Boolean);
      return parts.some(p => mb.includes(p) || p.includes(mb));
    }
    return cb.includes(mb) || mb.includes(cb);
  };

  // When brand changes, update default selected model
  const handleSelectBrand = (newBrand: string) => {
    setBrand(newBrand);
    const matched = SEED_DEVICE_MODELS.find(m => checkBrandMatch(m.brand, newBrand));
    if (matched) {
      setSelectedModel(matched);
    } else {
      setSelectedModel({
        id: `m-${newBrand.toLowerCase()}-flagship`,
        brand: newBrand,
        name: `${newBrand} Flagship Pro 5G`,
        variant: '128GB / 8GB RAM',
        baseMarketPrice: 24000,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
      });
    }
  };

  // Filtered models for current brand
  const filteredModels = SEED_DEVICE_MODELS.filter(m => {
    const matchBrand = checkBrandMatch(m.brand, brand);
    const matchSearch = m.name.toLowerCase().includes(searchModel.toLowerCase()) ||
                        m.variant.toLowerCase().includes(searchModel.toLowerCase());
    return matchBrand && matchSearch;
  });

  // Simulated photo upload
  const handlePhotoUploadSim = (type: 'front' | 'back' | 'screenOn' | 'chargingPort' | 'damage') => {
    const samplePhotos: Record<string, string> = {
      front: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80',
      back: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      screenOn: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=600&q=80',
      chargingPort: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
      damage: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80'
    };
    const updated = { ...photos, [type]: samplePhotos[type] };
    setPhotos(updated);
    setAnswers({ ...answers, photos: updated });
  };

  // Purchase year adjustment factor
  const getYearFactor = () => {
    if (purchaseYear === '2026') return 1.05;
    if (purchaseYear === '2025') return 1.0;
    if (purchaseYear === '2024') return 0.90;
    if (purchaseYear === '2023') return 0.82;
    if (purchaseYear === '2022') return 0.74;
    if (purchaseYear === '2021') return 0.65;
    return 0.58; // 2020 or older
  };

  // Base price multiplied by year factor
  const adjustedBasePrice = Math.round(selectedModel.baseMarketPrice * getYearFactor());

  // Calculate quote breakdown
  const quoteBreakdown = calculateRoughQuote(adjustedBasePrice, answers, DEFAULT_PRICING_RULES);

  // Form submission
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel || !quoteBreakdown) return;

    const isLocal = isLocalPincode(answers.pincode);
    const photoList = Object.values(photos).filter(Boolean) as string[];

    const newReq: BuyQuoteRequest = {
      id: `REQ-${answers.pincode}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString(),
      modelId: selectedModel.id,
      modelName: `${brand} ${selectedModel.name} (${selectedModel.variant} - ${purchaseYear})`,
      brand: brand,
      sellerName: sellerName || 'Seller',
      sellerPhone: sellerPhone || '+91 98765 43210',
      address: address || 'Meerut Cantonment, Local Area',
      pincode: answers.pincode,
      isLocalRadius: isLocal,
      conditionAnswers: answers,
      roughQuoteMin: quoteBreakdown.roughQuoteMin,
      roughQuoteMax: quoteBreakdown.roughQuoteMax,
      scheduledDate,
      scheduledSlot,
      upiId: upiId || 'seller@upi',
      status: 'pickup_scheduled',
      assignedAgent: isLocal ? 'Agent Rajesh (Meerut 250101 Hub)' : 'Courier Express Pickup Desk',
      photos: photoList.length > 0 ? photoList : [selectedModel.imageUrl]
    };

    setCreatedRequest(newReq);
    if (onSubmitBuyRequest) {
      onSubmitBuyRequest(newReq);
    }
    setActiveStep(5); // Show confirmation step
  };

  return (
    <section id="sell-diagnostic-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 scroll-mt-20">
      {/* Section Heading Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="bg-[#0052FF] text-white text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md">
              <Zap className="w-4 h-4 text-amber-400" />
              Dynamic Pricing &amp; Hardware Diagnostic Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
              Sell Old Phone &amp; Claim Spot Cash
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Enter your brand, model, purchase year, and hardware condition to generate an instant <strong>Rough Price Estimate</strong>. Our certified pickup agent visits your doorstep in Pincode 250101 to verify condition and transfer the <strong>Exact Guaranteed Payout</strong> via instant UPI before taking the phone!
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl flex flex-col items-center text-center min-w-[200px] shrink-0 font-heading">
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Spot Payout Speed</span>
            <span className="text-2xl font-black text-white font-mono my-0.5">Under 60 Sec</span>
            <span className="text-[10px] text-slate-400 font-sans">Direct GPay / PhonePe / Cash</span>
          </div>
        </div>

        {/* Dynamic Interactive Wizard Steps Header */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 pt-6 mt-6 border-t border-slate-800 text-center text-xs font-heading font-bold relative z-10">
          {[
            { num: 1, title: '1. Brand & Year' },
            { num: 2, title: '2. Hardware Audit' },
            { num: 3, title: '3. Device Photos' },
            { num: 4, title: '4. Rough Quote' },
            { num: 5, title: '5. Book Pickup' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (s.num <= activeStep || activeStep === 5) setActiveStep(s.num);
              }}
              className={`py-2.5 px-1 rounded-xl text-[11px] sm:text-xs transition-all cursor-pointer ${
                activeStep === s.num
                  ? 'bg-[#0052FF] text-white shadow-lg ring-2 ring-blue-400/50'
                  : activeStep > s.num
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: BRAND, MODEL & PURCHASE YEAR SELECTION */}
      {activeStep === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          {/* Brand Grid Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#0052FF]" />
                1. Select Mobile Brand (15 Hubs)
              </h3>
              <span className="text-xs text-slate-500 font-medium font-sans">Click brand to view models</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {MAJOR_MOBILE_BRANDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBrand(b.name)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col items-center justify-center gap-1.5 ${
                    brand.toLowerCase() === b.name.toLowerCase()
                      ? 'bg-[#EFF6FF] border-[#0052FF] ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <BrandLogo brandId={b.id} brandName={b.name} size="md" />
                  <span className={`text-xs font-bold font-heading text-center truncate max-w-full ${
                    brand.toLowerCase() === b.name.toLowerCase() ? 'text-[#0052FF]' : 'text-slate-900'
                  }`}>
                    {b.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Purchase Year Selection */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-slate-950 font-heading flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0052FF]" />
              2. Select Device Purchase / Manufacturing Year (2020 - 2026)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {[
                { year: '2026', label: '2026 Model', badge: '+5% Value' },
                { year: '2025', label: '2025 Model', badge: '100% Value' },
                { year: '2024', label: '2024 Model', badge: '90% Value' },
                { year: '2023', label: '2023 Model', badge: '82% Value' },
                { year: '2022', label: '2022 Model', badge: '74% Value' },
                { year: '2021', label: '2021 Model', badge: '65% Value' },
                { year: '2020', label: '2020 Model', badge: '58% Value' }
              ].map((y) => (
                <button
                  key={y.year}
                  onClick={() => setPurchaseYear(y.year)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer font-sans ${
                    purchaseYear === y.year
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm">{y.year}</span>
                  </div>
                  <span className={`text-[10px] inline-block mt-1 font-extrabold px-2 py-0.5 rounded-full ${
                    purchaseYear === y.year ? 'bg-emerald-400 text-slate-950' : 'bg-slate-200 text-slate-900'
                  }`}>
                    {y.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0052FF]" />
                3. Select {brand} Model
              </h3>
              <input
                type="text"
                placeholder={`Search ${brand} models...`}
                value={searchModel}
                onChange={(e) => setSearchModel(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 w-full sm:w-64 focus:ring-2 focus:ring-[#0052FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
              {filteredModels.length > 0 ? (
                filteredModels.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModel(m)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      selectedModel.id === m.id
                        ? 'bg-[#EFF6FF] border-[#0052FF] ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={m.imageUrl} alt={m.name} className="w-12 h-12 object-cover rounded-xl bg-white border border-slate-200" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-xs font-heading">{m.name}</h4>
                      <p className="text-[10px] text-slate-500">{m.variant}</p>
                      <p className="text-[11px] font-bold text-[#0052FF] mt-0.5 font-mono">
                        Base Up to ₹{Math.round(m.baseMarketPrice * getYearFactor()).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-600">
                  Custom Model selected: <strong>{brand} Flagship Pro 5G</strong> (Base Value: ₹{adjustedBasePrice.toLocaleString('en-IN')})
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveStep(2)}
              className="bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold px-7 py-3 rounded-full flex items-center gap-2 shadow-md text-xs transition-all font-heading cursor-pointer"
            >
              Proceed to Hardware Diagnostic Audit
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: HARDWARE DIAGNOSTIC ENGINE QUESTIONNAIRE */}
      {activeStep === 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] text-[#0052FF] font-bold font-mono uppercase tracking-wider block">Step 2 of 5</span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">Hardware Diagnostic Audit Checklist</h3>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-heading">
              <span className="text-slate-400">Selected Device: </span>
              <strong className="text-slate-900">{brand} {selectedModel.name} ({purchaseYear})</strong>
            </div>
          </div>

          {/* 1. Screen & Display Condition */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block font-heading">1. Screen &amp; Touch Display Condition</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { key: 'flawless', label: 'Flawless / Scratchless', sub: 'Zero marks (100% Value)' },
                { key: 'minor_scratches', label: 'Minor Scratches', sub: 'Hairline marks (92% Value)' },
                { key: 'cracked', label: 'Glass Cracked', sub: 'Screen broken (65% Value)' },
                { key: 'display_fault', label: 'Display Line / Dots', sub: 'Screen fault (45% Value)' }
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAnswers({ ...answers, screenCondition: opt.key as any })}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    answers.screenCondition === opt.key
                      ? 'bg-[#EFF6FF] border-[#0052FF] text-[#0052FF] font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs font-heading">{opt.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Body / Frame Condition */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block font-heading">2. Body / Side Frame State</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { key: 'flawless', label: 'Flawless Frame', sub: 'Pristine corners (100% Value)' },
                { key: 'minor_scratches', label: 'Minor Scratches', sub: 'Normal usage (95% Value)' },
                { key: 'dents', label: 'Visible Frame Dents', sub: 'Drop marks (80% Value)' },
                { key: 'broken_back', label: 'Broken Back Glass', sub: 'Cracked rear panel (70% Value)' }
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAnswers({ ...answers, bodyCondition: opt.key as any })}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    answers.bodyCondition === opt.key
                      ? 'bg-[#EFF6FF] border-[#0052FF] text-[#0052FF] font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs font-heading">{opt.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Battery Health */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block font-heading">3. Battery Health &amp; Retention</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { key: 'above_85', label: 'Above 85% Health (Excellent)', sub: 'Full day battery life' },
                { key: '75_85', label: '75% - 85% Health (Good)', sub: 'Minor wear (-₹800)' },
                { key: 'below_75', label: 'Below 75% / Service Required', sub: 'Battery replacement needed (-₹1,800)' }
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAnswers({ ...answers, batteryHealth: opt.key as any })}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    answers.batteryHealth === opt.key
                      ? 'bg-[#EFF6FF] border-[#0052FF] text-[#0052FF] font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs font-heading">{opt.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Functional Verification Checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block font-heading">4. Core Functional Hardware Diagnostics</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { key: 'touchWorking', label: 'Touch Screen Responsiveness' },
                { key: 'cameraWorking', label: 'Front & Rear Camera' },
                { key: 'speakerWorking', label: 'Earpiece, Mic & Speaker' },
                { key: 'chargingPortWorking', label: 'Charging Port & Circuit' }
              ].map(item => (
                <label
                  key={item.key}
                  className={`p-3 rounded-2xl border flex items-center gap-2 cursor-pointer transition-all ${
                    (answers as any)[item.key]
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(answers as any)[item.key]}
                    onChange={(e) => setAnswers({ ...answers, [item.key]: e.target.checked })}
                    className="accent-[#0052FF] rounded"
                  />
                  <span className="text-xs font-heading font-semibold">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Accessories Included */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block font-heading">5. Accessories Handover Bonus</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className={`p-3.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer ${answers.boxIncluded ? 'bg-blue-50 border-[#0052FF] text-[#0052FF] font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={answers.boxIncluded}
                  onChange={(e) => setAnswers({ ...answers, boxIncluded: e.target.checked })}
                  className="accent-[#0052FF] rounded"
                />
                <div>
                  <span className="font-heading font-bold text-xs">Original Device Retail Box (+₹600 Bonus)</span>
                  <p className="text-[10px] text-slate-500">Matching IMEI on box</p>
                </div>
              </label>

              <label className={`p-3.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer ${answers.chargerIncluded ? 'bg-blue-50 border-[#0052FF] text-[#0052FF] font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={answers.chargerIncluded}
                  onChange={(e) => setAnswers({ ...answers, chargerIncluded: e.target.checked })}
                  className="accent-[#0052FF] rounded"
                />
                <div>
                  <span className="font-heading font-bold text-xs">Original Fast Charger &amp; Cable (+₹900 Bonus)</span>
                  <p className="text-[10px] text-slate-500">Authentic manufacturer adapter</p>
                </div>
              </label>
            </div>
          </div>

          {/* Pincode & Doorstep Coverage Check */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-2 font-heading">
              <MapPin className="w-4 h-4 text-[#0052FF]" />
              Pickup Location Pincode Check
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                maxLength={6}
                value={answers.pincode}
                onChange={(e) => setAnswers({ ...answers, pincode: e.target.value })}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono w-36 focus:ring-2 focus:ring-[#0052FF]"
                placeholder="250101"
              />
              <div className="flex-1 flex items-center text-xs">
                {isLocalPincode(answers.pincode) ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-heading">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Pincode {answers.pincode} Serviced!</strong> Doorstep agent pickup &amp; spot UPI in under 2 hours.</span>
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 font-heading">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Pan-India Reverse Courier Pickup applies for pincode {answers.pincode}.</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveStep(1)}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 font-heading cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold px-7 py-3 rounded-full flex items-center gap-2 shadow-md text-xs transition-all font-heading cursor-pointer"
            >
              Attach Photos for Inspection
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: DEVICE PHOTOS ATTACHMENT */}
      {activeStep === 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          <div className="space-y-1">
            <span className="text-[10px] text-[#0052FF] font-bold font-mono uppercase tracking-wider block">Step 3 of 5</span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#0052FF]" />
              Attach Device Diagnostic Photos
            </h3>
            <p className="text-xs text-slate-500">
              Snap or attach photos of your device. These allow our field agent to verify physical state before doorstep arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'front', title: '1. Front Screen Shot', req: true },
              { id: 'back', title: '2. Back Body Panel', req: true },
              { id: 'screenOn', title: '3. Display Screen Turned ON', req: true },
              { id: 'chargingPort', title: '4. Charging Port Close-up', req: false },
              { id: 'damage', title: '5. Scratches / Dents Close-up', req: false }
            ].map((shot) => {
              const photoUrl = (photos as any)[shot.id];
              return (
                <div key={shot.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-heading">{shot.title}</span>
                    {shot.req && <span className="text-[9px] bg-blue-50 text-[#0052FF] font-mono px-2 py-0.5 rounded-full font-bold">Required</span>}
                  </div>

                  {photoUrl ? (
                    <div className="relative group rounded-xl overflow-hidden border border-emerald-500 h-32">
                      <img src={photoUrl} alt={shot.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handlePhotoUploadSim(shot.id as any)}
                          className="text-xs bg-white text-slate-900 px-3 py-1 rounded-full font-bold shadow-md cursor-pointer"
                        >
                          Retake Shot
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePhotoUploadSim(shot.id as any)}
                      className="h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0052FF] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-2 text-slate-500 transition-all cursor-pointer"
                    >
                      <Upload className="w-5 h-5 text-[#0052FF]" />
                      <span className="text-xs font-bold font-heading">Attach / Sample Shot</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold font-heading cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setActiveStep(4)}
              className="bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold px-7 py-3 rounded-full flex items-center gap-2 shadow-md text-xs transition-all font-heading cursor-pointer"
            >
              Calculate Dynamic Rough Estimate
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: DYNAMIC ROUGH ESTIMATE BREAKDOWN & TRANSPARENT NOTE */}
      {activeStep === 4 && quoteBreakdown && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          {/* Rough Estimate Price Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Calculated Rough Estimate
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-heading mt-2">
                  {brand} {selectedModel.name} ({purchaseYear})
                </h3>
                <p className="text-xs text-slate-300 font-sans">
                  Based on selected hardware condition, battery health, and local 250101 demand multiplier.
                </p>
              </div>

              <div className="bg-slate-800/90 border border-emerald-500/50 p-5 rounded-2xl text-center min-w-[240px] shadow-inner font-heading">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Estimated Doorstep Offer</span>
                <div className="text-3xl font-black text-emerald-400 font-mono my-1 flex items-center justify-center">
                  <IndianRupee className="w-7 h-7" />
                  {quoteBreakdown.roughQuoteMin.toLocaleString('en-IN')} - {quoteBreakdown.roughQuoteMax.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full inline-block mt-1">
                  Spot UPI / Cash Transfer
                </span>
              </div>
            </div>
          </div>

          {/* CRITICAL TRANSPARENT NOTE (AS REQUESTED IN PROMPT) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs font-heading text-amber-950">
              <Info className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Rough Estimate vs. Final Doorstep Payout Notice</span>
            </div>
            <p className="text-xs leading-relaxed font-sans text-amber-900">
              This estimate is calculated via our dynamic pricing engine based on your inputs. <strong>Our certified pickup guy will conduct a quick 2-minute physical hardware diagnostic inspection at your doorstep to provide the exact guaranteed payout</strong>. Money is transferred straight to your GPay / UPI before taking the phone!
            </p>
          </div>

          {/* Detailed Itemized Calculation Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 font-sans">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2 font-heading">
              Dynamic Pricing Engine Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Base Model Market Price ({purchaseYear})</span>
                <span className="font-mono font-bold text-slate-900">₹{adjustedBasePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Screen Grade ({answers.screenCondition.replace('_', ' ')})</span>
                <span className="font-mono font-bold text-[#0052FF]">{(quoteBreakdown.screenMultiplier * 100).toFixed(0)}% multiplier</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Body Frame ({answers.bodyCondition.replace('_', ' ')})</span>
                <span className="font-mono font-bold text-[#0052FF]">{(quoteBreakdown.bodyMultiplier * 100).toFixed(0)}% multiplier</span>
              </div>
              {quoteBreakdown.localDemandBonus > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-emerald-700 font-bold">Meerut 250101 Doorstep Bonus</span>
                  <span className="font-mono font-bold text-emerald-600">+₹{quoteBreakdown.localDemandBonus}</span>
                </div>
              )}
            </div>

            {quoteBreakdown.deductions.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-amber-800 font-heading">Applied Fault Deductions:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {quoteBreakdown.deductions.map((d, i) => (
                    <span key={i} className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {d.label}: -₹{d.amount}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveStep(3)}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold font-heading cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setActiveStep(5)}
              className="bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold px-7 py-3 rounded-full flex items-center gap-2 shadow-md text-xs transition-all font-heading cursor-pointer"
            >
              Proceed to Doorstep Pickup Booking
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: DOORSTEP PICKUP BOOKING FORM & CONFIRMATION */}
      {activeStep === 5 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          {!createdRequest ? (
            <form onSubmit={handleScheduleSubmit} className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] text-[#0052FF] font-bold font-mono uppercase tracking-wider block">Step 5 of 5</span>
                <h3 className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0052FF]" />
                  Schedule Doorstep Pickup &amp; Spot UPI Payout
                </h3>
                <p className="text-xs text-slate-500">
                  Our field agent will visit your specified location to execute a 2-minute physical inspection for exact valuation before transferring money.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 font-heading">Seller Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Vasistha"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 font-heading">Phone Number (For Pickup Agent Call) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1 font-heading">Complete Doorstep Pickup Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No., Street, Landmark, Meerut Area..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 font-heading">Preferred Pickup Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 font-heading">Preferred Time Slot *</label>
                  <select
                    value={scheduledSlot}
                    onChange={(e) => setScheduledSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  >
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Morning)</option>
                    <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM (Noon)</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1 font-heading">UPI ID for Spot Payout (GPay / PhonePe / Paytm) *</label>
                  <input
                    type="text"
                    required
                    placeholder="yourname@upi / 9876543210@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold font-heading cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2 shadow-lg text-xs sm:text-sm transition-all font-heading cursor-pointer"
                >
                  Confirm Doorstep Pickup &amp; Lock Estimate
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-mono font-bold px-3.5 py-1 rounded-full border border-emerald-100">
                  Request ID: {createdRequest.id}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3 font-heading">Pickup Order Successfully Placed!</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto font-sans">
                  Assigned agent <strong>{createdRequest.assignedAgent}</strong> will visit your doorstep on{' '}
                  <strong>{createdRequest.scheduledDate} ({createdRequest.scheduledSlot})</strong> to perform the 2-minute physical check and transfer the exact payout directly to <strong>{createdRequest.upiId}</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2 font-sans">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Device:</span>
                  <span className="font-bold text-slate-900">{createdRequest.modelName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Rough Estimate:</span>
                  <span className="font-bold text-[#0052FF] font-mono">₹{createdRequest.roughQuoteMin.toLocaleString('en-IN')} - ₹{createdRequest.roughQuoteMax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address:</span>
                  <span className="text-slate-800 font-medium">{createdRequest.address} ({createdRequest.pincode})</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 font-heading">
                {onNavigateToAgent && (
                  <button
                    onClick={onNavigateToAgent}
                    className="bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold px-6 py-3 rounded-full text-xs flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Open Field Agent Doorstep Simulator
                  </button>
                )}
                {onNavigateToTrack && (
                  <button
                    onClick={onNavigateToTrack}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-full text-xs flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    Track Pickup Order
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
};
