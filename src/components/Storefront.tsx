import React, { useState } from 'react';
import { CatalogProduct } from '../types';
import { ShieldCheck, Battery, CheckCircle2, Sparkles, Filter, ShoppingCart, Eye, Award, Truck, ArrowUpDown, Smartphone, Wrench, Search, Zap, Check } from 'lucide-react';
import { PRODUCT_IMAGE_FALLBACK, onProductImageError } from '../utils/productImageFallback';

interface StorefrontProps {
  catalog: CatalogProduct[];
  searchQuery: string;
  onSelectProduct: (product: CatalogProduct) => void;
  onAddToCart: (product: CatalogProduct) => void;
  onQuickBuy: (product: CatalogProduct) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  catalog,
  searchQuery,
  onSelectProduct,
  onAddToCart,
  onQuickBuy
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'battery'>('featured');

  const filteredProducts = catalog.filter(p => {
    const matchesBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesCondition = selectedCondition === 'All' || p.conditionGrade === selectedCondition;
    const isItemOpenBox = p.isOpenBox || p.conditionGrade === 'Open Box' || p.title.toLowerCase().includes('open box');
    const matchesOpenBox = !isItemOpenBox; // Exclude open box items from refurbished store
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesCondition && matchesOpenBox && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.refurbPrice - b.refurbPrice;
    if (sortBy === 'price_high') return b.refurbPrice - a.refurbPrice;
    if (sortBy === 'battery') return (b.batteryHealthPercent || 0) - (a.batteryHealthPercent || 0);
    return 0;
  });

  const brands = ['All', 'Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi'];
  const conditions = ['All', 'Grade A', 'Grade A1', 'Grade B', 'Grade B1', 'Open Box', 'Like New', 'Superb', 'Good'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Bento Grid Top Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bento Box 1: Hero Buy Refurbished Banner */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                Certified Pan-India Storefront
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Up to 12-Month Warranty
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Certified Pre-Owned Phones up to <span className="text-indigo-600 underline underline-offset-4 decoration-indigo-300">50% Off</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2 max-w-lg">
              55-point technical inspection. Sanitized, original battery verified, sealed box with fast charger & 7-day hassle-free return window.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-xs">Up to 12-Mo Warranty</p>
                <p className="text-[10px] text-slate-500">Free door repair</p>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-xs">55-Point Check</p>
                <p className="text-[10px] text-slate-500">IMEI verified</p>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-xs">Pan-India</p>
                <p className="text-[10px] text-slate-500">2-4 days express</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Dark Accent Instant Buy Highlights */}
        <div className="lg:col-span-5 bg-indigo-600 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono bg-indigo-500 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Trending Deals
              </span>
              <h2 className="text-xl font-bold mt-2">Popular Refurbished</h2>
            </div>
            <Sparkles className="w-6 h-6 text-indigo-200" />
          </div>

          <div className="flex gap-3 overflow-hidden my-4">
            {catalog.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct(item)}
                className="bg-white/10 hover:bg-white/20 transition-colors cursor-pointer rounded-2xl p-3 flex-1 border border-white/10 text-white"
              >
                <img onError={onProductImageError} src={item.images[0] || PRODUCT_IMAGE_FALLBACK} alt={item.title} className="w-full h-24 object-contain rounded-xl mb-2 drop-shadow-sm" />
                <p className="text-xs font-bold truncate">{item.title}</p>
                <p className="text-xs opacity-90 font-mono font-bold mt-0.5">₹{item.refurbPrice.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-indigo-100 font-medium pt-2 border-t border-indigo-500/50">
            <span>Razorpay Secure Checkout</span>
            <span className="bg-white text-indigo-900 font-bold px-3 py-1 rounded-full text-[11px]">
              UPI / Cards / COD
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid Filter Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Brand:
          </span>
          {brands.map(b => (
            <button
              key={b}
              onClick={() => {
                setSelectedBrand(b);
                
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedBrand === b 
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b}
            </button>
          ))}

          {/* Highlighted Open Box Category Filter */}
          <button
            
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 border-2 ${
              false
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-105'
                : 'bg-amber-100/80 text-amber-900 border-amber-300/80 hover:bg-amber-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-slate-950 fill-amber-300" />
            <span>⚡ Open Box Chargers &amp; Tech</span>
          </button>
        </div>

        {/* Condition Grade and Sorting */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Grade:</span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {conditions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="featured">Featured</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Counter Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-medium">
        <span>
          Showing <strong className="text-slate-900">{filteredProducts.length}</strong> live listings (Limit: 500 max)
        </span>
        <span className="text-emerald-600 font-mono font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          All IMEI Serialized & Ready for Pan-India Dispatch
        </span>
      </div>

      {/* Product Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProducts.map(product => {
          const discountPercent = Math.round(((product.originalPrice - product.refurbPrice) / product.originalPrice) * 100);

          return (
            <div
              key={product.id}
              className="bg-white border border-slate-200 hover:border-indigo-500/50 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badges Container */}
                <div className="relative h-80 bg-slate-50 overflow-hidden cursor-pointer p-4 flex items-center justify-center" onClick={() => onSelectProduct(product)}>
                  <img
                    src={product.images[0] || PRODUCT_IMAGE_FALLBACK}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
                    onError={onProductImageError}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {product.conditionGrade === 'Open Box' ? '12-Mo Warranty' : '3-Mo Warranty'}
                    </span>
                  </div>

                  {/* Condition Grade Pill */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full shadow-md font-heading ${
                      product.conditionGrade === 'Grade A'
                        ? 'bg-emerald-600 text-white border border-emerald-400'
                        : product.conditionGrade === 'Grade A1'
                        ? 'bg-[#0052FF] text-white border border-blue-400'
                        : product.conditionGrade === 'Grade B'
                        ? 'bg-amber-500 text-slate-950 font-bold border border-amber-300'
                        : product.conditionGrade === 'Grade B1'
                        ? 'bg-purple-700 text-white border border-purple-400'
                        : product.conditionGrade === 'Like New' || product.conditionGrade === 'Open Box'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-white'
                    }`}>
                      {product.conditionGrade}
                    </span>
                  </div>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-mono bg-white/90 text-slate-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-slate-200">
                      IMEI: {product.serialImei.slice(0, 6)}...
                    </span>
                  {discountPercent > 0 && (
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full text-[10px]">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-3">
                  <div className="cursor-pointer" onClick={() => onSelectProduct(product)}>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
                      <span className="font-bold text-slate-900">{product.brand}</span>
                      <span>•</span>
                      <span>{product.storage}</span>
                      <span>•</span>
                      <span>{product.color}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {product.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900 font-mono">
                        ₹{product.refurbPrice.toLocaleString('en-IN')}
                      </span>
                      {discountPercent > 0 && (
                        <span className="text-xs text-slate-400 line-through ml-2 font-mono">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex flex-col gap-2.5">
                <button
                  onClick={() => onQuickBuy(product)}
                  className="w-full bg-gradient-to-r from-[#0052FF] to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white text-[15px] font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(0,82,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,82,255,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                  Buy Now — ₹{product.refurbPrice.toLocaleString('en-IN')}
                </button>
                <button
                  onClick={() => onSelectProduct(product)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-[13px] font-bold py-2.5 rounded-2xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  View Inspection Report
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
