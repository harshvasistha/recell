import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MAJOR_MOBILE_BRANDS, PLATFORM_FEATURES } from '../data/brandsData';
import { BrandLogo } from './BrandLogo';
import { SellPhoneDiagnosticSection } from './SellPhoneDiagnosticSection';
import { 
  Zap, Banknote, ShieldCheck, RotateCcw, Smartphone, 
  Lock, Wrench, Leaf, ChevronRight, CheckCircle2, Star,
  MapPin, HelpCircle, Truck, Sparkles, ArrowUpRight, ArrowRight, RefreshCw, X, Shield, PhoneCall
} from 'lucide-react';

interface LandingPageProps {
  onStartSell: () => void;
  onStartBuy: () => void;
  onStartTrack: () => void;
  onOpenRepair: () => void;
  onOpenBrand: (brandName: string) => void;
  onOpenLegal: (tab?: 'privacy' | 'terms' | 'warranty' | 'returns') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSell,
  onStartBuy,
  onStartTrack,
  onOpenRepair,
  onOpenBrand,
  onOpenLegal
}) => {
  // Selected brand state for the Sell Old Phone Diagnostic section
  const [selectedBrandForSell, setSelectedBrandForSell] = useState<string | null>(null);

  // FAQs Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Feature Cards for marquee animation box with background images and text over them
  const featureCards = [
    {
      id: 'val',
      badge: '60s AI Quote',
      badgeBg: 'bg-[#0052FF]',
      title: 'Instant 60s AI Valuation',
      desc: '32-point algorithmic price estimation with zero price renegotiation.',
      img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'payout',
      badge: 'Spot Cash & UPI',
      badgeBg: 'bg-emerald-600',
      title: 'Doorstep Spot Cash Payout',
      desc: 'Instant GPay, PhonePe or Cash before our field agent leaves your house.',
      img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'warranty',
      badge: '3-Month Covered',
      badgeBg: 'bg-[#0052FF]',
      title: '3-Month Recell Warranty',
      desc: '100% hardware protection with free doorstep repair pickup for refurbished phones.',
      img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'data',
      badge: 'Zero Data Leak',
      badgeBg: 'bg-rose-600',
      title: 'DoD Military Data Wipe',
      desc: 'Department of Defense compliant sanitization erasing all private photos & accounts.',
      img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'repair',
      badge: '30-Min On-Site',
      badgeBg: 'bg-amber-600',
      title: '30-Min Doorstep Tech Repair',
      desc: 'Certified ESD technicians replace broken screens & batteries at your home.',
      img: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'express',
      badge: 'Free Delivery',
      badgeBg: 'bg-[#0052FF]',
      title: 'Pan-India Express Shipping',
      desc: 'Sanitized sealed box dispatch via Delhivery Express within 24-48 hours.',
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'recycle',
      badge: 'Eco Green',
      badgeBg: 'bg-emerald-600',
      title: 'Zero-Landfill E-Waste Disposal',
      desc: 'Free eco pickup for dead phones to prevent toxic heavy metal soil contamination.',
      img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'audit',
      badge: '55-Point Scan',
      badgeBg: 'bg-[#0052FF]',
      title: 'Certified Hardware Diagnostic Audit',
      desc: 'Exhaustive display touch, camera sensors, battery health, and circuit diagnostics.',
      img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const faqs = [
    {
      q: "How does the Doorstep Instant Cash / UPI payment work?",
      a: "When our field agent arrives at your specified address in Pincode 250101 or surrounding radius, they execute a 2-minute automated hardware test on their mobile app. Once verified, money is transferred directly to your UPI ID or Bank Account before the phone is packed."
    },
    {
      q: "Are returns applicable if the phone is physically damaged or water damaged?",
      a: "No. 7-Day Returns and Money-Back guarantees are strictly NOT applicable if the phone suffers physical damage (display cracks, drop dents, bent frame) or liquid/water damage post-delivery. Returns are accepted only for devices in their original delivered pristine condition."
    },
    {
      q: "Is liquid or water damage covered under the 3-Month Recell Warranty?",
      a: "No. Water damage, liquid immersion, rainfall/moisture exposure, or accidental physical drops are strictly EXCLUDED from warranty coverage. The 3-Month Warranty covers internal hardware manufacturing defects, touchscreen responsiveness, battery health retention below 80%, and motherboard circuits under normal usage."
    },
    {
      q: "Is my personal data completely safe after I sell my old phone?",
      a: "100% Yes. We adhere to Department of Defense (DoD 5220.22-M) military-grade data sanitization. All user accounts, photos, and cached files are permanently erased with zero chance of recovery. You also receive an official Data Wipe Guarantee Certificate."
    },
    {
      q: "What if I don't have the original phone box or charger?",
      a: "No problem! You can still sell your device. While having the original box and charger adds a small bonus to your quote, our AI valuation engine will adjust the estimate transparently."
    },
    {
      q: "How long does pan-India shipping take for certified pre-owned phones?",
      a: "Orders placed before 2:00 PM IST are packed and handed over to Delhivery Express / Shiprocket the same day. Express delivery takes 24 to 48 hours for major cities and 2-3 days for tier-2 towns."
    }
  ];

  return (
    <div className="space-y-12 pb-16 text-slate-900 overflow-hidden font-sans">
      {/* 0. ANIMATED FEATURE CARDS MARQUEE (EXPANDED SIZE BOX FORMAT WITH HIGH-RES IMAGES & OVERLAY TEXT AT REDUCED SPEED) */}
      <section className="w-full bg-slate-950 border-b border-slate-800 py-6 overflow-hidden relative shadow-xl">
        <div className="animate-marquee-ltr flex items-center gap-5">
          {featureCards.concat(featureCards).concat(featureCards).map((card, idx) => (
            <div 
              key={idx} 
              className="relative w-[340px] sm:w-[440px] h-60 sm:h-64 rounded-3xl overflow-hidden border border-slate-800 hover:border-[#0052FF] shrink-0 shadow-xl group transition-all cursor-pointer"
            >
              {/* Background High-Res Feature Image */}
              <img 
                src={card.img} 
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              {/* Dark Gradient Overlay for High Contrast Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20 p-5 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className={`${card.badgeBg} text-white font-mono font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md`}>
                    {card.badge}
                  </span>
                  <span className="text-xs text-slate-200 font-mono font-bold bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    Recell Pro Certified
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-black text-lg sm:text-xl text-white group-hover:text-[#0052FF] transition-colors line-clamp-1">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-snug line-clamp-2">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 1. HERO SECTION WITH RICH HERO IMAGERY & ANIMATION */}
      <section className="relative pt-4 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#0052FF] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-[#0052FF] animate-pulse" />
              <span>India's Premier Mobile ReCommerce Platform</span>
              <span className="bg-[#0052FF] text-white text-[10px] px-2 py-0.5 rounded-full font-mono">250101 Active</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] font-heading drop-shadow-sm"
            >
              Sell Old Phone in <span className="text-[#0052FF] underline decoration-[#BFDBFE]">60 Seconds</span> or Buy Certified Pre-Owned
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-800 max-w-2xl leading-relaxed font-medium"
            >
              Experience zero-renege doorstep cash trade-ins, instant spot UPI payouts, 32-point hardware checks, and certified refurbished phones with 3-Month Recell warranty.
            </motion.p>

            {/* Quick Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                onClick={onStartSell}
                className="bg-slate-950 hover:bg-slate-900 text-white font-black px-7 py-4 rounded-full text-sm sm:text-base shadow-lg hover:shadow-2xl transition-all flex items-center gap-2.5 group cursor-pointer font-heading"
              >
                <Smartphone className="w-5 h-5 text-emerald-400" />
                Sell Old Phone (60s Quote)
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onStartBuy}
                className="bg-[#0052FF] hover:bg-[#0043CC] text-white font-black px-7 py-4 rounded-full text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-2xl transition-all flex items-center gap-2.5 group cursor-pointer font-heading"
              >
                <ShieldCheck className="w-5 h-5" />
                Buy Refurbished Phones
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenRepair}
                className="bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-900 font-black px-6 py-4 rounded-full text-sm sm:text-base shadow-md transition-all flex items-center gap-2 cursor-pointer font-heading"
              >
                <Wrench className="w-5 h-5 text-amber-600" />
                30-Min Doorstep Repair
              </button>
            </motion.div>

            {/* Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-900 font-extrabold border-t border-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Spot Doorstep UPI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>3-Month Recell Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>DoD Military Data Wipe</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image Showcase & Live Valuation Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Hero Phone Showcase Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl group"
            >
              <img 
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80" 
                alt="Refurbished Smartphone Showcase" 
                className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Grade A+ Certified
                    </span>
                    <h3 className="text-lg font-black mt-1">iPhone 15 Pro &amp; Galaxy S23 Ultra</h3>
                  </div>
                  <span className="bg-white/20 backdrop-blur-md text-white font-mono font-bold text-xs px-3 py-1 rounded-full border border-white/30">
                    Up to 45% OFF
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Hero ReCommerce Quick Gateway Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-950 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="bg-[#0052FF] text-white text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Verified Doorstep Hub
                  </span>
                  <span className="text-xs text-emerald-400 font-extrabold font-mono">
                    250101 &bull; Spot Payout
                  </span>
                </div>

                <h3 className="font-black text-white text-xl sm:text-2xl font-heading leading-snug">
                  Get Maximum Cash for Your Used Mobile
                </h3>

                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  Select your mobile brand &amp; model below to generate a transparent price quote, schedule 2-hour doorstep pickup, and collect instant spot UPI cash!
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('sell-diagnostic-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onStartSell();
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all font-heading cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  Select Brand &amp; Get Instant Quote &rarr;
                </button>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-1 px-1 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    32-Point Audit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    Spot Bank/UPI Transfer
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ALL 15 MAJOR MOBILE BRANDS GRID */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 font-heading">
              Complete Category Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-heading">15 Major Mobile Brand Hubs</h2>
            <p className="text-xs text-slate-500 mt-0.5">Check instant trade-in prices or buy certified pre-owned devices across all top brands.</p>
          </div>

          <button
            onClick={onStartBuy}
            className="text-xs font-bold text-[#0052FF] hover:underline flex items-center gap-1 cursor-pointer font-heading"
          >
            Explore Full Brand Catalog &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {MAJOR_MOBILE_BRANDS.map((brand) => (
            <motion.div
              key={brand.id}
              whileHover={{ scale: 1.04 }}
              onClick={() => {
                setSelectedBrandForSell(brand.name);
                const el = document.getElementById('sell-diagnostic-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-5 rounded-3xl bg-white border border-slate-300 hover:border-[#0052FF] shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <BrandLogo brandId={brand.id} brandName={brand.name} size="lg" />
                  <div>
                    <span className="font-heading text-sm sm:text-base font-black text-slate-950 group-hover:text-[#0052FF] transition-colors block">
                      {brand.name}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Top Rated Brand
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-snug">{brand.tagline}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-bold">Trade-In From</span>
                <span className="font-mono font-extrabold text-emerald-700 text-sm">₹{brand.sellStartingFrom.toLocaleString('en-IN')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 2.5 COMPARTMENTALIZED SELL PROCESS & HARDWARE DIAGNOSTIC SECTION */}
      <motion.section 
        id="sell-diagnostic-section"
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24"
      >
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 mb-8 relative z-10 border-b border-slate-800 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#0052FF] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 font-heading shadow-md">
                <Zap className="w-4 h-4 text-amber-300" />
                Instant Doorstep Valuation Engine
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold px-3 py-1 rounded-full font-mono">
                Spot UPI Payouts Verified
              </span>
            </div>
            
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-sans">
              Complete your 60-second device selection, functional condition check, physical defect inspection, and doorstep booking right here in one compartmentalized flow.
            </p>
          </div>

          <div className="relative z-10">
            <SellPhoneDiagnosticSection
              selectedBrandFromHub={selectedBrandForSell}
              onSubmitBuyRequest={(req) => {
                console.log('Sell Request Created:', req);
              }}
              onNavigateToAgent={() => onStartTrack()}
              onNavigateToTrack={() => onStartTrack()}
            />
          </div>
        </div>
      </motion.section>

      {/* 3. CASHIFY-STYLE BENTO GRID ANIMATIONS & FEATURES */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="bg-indigo-100 text-indigo-900 text-xs font-black px-4 py-1.5 rounded-full border border-indigo-200 uppercase tracking-wider inline-block font-heading shadow-xs">
            Architected for Complete Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-heading drop-shadow-sm">Why India Swaps Phones on Recell</h2>
          <p className="text-sm sm:text-base text-slate-800 font-medium">
            Powered by algorithmic 32-point diagnostics, doorstep spot UPI transfers, and military-grade data sanitization.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Bento Item 1 (Large - 7 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-7 p-6 sm:p-8 bg-slate-950 text-white rounded-3xl space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-3 z-10">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/40 inline-flex items-center gap-1.5 shadow-xs">
                <Zap className="w-4 h-4 text-emerald-400" />
                60-Second Valuation Engine
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-heading drop-shadow-md">32-Point Diagnostic Inspection Checklist</h3>
              <p className="text-sm sm:text-base text-slate-200 max-w-md leading-relaxed font-sans">
                Screen glass, display touch matrices, camera sensors, earpiece mesh, battery health %, and motherboard circuits tested transparently at your doorstep.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs z-10">
              {['Display Touch', 'Camera OIS', 'Battery Health', 'Microphone', 'Charging Port', 'IMEI Verification'].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex items-center gap-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-extrabold text-white text-xs">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bento Item 2 (5 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-5 p-6 sm:p-8 bg-gradient-to-br from-[#0052FF] to-blue-900 text-white rounded-3xl space-y-6 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full border border-white/30 inline-flex items-center gap-1.5 shadow-xs">
                <Banknote className="w-4 h-4 text-emerald-300" />
                Zero Delay Payout
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-heading drop-shadow-md">Spot Doorstep Cash &amp; UPI Transfer</h3>
              <p className="text-sm text-blue-100 leading-relaxed font-sans">
                Money hits your GPay, PhonePe, Paytm, or Bank account before our field agent leaves your house. Zero waiting or delayed cheques.
              </p>
            </div>

            <div className="p-4 bg-slate-950/40 backdrop-blur-md rounded-2xl border border-white/20 font-mono text-xs flex justify-between items-center shadow-md">
              <div>
                <span className="text-xs text-blue-200 block uppercase font-extrabold">Total Payouts Processed</span>
                <span className="text-2xl font-black text-emerald-300 drop-shadow-sm">₹12,48,90,000+</span>
              </div>
              <span className="text-xs bg-emerald-400 text-slate-950 font-black px-3 py-1 rounded-full shadow-xs">100% Verified</span>
            </div>
          </motion.div>

          {/* Bento Item 3 (4 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-4 p-6 bg-white border border-slate-300 rounded-3xl space-y-4 shadow-md hover:shadow-xl flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0052FF] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-950 text-xl font-heading drop-shadow-xs">3-Month Warranty</h4>
              <p className="text-xs sm:text-sm text-slate-800 mt-1 leading-relaxed font-medium">
                Every certified pre-owned phone sold includes 90 days of hardware protection with free reverse pickup. Water/physical damage excluded.
              </p>
            </div>
            <button
              onClick={() => onOpenLegal('warranty')}
              className="text-xs sm:text-sm font-black text-[#0052FF] flex items-center gap-1.5 pt-2 cursor-pointer font-heading"
            >
              Read Warranty Terms &rarr;
            </button>
          </motion.div>

          {/* Bento Item 4 (4 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-4 p-6 bg-white border border-slate-300 rounded-3xl space-y-4 shadow-md hover:shadow-xl flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-950 text-xl font-heading drop-shadow-xs">DoD Military Data Wipe</h4>
              <p className="text-xs sm:text-sm text-slate-800 mt-1 leading-relaxed font-medium">
                100% zero data leak guarantee. Department of Defense compliant sanitization wipes all personal files permanently.
              </p>
            </div>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="text-xs sm:text-sm font-black text-rose-700 flex items-center gap-1.5 pt-2 cursor-pointer font-heading"
            >
              Data Protection Certificate &rarr;
            </button>
          </motion.div>

          {/* Bento Item 5 (4 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-4 p-6 bg-white border border-slate-300 rounded-3xl space-y-4 shadow-md hover:shadow-xl flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-950 text-xl font-heading drop-shadow-xs">Zero Landfill Recycling</h4>
              <p className="text-xs sm:text-sm text-slate-800 mt-1 leading-relaxed font-medium">
                Dispose dead devices responsibly. We divert lithium batteries and circuit boards from polluting water tables.
              </p>
            </div>
            <span className="text-xs sm:text-sm font-black text-emerald-700 flex items-center gap-1 pt-2 font-mono">
              45 Tons E-Waste Saved
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* 4. RECELL VS UNORGANIZED LOCAL MARKET COMPARISON */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-heading drop-shadow-sm">Why Trade-In on Recell Beats Local Shop Brokers</h2>
          <p className="text-sm text-slate-800 font-medium">Transparent comparison between Recell doorstep platform and unorganized offline market shops.</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-3xl overflow-hidden shadow-md">
          <table className="w-full text-left text-xs sm:text-sm text-slate-900">
            <thead className="bg-slate-950 text-white font-mono uppercase text-xs">
              <tr>
                <th className="p-4">Feature / Metric</th>
                <th className="p-4 bg-[#0052FF] text-white font-heading">Recell Platform</th>
                <th className="p-4 text-slate-300">Unorganized Local Shop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-4 font-black text-slate-950">Valuation Method</td>
                <td className="p-4 font-black text-[#0052FF] bg-blue-50/70">Algorithmic 32-Point Diagnostic Engine</td>
                <td className="p-4 text-slate-700 font-medium">Arbitrary verbal negotiation &amp; price cutting</td>
              </tr>
              <tr>
                <td className="p-4 font-black text-slate-950">Pickup Location</td>
                <td className="p-4 font-black text-[#0052FF] bg-blue-50/70">Free Doorstep Pickup at Your Home/Office</td>
                <td className="p-4 text-slate-700 font-medium">Must travel to crowded market hub</td>
              </tr>
              <tr>
                <td className="p-4 font-black text-slate-950">Payment Speed</td>
                <td className="p-4 font-black text-[#0052FF] bg-blue-50/70">Spot Instant UPI / Cash Payout at Doorstep</td>
                <td className="p-4 text-slate-700 font-medium">"Come back in 2 days for cash" delays</td>
              </tr>
              <tr>
                <td className="p-4 font-black text-slate-950">Private Data Safety</td>
                <td className="p-4 font-black text-[#0052FF] bg-blue-50/70">DoD Military Data Wipe Certificate</td>
                <td className="p-4 text-slate-700 font-medium">High risk of photo/account leakage</td>
              </tr>
              <tr>
                <td className="p-4 font-black text-slate-950">Buyer Warranty</td>
                <td className="p-4 font-black text-[#0052FF] bg-blue-50/70">3-Month Recell Warranty + 7-Day Returns</td>
                <td className="p-4 text-slate-700 font-medium">Zero warranty once you step outside shop</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="bg-amber-100 text-amber-900 text-xs font-black px-4 py-1.5 rounded-full border border-amber-200 font-heading shadow-xs">
            Verified Customer Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-heading drop-shadow-sm">Over 50,000 Happy Phone Swappers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white border border-slate-300 rounded-3xl space-y-4 shadow-md">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic font-medium">
              "Sold my iPhone 13 in Khekra Pincode 250101. The agent arrived in 2 hours, ran a quick hardware scan, and transferred ₹33,500 to my GPay right at my living room table!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0052FF] text-white font-black flex items-center justify-center text-xs font-heading shadow-xs">
                AS
              </div>
              <div>
                <p className="font-black text-sm text-slate-950 font-heading">Amit Sharma</p>
                <p className="text-xs text-slate-700 font-semibold">Khekra, Baghpat (250101)</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-300 rounded-3xl space-y-4 shadow-md">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic font-medium">
              "Bought a certified refurbished Samsung Galaxy S23 Ultra. Phone looks brand new with 95% battery health. Delhivery express delivered it to Bengaluru in 2 days with 3-Month warranty card."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs font-heading shadow-xs">
                KM
              </div>
              <div>
                <p className="font-black text-sm text-slate-950 font-heading">Karan Malhotra</p>
                <p className="text-xs text-slate-700 font-semibold">Koramangala, Bengaluru</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-300 rounded-3xl space-y-4 shadow-md">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic font-medium">
              "Booked doorstep screen replacement for my OnePlus 11. Technician arrived at my office with ESD tools and fixed it in 25 minutes. 100% genuine screen quality!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs font-heading shadow-xs">
                PV
              </div>
              <div>
                <p className="font-black text-sm text-slate-950 font-heading">Pooja Verma</p>
                <p className="text-xs text-slate-700 font-semibold">Shastri Nagar, Meerut</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. FAQS ACCORDION SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-heading drop-shadow-sm">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-800 font-medium">Everything you need to know about trading in or buying certified phones.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-4.5 text-left flex items-center justify-between font-extrabold text-sm sm:text-base text-slate-950 hover:bg-slate-50 cursor-pointer"
              >
                <span className="font-heading drop-shadow-xs">{faq.q}</span>
                <span className="text-[#0052FF] text-lg font-black ml-2">
                  {openFaq === index ? '−' : '+'}
                </span>
              </button>

              {openFaq === index && (
                <div className="px-4.5 pb-4 text-xs sm:text-sm text-slate-800 leading-relaxed border-t border-slate-200 pt-3 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
