import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { RecellLogo } from './RecellLogo';
import { MAJOR_MOBILE_BRANDS, PLATFORM_FEATURES } from '../data/brandsData';
import { BrandLogo } from './BrandLogo';
import { 
  Smartphone, ShoppingBag, ShieldCheck, Wrench, Search, 
  ChevronDown, User, Heart, Menu, X, MapPin, Zap, ExternalLink, Phone
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
  const [activeDropdown, setActiveDropdown] = useState<'buy' | null>(null);
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
    <header className="sticky top-0 z-40 bg-white text-slate-900 shadow-md border-b border-slate-200">
      {/* Top Banner (Optional, keep for branding) */}
      <div className="bg-[#0052FF] text-white text-[11px] sm:text-xs py-2 px-4 font-bold flex items-center justify-center overflow-hidden">
        <div className="animate-marquee-ltr w-full max-w-7xl mx-auto flex items-center justify-between gap-12 whitespace-nowrap">
           <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Doorstep Coverage: Khekra 250101</span>
           <span>&bull;</span>
           <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" />3-Mo Recell Warranty</span>
           <span>&bull;</span>
           <span className="inline-flex items-center gap-1.5">7-Day Hassle-Free Returns</span>
        </div>
      </div>

      {/* Main Bar: Logo, Search, Contact & User Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Mobile Drawer Hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 text-slate-700 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Brand Logo */}
          <a href="/" onClick={(e) => handleNavClick(e, 'landing')} className="cursor-pointer flex-shrink-0">
            <RecellLogo variant="header" />
          </a>
        </div>

        {/* Desktop Brand Logo */}
        <div className="hidden lg:block flex-shrink-0">
          <a href="/" onClick={(e) => handleNavClick(e, 'landing')} className="cursor-pointer">
            <RecellLogo variant="header" />
          </a>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xl relative mx-4">
          <input
            type="text"
            placeholder="Search for iPhone 15, Galaxy S23 Ultra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-full pl-5 pr-12 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0052FF] focus:border-[#0052FF] transition-all font-medium shadow-inner"
          />
          <div className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center bg-slate-100 rounded-full cursor-pointer hover:bg-slate-200 shadow-sm border border-slate-200">
             <Search className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          {/* Contact Support */}
          <a href="tel:08069212228" className="hidden lg:flex items-center gap-2 cursor-pointer group">
             <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-[#0052FF] transition-colors bg-slate-50">
               <Phone className="w-4 h-4 text-slate-600 group-hover:text-[#0052FF]" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] text-slate-500 font-medium uppercase leading-none mb-1">CALL US</span>
               <span className="text-[13px] font-bold text-slate-800 leading-none">9310552055</span>
             </div>
          </a>

          {/* Wishlist Icon */}
          <button className="hidden sm:flex relative p-2 text-slate-700 hover:text-[#0052FF] transition-colors cursor-pointer" title="Wishlist">
            <Heart className="w-5 h-5" />
          </button>

          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative p-2 text-slate-700 hover:text-[#0052FF] transition-colors cursor-pointer flex items-center"
            title="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#0052FF] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Login Button */}
          {user ? (
             <button
               onClick={() => onOpenProfile ? onOpenProfile() : onOpenAuth()}
               className="hidden sm:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold text-slate-800 cursor-pointer transition-all font-heading shadow-sm"
             >
               <User className="w-4 h-4 text-[#0052FF]" />
               <span className="truncate max-w-[100px]">{user.name}</span>
             </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden lg:block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded-full text-sm transition-all font-heading shadow-md border border-amber-600"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar - Visible on small screens */}
      <div className="lg:hidden px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for iPhone 15, Galaxy S23..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-full pl-4 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0052FF] focus:border-[#0052FF] transition-all font-medium shadow-inner"
          />
          <div className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center bg-slate-100 rounded-full border border-slate-200 shadow-sm cursor-pointer">
             <Search className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Clean Main Navigation Menu Bar */}
      <nav className="hidden lg:block bg-white border-t border-slate-200 relative shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 xl:gap-8 py-3 text-[14px] font-heading font-medium text-slate-700">
          
          <div className="flex items-center group relative cursor-pointer hover:text-[#0052FF]">
             <a href="/buy" onClick={(e) => handleNavClick(e, 'buy')} className="flex items-center gap-1 transition-colors">
               Buy Refurbished
             </a>
          </div>

          <div className="flex items-center group cursor-pointer hover:text-[#0052FF]">
             <a href="/sell" onClick={(e) => handleNavClick(e, 'sell')} className="flex items-center transition-colors">
               Sell Your Phone <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">NEW</span>
             </a>
          </div>

          <div className="flex items-center group cursor-pointer hover:text-[#0052FF]">
             <a href="/open-box" onClick={(e) => handleNavClick(e, 'open-box')} className="flex items-center transition-colors">
               Open Box Category <span className="ml-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">HOT</span>
             </a>
          </div>

          <div className="flex items-center group cursor-pointer hover:text-[#0052FF]">
             <a href="/repair" onClick={(e) => handleNavClick(e, 'repair')} className="transition-colors">
               Doorstep Repair
             </a>
          </div>

          <div className="flex items-center group cursor-pointer hover:text-[#0052FF]">
             <a href="/track" onClick={(e) => handleNavClick(e, 'track')} className="transition-colors">
               Track Order
             </a>
          </div>

          <div className="flex items-center group relative cursor-pointer hover:text-[#0052FF]">
             <a href="/about" onClick={(e) => handleNavClick(e, 'about')} className="flex items-center gap-1 transition-colors">
               About Us
             </a>
          </div>

        </div>
      </nav>

      {/* Mobile Sidebar Menu Overlay (Ovantica Style) */}
      {mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[999999] flex">
          {/* Dark Overlay backdrop */}
          <div 
             className="absolute inset-0 bg-black/60 transition-opacity" 
             onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Side Drawer */}
          <div className="relative w-[85%] max-w-sm h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 z-10">
            {/* Header of Sidebar */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <h2 className="font-heading font-bold text-xl text-slate-900">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-md border border-amber-500 text-amber-500 hover:bg-amber-50 transition-colors shadow-sm bg-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto font-heading bg-white">
              
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-xs text-slate-500 font-medium mb-4">Categories</h3>
                <ul className="space-y-4 text-[15px] text-slate-800">
                   <li>
                     <a href="/buy" onClick={(e) => handleNavClick(e, 'buy')} className="block py-1 hover:text-[#0052FF] transition-colors cursor-pointer">Buy Refurbished Phones</a>
                   </li>
                   <li>
                     <a href="/open-box" onClick={(e) => handleNavClick(e, 'open-box')} className="flex items-center justify-between py-1 hover:text-[#0052FF] transition-colors cursor-pointer">
                       <span>Open Box Category</span>
                       <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">HOT</span>
                     </a>
                   </li>
                   <li>
                     <a href="/repair" onClick={(e) => handleNavClick(e, 'repair')} className="block py-1 hover:text-[#0052FF] transition-colors cursor-pointer">Doorstep Repair</a>
                   </li>
                </ul>
              </div>

              <div className="p-5 border-b border-slate-100">
                <h3 className="text-xs text-slate-500 font-medium mb-4">Quick Links</h3>
                <ul className="space-y-4 text-[15px] text-slate-800">
                   <li>
                     <a href="/sell" onClick={(e) => handleNavClick(e, 'sell')} className="flex items-center justify-between py-1 hover:text-[#0052FF] transition-colors cursor-pointer">
                       <span>Sell Your Phone</span>
                       <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">NEW</span>
                     </a>
                   </li>
                   <li>
                     <a href="/track" onClick={(e) => handleNavClick(e, 'track')} className="block py-1 hover:text-[#0052FF] transition-colors cursor-pointer">Track Order</a>
                   </li>
                   <li>
                     <a href="/about" onClick={(e) => handleNavClick(e, 'about')} className="block py-1 hover:text-[#0052FF] transition-colors cursor-pointer">About Us</a>
                   </li>
                   <li>
                     <a href="/contact" onClick={(e) => handleNavClick(e, 'contact')} className="block py-1 hover:text-[#0052FF] transition-colors cursor-pointer">Contact Us</a>
                   </li>
                </ul>
              </div>

              <div className="p-5">
                <h3 className="text-xs text-slate-500 font-medium mb-4">Account</h3>
                {user ? (
                   <button 
                     onClick={() => { setMobileMenuOpen(false); if (onOpenProfile) onOpenProfile(); else onOpenAuth(); }}
                     className="flex items-center gap-3 text-[15px] text-slate-800 hover:text-[#0052FF] py-1 transition-colors cursor-pointer"
                   >
                     <User className="w-5 h-5" /> View Profile
                   </button>
                ) : (
                   <button 
                     onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                     className="flex items-center gap-3 text-[15px] text-slate-800 hover:text-[#0052FF] py-1 transition-colors cursor-pointer"
                   >
                     <User className="w-5 h-5" /> Login
                   </button>
                )}
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
