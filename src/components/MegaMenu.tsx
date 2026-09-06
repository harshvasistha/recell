import React, { useState } from 'react';
import { MAJOR_MOBILE_BRANDS, PLATFORM_FEATURES } from '../data/brandsData';
import { BrandLogo } from './BrandLogo';
import { 
  Zap, Banknote, ShieldCheck, RotateCcw, Smartphone, 
  Lock, Wrench, Leaf, ChevronRight, X, Sparkles, Truck, CheckCircle2, Search
} from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBrand: (brandName: string) => void;
  onNavigateTab: (tab: 'sell' | 'buy' | 'track' | 'repair' | 'about' | 'how-it-works' | 'recycle' | 'contact') => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectBrand,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'brands' | 'features' | 'services'>('brands');
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredBrands = MAJOR_MOBILE_BRANDS.filter(b => 
    b.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    b.tagline.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Banknote': return <Banknote className="w-5 h-5 text-emerald-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-orange-600" />;
      case 'RotateCcw': return <RotateCcw className="w-5 h-5 text-orange-600" />;
      case 'SmartphoneCheck': return <Smartphone className="w-5 h-5 text-purple-600" />;
      case 'Lock': return <Lock className="w-5 h-5 text-rose-600" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-500" />;
      default: return <Sparkles className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex justify-center items-start overflow-y-auto p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-6xl shadow-2xl my-auto overflow-hidden text-stone-900 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-stone-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Explore Directory
              </span>
              <span className="text-xs text-stone-400 font-medium hidden sm:inline">&bull; 15 Brands &bull; Complete Services</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1 flex items-center gap-2">
              Recell Brand & Feature Hub
            </h2>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Apple, Samsung, Warranty..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'brands'
                ? 'bg-[#DD6B20] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            15 Mobile Brand Categories ({MAJOR_MOBILE_BRANDS.length})
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'features'
                ? 'bg-[#DD6B20] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Core Platform Features ({PLATFORM_FEATURES.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#DD6B20] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Quick Service Links
          </button>
        </div>

        {/* Main Directory Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'brands' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                  Select a mobile brand to check instant 60s trade-in quote or buy certified pre-owned:
                </p>
                <span className="text-xs text-orange-600 font-bold font-mono">
                  {filteredBrands.length} Brands Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => {
                      onSelectBrand(brand.name);
                      onClose();
                    }}
                    className="p-4 rounded-2xl border border-stone-200 hover:border-orange-500 bg-white hover:bg-orange-50/50 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <BrandLogo brandId={brand.id} brandName={brand.name} size="md" />
                        <span className="font-mono text-xs font-black text-stone-900 group-hover:text-orange-600 transition-colors font-heading">
                          {brand.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        {brand.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-bold">Starts At</span>
                        <span className="font-mono font-bold text-emerald-600">₹{brand.sellStartingFrom.toLocaleString('en-IN')}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLATFORM_FEATURES.map((feat) => (
                <div key={feat.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 relative overflow-hidden group hover:border-orange-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-xs">
                      {getFeatureIcon(feat.iconName)}
                    </div>
                    {feat.badge && (
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider block">{feat.subtitle}</span>
                    <h3 className="font-bold text-stone-900 text-sm mt-0.5">{feat.title}</h3>
                    <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">{feat.description}</p>
                  </div>

                  {feat.stat && (
                    <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
                      <span className="text-stone-400">{feat.statLabel}:</span>
                      <span className="font-black font-mono text-stone-900">{feat.stat}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                onClick={() => { onNavigateTab('sell'); onClose(); }}
                className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-50 border border-orange-100 cursor-pointer hover:border-orange-300 transition-all space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-orange-600" />
                  <h3 className="font-bold text-stone-900 text-base">Sell Old Phone in 60s</h3>
                </div>
                <p className="text-xs text-stone-600">Get an instant AI valuation quote, book free doorstep pickup & receive instant UPI cash.</p>
                <span className="text-xs text-orange-600 font-bold flex items-center gap-1">Start Trade-in Quote <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>

              <div 
                onClick={() => { onNavigateTab('buy'); onClose(); }}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 cursor-pointer hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-bold text-stone-900 text-base">Buy Certified Refurbished</h3>
                </div>
                <p className="text-xs text-stone-600">Browse 100% certified pre-owned devices backed by 3-Month warranty & 7-Day easy returns.</p>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">Browse Catalog <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>

              <div 
                onClick={() => { onNavigateTab('repair'); onClose(); }}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 cursor-pointer hover:border-amber-300 transition-all space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-amber-600" />
                  <h3 className="font-bold text-stone-900 text-base">30-Min Doorstep Repair</h3>
                </div>
                <p className="text-xs text-stone-600">Screen replacement, original battery swap, camera fix at home with 6-month repair warranty.</p>
                <span className="text-xs text-amber-600 font-bold flex items-center gap-1">Book Repair <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>

              <div 
                onClick={() => { onNavigateTab('how-it-works'); onClose(); }}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer hover:border-stone-300 transition-all space-y-2"
              >
                <h3 className="font-bold text-stone-900 text-sm">How RE-PHONE Works</h3>
                <p className="text-xs text-stone-500">Step-by-step breakdown of our valuation, doorstep test & pan-India courier network.</p>
              </div>

              <div 
                onClick={() => { onNavigateTab('recycle'); onClose(); }}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer hover:border-stone-300 transition-all space-y-2"
              >
                <h3 className="font-bold text-stone-900 text-sm">Zero-Landfill E-Waste Recycle</h3>
                <p className="text-xs text-stone-500">Dispose dead phones responsibly, get an official Green Disposal Certificate.</p>
              </div>

              <div 
                onClick={() => { onNavigateTab('contact'); onClose(); }}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer hover:border-stone-300 transition-all space-y-2"
              >
                <h3 className="font-bold text-stone-900 text-sm">Customer Support & Helpdesk</h3>
                <p className="text-xs text-stone-500">Connect via WhatsApp, phone hotline, or visit our central Khekra 250101 hub.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-600" />
            <span>Serving Khekra Pincode 250101 &amp; Pan-India via Delhivery &amp; Shiprocket</span>
          </div>
          <button
            onClick={onClose}
            className="text-orange-600 hover:text-orange-800 font-bold uppercase text-[11px] tracking-wider"
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
};
