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
      {/* 0. ANIMATED FEATURE CARDS MARQUEE */}
      <section className="w-full bg-slate-950 border-b border-slate-800 py-6 overflow-hidden relative shadow-xl">
        <div className="animate-marquee-ltr flex items-center gap-5">
          {featureCards.concat(featureCards).concat(featureCards).map((card, idx) => (
            <div 
              key={idx} 
              className="relative w-[340px] sm:w-[420px] h-56 sm:h-60 rounded-3xl overflow-hidden border border-slate-800 hover:border-[#0052FF] shrink-0 shadow-xl group transition-all cursor-pointer"
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
                  <h4 className="font-black text-lg sm:text-xl text-white group-hover:text-[#0052FF] transition-colors line-clamp-1 font-heading">
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

      {/* 1. HERO SECTION WITH CLEAN SPACIOUS WHITE CANVAS */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Clean Display Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-heading drop-shadow-sm"
          >
            Sell Old Phone in 60 Seconds <br className="hidden sm:inline" />
            or Buy Certified Pre-Owned
          </motion.h1>

          {/* Clean Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Zero-renege doorstep cash trade-ins, instant spot UPI payouts, 32-point hardware diagnostic checks, and 3-month Recell warranty.
          </motion.p>

          {/* Quick Action Hub: 4 Clean, Roomy Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-10 text-left"
          >
            {/* Card 1: Buy Refurbished */}
            <div 
              onClick={onStartBuy}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl group-hover:text-[#0052FF] transition-colors font-heading drop-shadow-sm">
                    Buy Refurbished Phones
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Certified pre-owned smartphones with 3-Month warranty.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-sm font-bold text-slate-900 group-hover:text-[#0052FF]">
                <span>Browse Store</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Sell Old Phone */}
            <div 
              onClick={onStartSell}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl group-hover:text-emerald-600 transition-colors font-heading drop-shadow-sm">
                    Sell Old Phone
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Get an instant AI price quote and book free doorstep cash pickup.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-sm font-bold text-slate-900 group-hover:text-emerald-600">
                <span>Get Instant Quote</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Open Box Mobiles & Chargers */}
            <div 
              onClick={() => {
                const openBoxNav = document.querySelector('a[href="/open-box"]') as HTMLElement;
                if (openBoxNav) openBoxNav.click();
                else onStartBuy();
              }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl group-hover:text-amber-600 transition-colors font-heading drop-shadow-sm">
                    Open Box Category
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Unboxed chargers & smartphones with original brand warranty.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-sm font-bold text-slate-900 group-hover:text-amber-600">
                <span>Explore Deals</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Repair Mobiles */}
            <div 
              onClick={onOpenRepair}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Wrench className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl group-hover:text-indigo-600 transition-colors font-heading drop-shadow-sm">
                    Repair Mobiles
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Screen & battery replacement done at your location in 30 mins.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                <span>Book Technician</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2B. OPEN BOX DELIVERY MOBILES & CHARGERS HIGHLIGHTED SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-2 border-b border-slate-100">
          <div className="space-y-3">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-heading shadow-sm">
              Special Category
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight drop-shadow-sm">
              Open Box Chargers &amp; Phones
            </h2>
            <p className="text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              Genuine fast chargers and unboxed flagship smartphones (5-10 Days old). Includes original box, invoice, and brand warranty. Up to 60% OFF.
            </p>
          </div>
          <button
            onClick={() => {
              const openBoxNav = document.querySelector('a[href="/open-box"]') as HTMLElement;
              if (openBoxNav) openBoxNav.click();
              else onStartBuy();
            }}
            className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 cursor-pointer font-heading"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Open Box Chargers & Mobiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              id: 'chg-app-20w',
              name: 'Apple Original 20W USB-C Adapter',
              variant: 'Type-C Fast Charger • 6 Days Old',
              originalPrice: 1900,
              sellPrice: 1199,
              age: '6 Days Old',
              warranty: '6M Brand Warranty',
              img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
              brand: 'Apple',
              badge: 'CHARGER'
            },
            {
              id: 'chg-sam-45w',
              name: 'Samsung 45W Super Fast Charger 2.0',
              variant: 'Includes 5A Type-C Cable • 8 Days Old',
              originalPrice: 2999,
              sellPrice: 1499,
              age: '8 Days Old',
              warranty: '10M Samsung Warranty',
              img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
              brand: 'Samsung',
              badge: 'CHARGER'
            },
            {
              id: 'chg-op-80w',
              name: 'OnePlus 80W SUPERVOOC Power Adapter',
              variant: 'Full Retail Box • 7 Days Old',
              originalPrice: 2499,
              sellPrice: 1299,
              age: '7 Days Old',
              warranty: '8M OnePlus Warranty',
              img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
              brand: 'OnePlus',
              badge: 'CHARGER'
            },
            {
              id: 'ob-ip15pm',
              name: 'iPhone 15 Pro Max',
              variant: '256GB - Natural Titanium',
              originalPrice: 159900,
              sellPrice: 104999,
              age: '6 Days Old',
              warranty: '11M Official Apple Warranty',
              img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
              brand: 'Apple',
              badge: 'SMARTPHONE'
            }
          ].map((item) => (
            <div 
              key={item.id}
              onClick={onStartBuy}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group relative"
            >
              <div>
                <div className="relative h-48 bg-slate-50 rounded-2xl overflow-hidden mb-4 p-4 flex items-center justify-center">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md" 
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm font-mono uppercase tracking-wider">
                    {item.badge}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 font-heading leading-tight drop-shadow-sm">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">
                    {item.variant}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                    {item.warranty}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-end justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 line-through block font-medium mb-0.5">
                    MRP: ₹{item.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-lg font-black text-slate-900 font-heading">
                    ₹{item.sellPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <button className="bg-slate-100 group-hover:bg-amber-500 group-hover:text-white text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors font-heading shadow-sm">
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 2. MOBILES WE SELL SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-16"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-2 border-b border-slate-100">
          <div className="space-y-3">
            <span className="bg-blue-100 text-[#0052FF] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-heading shadow-sm">
              Grade A+ Certified
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight drop-shadow-sm">
              Buy Refurbished Phones
            </h2>
            <p className="text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              Top-tier certified smartphones with 55-point hardware inspection &amp; 3-month warranty.
            </p>
          </div>
          <button
            onClick={onStartBuy}
            className="text-sm font-bold text-[#0052FF] hover:text-[#0043CC] flex items-center gap-1.5 cursor-pointer font-heading"
          >
            <span>View All Phones</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {[
            {
              id: 'm-ip15pm',
              name: 'iPhone 15 Pro Max',
              variant: '256GB - Natural Titanium',
              originalPrice: 159900,
              sellPrice: 94500,
              grade: 'Superb',
              battery: '94%',
              img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
              brand: 'Apple'
            },
            {
              id: 'm-ip14',
              name: 'iPhone 14',
              variant: '128GB - Midnight Black',
              originalPrice: 69900,
              sellPrice: 48999,
              grade: 'Superb',
              battery: '91%',
              img: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',
              brand: 'Apple'
            },
            {
              id: 'm-s23u',
              name: 'Galaxy S23 Ultra',
              variant: '256GB - Botanic Green',
              originalPrice: 124999,
              sellPrice: 68500,
              grade: 'Like New',
              battery: '95%',
              img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
              brand: 'Samsung'
            },
            {
              id: 'm-op12r',
              name: 'OnePlus 12R 5G',
              variant: '256GB - Cool Blue',
              originalPrice: 39999,
              sellPrice: 30999,
              grade: 'Like New',
              battery: '98%',
              img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
              brand: 'OnePlus'
            },
            {
              id: 'm-px8a',
              name: 'Pixel 8a 5G',
              variant: '128GB - Aloe Green',
              originalPrice: 52999,
              sellPrice: 31500,
              grade: 'Superb',
              battery: '96%',
              img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
              brand: 'Google'
            },
            {
              id: 'm-rmn13p',
              name: 'Redmi Note 13 Pro+',
              variant: '256GB - Fusion Purple',
              originalPrice: 33999,
              sellPrice: 21999,
              grade: 'Superb',
              battery: '93%',
              img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
              brand: 'Xiaomi'
            }
          ].map((phone) => (
            <div
              key={phone.id}
              onClick={onStartBuy}
              className="p-5 rounded-3xl bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden bg-slate-50 mb-4 aspect-4/3 flex items-center justify-center p-4">
                  <img
                    src={phone.img}
                    alt={phone.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Grade {phone.grade}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {phone.battery} Batt
                  </span>
                </div>

                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-heading mb-0.5">
                  {phone.brand}
                </span>
                <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors leading-snug drop-shadow-sm">
                  {phone.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate mt-1">{phone.variant}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 line-through block font-medium mb-0.5">
                    MRP: ₹{phone.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-heading font-black text-[#0052FF] text-lg">
                    ₹{phone.sellPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <button className="bg-slate-100 group-hover:bg-[#0052FF] group-hover:text-white text-slate-800 font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm font-heading">
                  Buy
                </button>
              </div>
            </div>
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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mt-16 scroll-mt-24"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 mb-8 relative z-10 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1.5 rounded-full font-heading tracking-wider shadow-sm">
                Spot UPI Payouts Verified
              </span>
            </div>
            
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed font-medium">
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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mt-16"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider inline-block font-heading shadow-sm">
            Built for Complete Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading drop-shadow-sm">Why Customers Trust Us</h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Fast 60-second quotes, instant GPay &amp; cash transfers at doorstep, and 100% data privacy protection.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Item 1 (Full Width - 12 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-12 p-8 sm:p-10 bg-white border border-slate-100 rounded-3xl space-y-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#0052FF]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-4 z-10 max-w-xl">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                Instant Price Valuation
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading drop-shadow-sm">Complete Mobile Inspection Checklist</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                Screen glass, display touch, camera, speakers, battery health, and body condition verified transparently right in front of you.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs z-10 w-full md:w-auto">
              {['Display Touch', 'Camera & OIS', 'Battery Health', 'Microphone', 'Charging Port', 'IMEI Check'].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-bold text-slate-700 text-xs">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bento Item 3 (4 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-4 p-8 bg-white border border-slate-100 rounded-3xl space-y-5 shadow-lg hover:shadow-2xl flex flex-col justify-between transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052FF] flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xl font-heading drop-shadow-sm">3-Month Warranty</h4>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">
                Every certified pre-owned phone sold includes 90 days of hardware protection with free reverse pickup.
              </p>
            </div>
            <button
              onClick={() => onOpenLegal('warranty')}
              className="text-sm font-bold text-[#0052FF] flex items-center gap-1.5 pt-3 cursor-pointer font-heading"
            >
              Read Warranty Terms &rarr;
            </button>
          </motion.div>

          {/* Bento Item 4 (4 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-4 p-8 bg-white border border-slate-100 rounded-3xl space-y-5 shadow-lg hover:shadow-2xl flex flex-col justify-between transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xl font-heading drop-shadow-sm">DoD Military Data Wipe</h4>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">
                100% zero data leak guarantee. Department of Defense compliant sanitization wipes all personal files.
              </p>
            </div>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="text-sm font-bold text-rose-600 flex items-center gap-1.5 pt-3 cursor-pointer font-heading"
            >
              Data Protection Certificate &rarr;
            </button>
          </motion.div>

          {/* Bento Item 5 (4 cols) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-4 p-8 bg-white border border-slate-100 rounded-3xl space-y-5 shadow-lg hover:shadow-2xl flex flex-col justify-between transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Leaf className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xl font-heading drop-shadow-sm">Zero Landfill Recycling</h4>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">
                Dispose dead devices responsibly. We divert lithium batteries and circuit boards from polluting water tables.
              </p>
            </div>
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 pt-3 font-mono">
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
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-16"
      >
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading drop-shadow-sm">Why Trade-In Beats Local Shops</h2>
          <p className="text-sm text-slate-600 font-medium">Transparent comparison between Recell doorstep platform and unorganized offline market shops.</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-[10px] tracking-wider font-heading">
              <tr className="border-b border-slate-100">
                <th className="p-5">Feature / Metric</th>
                <th className="p-5 text-[#0052FF]">Recell Platform</th>
                <th className="p-5 text-slate-500">Unorganized Local Shop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-4 font-black text-slate-950">Valuation Method</td>
                <td className="p-4 font-black text-[#0052FF] bg-blue-50/70">Transparent Mobile Checklist Inspection</td>
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-heading drop-shadow-sm">Over 5,000 Happy Phone buyers from the outlet store</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white border border-slate-300 rounded-3xl space-y-4 shadow-md">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic font-medium">
              "Visited Recell store on Pathsala road in Khekra to sell my iPhone 13. The staff completed a 2-minute diagnostic scan and transferred ₹33,500 to my GPay right at the counter!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0052FF] text-white font-black flex items-center justify-center text-xs font-heading shadow-xs">
                AS
              </div>
              <div>
                <p className="font-black text-sm text-slate-950 font-heading">Amit Sharma</p>
                <p className="text-xs text-slate-700 font-semibold">Pathsala Road, Khekra (250101)</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-300 rounded-3xl space-y-4 shadow-md">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic font-medium">
              "Bought a certified pre-owned Samsung Galaxy S23 Ultra directly from Recell Khekra Store. Pristine phone with 95% battery health, original accessories &amp; 3-Month warranty card."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs font-heading shadow-xs">
                VT
              </div>
              <div>
                <p className="font-black text-sm text-slate-950 font-heading">Vikas Tyagi</p>
                <p className="text-xs text-slate-700 font-semibold">Main Market, Khekra (250101)</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-300 rounded-3xl space-y-4 shadow-md">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic font-medium">
              "Booked doorstep pickup in Khekra for selling my old phone. The agent arrived at my house within 45 minutes, verified condition, and paid spot cash. Highly recommended!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs font-heading shadow-xs">
                RC
              </div>
              <div>
                <p className="font-black text-sm text-slate-950 font-heading">Rohit Chaudhary</p>
                <p className="text-xs text-slate-700 font-semibold">Railway Road, Khekra (250101)</p>
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
