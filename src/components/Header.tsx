import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { RecellLogo } from './RecellLogo';
import { MAJOR_MOBILE_BRANDS, PLATFORM_FEATURES } from '../data/brandsData';
import { BrandLogo } from './BrandLogo';
import { 
  Smartphone, ShoppingBag, ShieldCheck, Wrench, Search, 
  ChevronDown, User, Grid, Sparkles, MapPin, SmartphoneCharging, 
  Zap, ExternalLink, X, RotateCcw, Lock, Menu, ArrowRight
} from 'lucide-react';

export type TabType = 'landing' | 'sell' | 'buy' | 'open-box' | 'track' | 'repair' | 'about' | 'how-it-works' | 'recycle' | 'contact' | 'agent' | 'admin';

interface HeaderProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  cartCount: number;
  openCart: () => void;
  isAppFrame: boolean;
  setIsAppFrame: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenMegaMenu: () => void;
  onOpenLegal: (tab?: 'privacy' | 'terms' | 'warranty' | 'returns') => void;
  onOpenBrand: (brandName: string) => void;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
  user: { name: string; phone: string; role: string; email?: string; pincode?: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  openCart,
  isAppFrame,
  setIsAppFrame,
  searchQuery,
  setSearchQuery,
  onOpenMegaMenu,
  onOpenLegal,
  onOpenBrand,
  onOpenAuth,
  onOpenProfile,
  user
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'buy' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent, tab: TabType) => {
    if (e.metaKey || e.ctrlKey || e.button === 1) {
      return;
    }
    e.preventDefault();
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setCurrentTab(tab);
  };

  const handleBrandClick = (e: React.MouseEvent, brandName: string) => {
    if (e.metaKey || e.ctrlKey || e.button === 1) {
      return;
    }
    e.preventDefault();
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    onOpenBrand(brandName);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 shadow-xs border-b border-slate-200">
      {/* Top Banner - Doorstep Location, Warranty, DoD Wipe, 7-Day Returns & Compliance */}
      <div className="bg-slate-950 text-white text-xs sm:text-sm py-2.5 px-4 font-bold flex items-center justify-between overflow-hidden shadow-md">
        {/* Full Width Animated Left-to-Right Scrolling Ticker */}
        <div className="w-full overflow-hidden">
          <div className="animate-marquee-ltr text-xs sm:text-sm font-extrabold whitespace-nowrap flex items-center gap-12 text-slate-100">
            <div className="inline-flex items-center gap-2 text-slate-100 drop-shadow-sm">
              <MapPin className="w-4 h-4 text-[#0052FF] shrink-0 animate-pulse" />
              <span>Doorstep Coverage: <strong className="text-white font-mono bg-blue-600/30 px-2 py-0.5 rounded-md border border-blue-500/40">Khekra 250101</strong> (Instant 2-Hour Pickup &amp; Spot UPI)</span>
            </div>
            <span className="text-slate-600 font-bold">&bull;</span>
            <button onClick={() => onOpenLegal('warranty')} className="inline-flex items-center gap-2 text-slate-100 hover:text-amber-400 transition-colors cursor-pointer drop-shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>3-Mo Recell Warranty Included</span>
            </button>
            <span className="text-slate-600 font-bold">&bull;</span>
            <button onClick={() => onOpenLegal('privacy')} className="inline-flex items-center gap-2 text-slate-100 hover:text-blue-400 transition-colors cursor-pointer drop-shadow-sm">
              <Lock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>DoD Military Grade Data Wipe</span>
            </button>
            <span className="text-slate-600 font-bold">&bull;</span>
            <button onClick={() => onOpenLegal('returns')} className="inline-flex items-center gap-2 text-slate-100 hover:text-emerald-400 transition-colors cursor-pointer drop-shadow-sm">
              <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>7-Day Hassle-Free Returns</span>
            </button>
            <span className="text-slate-600 font-bold">&bull;</span>
            <div className="inline-flex items-center gap-2 text-slate-100 drop-shadow-sm">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pan-India Express Logistics (28,000+ Serviced Pincodes)</span>
            </div>

            {/* Repeated set for continuous smooth infinite scrolling loop */}
            <span className="text-slate-600 font-bold">&bull;</span>
            <div className="inline-flex items-center gap-2 text-slate-100 drop-shadow-sm">
              <MapPin className="w-4 h-4 text-[#0052FF] shrink-0 animate-pulse" />
              <span>Doorstep Coverage: <strong className="text-white font-mono bg-blue-600/30 px-2 py-0.5 rounded-md border border-blue-500/40">Khekra 250101</strong> (Instant 2-Hour Pickup &amp; Spot UPI)</span>
            </div>
            <span className="text-slate-600 font-bold">&bull;</span>
            <button onClick={() => onOpenLegal('warranty')} className="inline-flex items-center gap-2 text-slate-100 hover:text-amber-400 transition-colors cursor-pointer drop-shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>3-Mo Recell Warranty Included</span>
            </button>
            <span className="text-slate-600 font-bold">&bull;</span>
            <button onClick={() => onOpenLegal('privacy')} className="inline-flex items-center gap-2 text-slate-100 hover:text-blue-400 transition-colors cursor-pointer drop-shadow-sm">
              <Lock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>DoD Military Grade Data Wipe</span>
            </button>
            <span className="text-slate-600 font-bold">&bull;</span>
            <button onClick={() => onOpenLegal('returns')} className="inline-flex items-center gap-2 text-slate-100 hover:text-emerald-400 transition-colors cursor-pointer drop-shadow-sm">
              <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>7-Day Hassle-Free Returns</span>
            </button>
            <span className="text-slate-600 font-bold">&bull;</span>
            <div className="inline-flex items-center gap-2 text-slate-100 drop-shadow-sm">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pan-India Express Logistics (28,000+ Serviced Pincodes)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar: Logo, Search, Cart & User Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <a href="/" onClick={(e) => handleNavClick(e, 'landing')} className="cursor-pointer">
          <RecellLogo variant="header" />
        </a>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search iPhone 15, Galaxy S23 Ultra, OnePlus 12..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200 shadow-2xs cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-slate-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0052FF] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Register Button */}
          {user ? (
            <div className="flex items-center gap-1.5">
              {/* Desktop User Profile Button */}
              <button
                onClick={() => onOpenProfile ? onOpenProfile() : onOpenAuth()}
                className="hidden sm:flex items-center gap-2 bg-[#EFF6FF] hover:bg-blue-100 border border-[#BFDBFE] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0052FF] font-heading cursor-pointer transition-all shadow-2xs group"
                title="Click to view profile & account details"
              >
                <User className="w-3.5 h-3.5 text-[#0052FF] group-hover:scale-110 transition-transform" />
                <span className="truncate max-w-[120px]">{user.name}</span>
                <span className="text-[10px] bg-[#0052FF] text-white px-2 py-0.5 rounded-full font-mono">Profile</span>
              </button>

              {/* Mobile User Profile Quick Button */}
              <button
                onClick={() => onOpenProfile ? onOpenProfile() : onOpenAuth()}
                className="sm:hidden flex items-center gap-1 bg-[#EFF6FF] hover:bg-blue-100 border border-[#BFDBFE] px-2.5 py-1.5 rounded-full text-xs font-bold text-[#0052FF] font-heading cursor-pointer transition-all shadow-2xs"
                title="View Profile"
              >
                <User className="w-3.5 h-3.5 text-[#0052FF]" />
                <span className="truncate max-w-[70px] text-[11px]">{user.name}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold px-3.5 py-2 rounded-full text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer font-heading"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Register / Sign In</span>
              <span className="sm:hidden text-[11px]">Sign In</span>
            </button>
          )}

          {/* Mobile Drawer Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Prominent for Mobile Users */}
      <div className="md:hidden px-4 pb-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search iPhone, Samsung, Redmi models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Clean Main Navigation Menu Bar */}
      <nav className="bg-slate-50 border-t border-slate-200 px-4 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-1 text-xs">
          {/* Main Nav Items List */}
          <div className="hidden lg:flex items-center gap-1 font-heading">
            {/* 1. Home */}
            <div className="flex items-center group">
              <a
                href="/"
                onClick={(e) => handleNavClick(e, 'landing')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'landing' 
                    ? 'bg-[#0052FF] text-white shadow-2xs' 
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                Home
              </a>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="Open Home in new tab"
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#0052FF] transition-opacity"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 2. Services (Includes all features with images in mega dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center group">
                <button
                  onClick={onOpenMegaMenu}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeDropdown === 'services'
                      ? 'bg-[#EFF6FF] text-[#0052FF] border border-[#BFDBFE]'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <a
                  href="/how-it-works"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open Services in new tab"
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#0052FF] transition-opacity"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Services Mega Dropdown Card */}
              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 w-[640px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 grid grid-cols-2 gap-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="col-span-2 flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-black text-slate-900 text-xs flex items-center gap-1.5 font-heading">
                      <Sparkles className="w-4 h-4 text-[#0052FF]" />
                      Recell ReCommerce &amp; Doorstep Tech Services
                    </span>
                    <a 
                      href="/how-it-works"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#0052FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Open Directory in New Tab <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {PLATFORM_FEATURES.slice(0, 6).map((feat) => {
                    const featTab: TabType = feat.id === 'f7' ? 'repair' : feat.id === 'f8' ? 'recycle' : (feat.id === 'f3' || feat.id === 'f4') ? 'track' : 'sell';
                    return (
                      <a 
                        key={feat.id}
                        href={`/${featTab}`}
                        onClick={(e) => handleNavClick(e, featTab)}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-[#EFF6FF] border border-slate-100 hover:border-[#BFDBFE] transition-all cursor-pointer group flex items-start gap-3 relative"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#0052FF] text-white flex items-center justify-center shrink-0 font-bold">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 text-xs group-hover:text-[#0052FF] transition-colors font-heading">
                              {feat.title}
                            </h4>
                            <span className="text-slate-400 group-hover:text-[#0052FF] p-0.5">
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-sans">{feat.description}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Buy Phone (Sub-menu listing ALL 15 Phone Brands) */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('buy')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center group">
                <a
                  href="/buy"
                  onClick={(e) => handleNavClick(e, 'buy')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    currentTab === 'buy' || activeDropdown === 'buy'
                      ? 'bg-[#0052FF] text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <span>Buy Phone</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </a>
                <a
                  href="/buy"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open Buy catalog in new tab"
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#0052FF] transition-opacity"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Brands Submenu Dropdown */}
              {activeDropdown === 'buy' && (
                <div className="absolute top-full left-0 w-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <span className="font-black text-slate-900 text-xs flex items-center gap-1.5 font-heading">
                      <ShoppingBag className="w-4 h-4 text-[#0052FF]" />
                      Certified Pre-Owned Mobile Brands (3-Mo Warranty)
                    </span>
                    <a 
                      href="/buy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#0052FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All in New Tab <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {MAJOR_MOBILE_BRANDS.map((brand) => (
                      <div key={brand.id} className="relative group/brand flex items-center">
                        <a
                          href={`/buy?brand=${encodeURIComponent(brand.name)}`}
                          onClick={(e) => handleBrandClick(e, brand.name)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-[#EFF6FF] border border-slate-100 hover:border-[#BFDBFE] text-left transition-all cursor-pointer group flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <BrandLogo brandId={brand.id} brandName={brand.name} size="sm" />
                            <div>
                              <p className="font-mono font-bold text-xs text-slate-900 group-hover:text-[#0052FF] transition-colors font-heading">
                                {brand.name}
                              </p>
                              <p className="text-[9px] text-emerald-600 font-bold font-mono">Buy From ₹{(brand.buyStartingFrom / 1000).toFixed(0)}k</p>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Open Box Mobiles (5-10 Days Old) */}
            <div className="flex items-center group">
              <a
                href="/open-box"
                onClick={(e) => handleNavClick(e, 'open-box')}
                className={`px-3 py-2 rounded-xl font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                  currentTab === 'open-box'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-amber-400/10 text-amber-700 hover:bg-amber-400/20 border border-amber-300/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Open Box (5-10 Days)</span>
              </a>
              <a
                href="/open-box"
                target="_blank"
                rel="noopener noreferrer"
                title="Open Open Box Mobiles in new tab"
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#0052FF] transition-opacity"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 4. Sell Phone */}
            <div className="flex items-center group">
              <a
                href="/sell"
                onClick={(e) => handleNavClick(e, 'sell')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentTab === 'sell'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sell Phone</span>
              </a>
              <a
                href="/sell"
                target="_blank"
                rel="noopener noreferrer"
                title="Open Sell Phone in new tab"
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#0052FF] transition-opacity"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 5. GET Repaired */}
            <div className="flex items-center group">
              <a
                href="/repair"
                onClick={(e) => handleNavClick(e, 'repair')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentTab === 'repair'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-amber-500" />
                <span>GET Repaired</span>
              </a>
              <a
                href="/repair"
                target="_blank"
                rel="noopener noreferrer"
                title="Open Doorstep Repair in new tab"
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#0052FF] transition-opacity"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 6. Contact Us */}
            <div className="flex items-center group">
              <a
                href="/contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                  currentTab === 'contact' ? 'bg-[#EFF6FF] text-[#0052FF] font-bold border border-[#BFDBFE]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Contact Us
              </a>
              <a
                href="/contact"
                target="_blank"
                rel="noopener noreferrer"
                title="Open Contact Us in new tab"
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#0052FF] transition-opacity"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 7. About Us */}
            <div className="flex items-center group">
              <a
                href="/about"
                onClick={(e) => handleNavClick(e, 'about')}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                  currentTab === 'about' ? 'bg-[#EFF6FF] text-[#0052FF] font-bold border border-[#BFDBFE]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                About Us
              </a>
              <a
                href="/about"
                target="_blank"
                rel="noopener noreferrer"
                title="Open About Us in new tab"
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#0052FF] transition-opacity"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Track & Extra links on desktop right */}
          <div className="hidden lg:flex items-center gap-2 font-heading">
            <a
              href="/track"
              onClick={(e) => handleNavClick(e, 'track')}
              className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0052FF]" />
              Track Order / Claim Warranty
            </a>
            <a
              href="/track"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Tracker in new tab"
              className="p-1.5 text-slate-400 hover:text-[#0052FF]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Responsive Full-Screen Hamburger Menu Overlay mounted at document.body */}
      {mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[999999] bg-slate-950 text-white w-full h-full min-h-screen overflow-y-auto p-5 sm:p-8 animate-fadeIn flex flex-col justify-between">
          <div className="space-y-6 max-w-2xl mx-auto w-full pb-8">
            {/* Header Bar with Title & Close Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0052FF] to-blue-400 text-white flex items-center justify-center font-black shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-white uppercase tracking-wider">
                    Recell Store
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono font-medium">
                    Owner Helpline &bull; +91 9310552055
                  </p>
                </div>
              </div>

              {/* Big Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold p-2.5 rounded-full text-xs flex items-center gap-2 transition-all border border-slate-700 cursor-pointer shadow-lg active:scale-95"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-slate-200" />
              </button>
            </div>

            {/* Mobile Search Bar */}
            <form onSubmit={(e) => { e.preventDefault(); setMobileMenuOpen(false); setCurrentTab('buy'); }} className="relative">
              <input
                type="text"
                placeholder="Search iPhone, Charger, Samsung, IMEI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </form>

            {/* User Account Bar */}
            {user ? (
              <div 
                onClick={() => { setMobileMenuOpen(false); if (onOpenProfile) onOpenProfile(); else onOpenAuth(); }}
                className="p-4 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/40 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-blue-900/80 transition-all shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0052FF] text-white font-black flex items-center justify-center font-heading text-base shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-heading font-black text-sm text-white">{user.name}</p>
                    <p className="text-xs text-blue-200 font-mono">{user.phone}</p>
                  </div>
                </div>
                {user.role === 'admin' ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); setCurrentTab('admin'); }}
                    className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full border border-amber-300 cursor-pointer shadow-sm"
                  >
                    Admin Portal
                  </button>
                ) : (
                  <span className="text-xs bg-blue-500 text-white font-bold px-3 py-1.5 rounded-full font-heading shadow-xs">
                    View Account
                  </span>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-between shadow-xl">
                <div>
                  <h4 className="font-black text-sm font-heading">Welcome to Recell Store</h4>
                  <p className="text-xs text-blue-100">Sign in with Mobile OTP to view orders &amp; instant quotes</p>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="bg-white text-[#0052FF] font-black text-xs px-4 py-2.5 rounded-xl shadow-md hover:bg-blue-50 transition-all font-heading shrink-0 cursor-pointer"
                >
                  Register / Sign In
                </button>
              </div>
            )}

            {/* Highlighed OPEN BOX Category Spotlight */}
            <div 
              onClick={(e) => handleNavClick(e, 'open-box')}
              className="p-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 rounded-2xl shadow-xl border-2 border-amber-300 cursor-pointer transform hover:scale-[1.01] transition-all flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  ⚡ HIGHLY RECOMMENDED
                </span>
                <h4 className="text-lg font-black font-heading tracking-tight text-slate-950">
                  Open Box Chargers &amp; Phones
                </h4>
                <p className="text-xs font-bold text-slate-900">
                  5-10 Days Customer Returns &bull; Up to 60% OFF Original Price
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-950 shrink-0" />
            </div>

            {/* Main Navigation Links Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold font-heading">
              <a
                href="/"
                onClick={(e) => handleNavClick(e, 'landing')}
                className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl flex items-center gap-3 text-white transition-all"
              >
                <span className="text-xl">🏠</span>
                <div>
                  <span className="block font-black text-sm">Home Page</span>
                  <span className="text-[10px] text-slate-400 font-normal">Main storefront</span>
                </div>
              </a>

              <a
                href="/buy"
                onClick={(e) => handleNavClick(e, 'buy')}
                className="p-3.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-2xl flex items-center gap-3 text-white transition-all"
              >
                <span className="text-xl">🛍️</span>
                <div>
                  <span className="block font-black text-sm text-blue-200">Buy Refurbished</span>
                  <span className="text-[10px] text-blue-300 font-normal">Grade A+ Certified</span>
                </div>
              </a>

              <a
                href="/sell"
                onClick={(e) => handleNavClick(e, 'sell')}
                className="p-3.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-white transition-all"
              >
                <span className="text-xl">📱</span>
                <div>
                  <span className="block font-black text-sm text-emerald-300">Sell Old Phone</span>
                  <span className="text-[10px] text-emerald-400 font-normal">60-sec instant quote</span>
                </div>
              </a>

              <a
                href="/repair"
                onClick={(e) => handleNavClick(e, 'repair')}
                className="p-3.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 rounded-2xl flex items-center gap-3 text-white transition-all"
              >
                <span className="text-xl">🔧</span>
                <div>
                  <span className="block font-black text-sm text-amber-300">Doorstep Repair</span>
                  <span className="text-[10px] text-amber-400 font-normal">₹0 Pickup Fee</span>
                </div>
              </a>

              <a
                href="/track"
                onClick={(e) => handleNavClick(e, 'track')}
                className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl flex items-center gap-3 text-white transition-all col-span-2"
              >
                <span className="text-xl">🛡️</span>
                <div>
                  <span className="block font-black text-sm">Order Tracking &amp; Warranty Claim</span>
                  <span className="text-[10px] text-slate-400 font-normal">Live status &amp; owner SMS updates</span>
                </div>
              </a>
            </div>

            {/* Popular Brands Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block font-heading">
                Browse Mobiles by Brand
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {MAJOR_MOBILE_BRANDS.map((b) => (
                  <a
                    key={b.id}
                    href={`/buy?brand=${encodeURIComponent(b.name)}`}
                    onClick={(e) => handleBrandClick(e, b.name)}
                    className="p-3 bg-slate-900 hover:bg-blue-900/40 border border-slate-800 hover:border-blue-500/50 rounded-xl font-heading font-bold text-slate-200 flex items-center gap-3 truncate cursor-pointer transition-all group"
                  >
                    <BrandLogo brandId={b.id} brandName={b.name} size="sm" />
                    <span className="truncate group-hover:text-white">{b.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Full Screen Footer Dismiss Bar */}
          <div className="pt-6 mt-6 border-t border-slate-800 max-w-2xl mx-auto w-full flex items-center justify-between text-xs text-slate-400 pb-12">
            <span>Pathsala Road, Khekra, Baghpat &bull; 9310552055</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold px-5 py-2.5 rounded-xl border border-slate-700 cursor-pointer transition-all active:scale-95"
            >
              Close Menu
            </button>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
