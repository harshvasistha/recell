import React, { useState } from 'react';
import { CatalogProduct } from '../../types';
import { PackageCheck, ShieldCheck, Sparkles, Filter, CheckCircle2, ShoppingBag, ArrowRight, Clock, Award, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface OpenBoxMobilesProps {
  catalog: CatalogProduct[];
  onSelectProduct: (product: CatalogProduct) => void;
  onOpenAuth: () => void;
}

export const OpenBoxMobiles: React.FC<OpenBoxMobilesProps> = ({
  catalog,
  onSelectProduct,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter catalog for open box devices or 5-10 day old devices
  const openBoxProducts = catalog.filter((p) => {
    const isOpenBox = p.isOpenBox || p.conditionGrade === 'Open Box (5-10 Days)' || p.title.toLowerCase().includes('open box');
    const matchesBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesQuery = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.model.toLowerCase().includes(searchQuery.toLowerCase());
    return isOpenBox && matchesBrand && matchesQuery;
  });

  const brands = ['All', 'Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10 text-slate-900">
      {/* Banner / Header */}
      <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-[#0052FF]/30 to-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider font-heading inline-flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-4 h-4 text-slate-950" />
              100% Genuine Open Box Delivery
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full font-mono">
              5 to 10 Days Old Phones
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white leading-tight">
            Open Box Delivery Smartphones
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Brand new 5 to 10 days old mobile phones with original brand seal opened for inspection. Comes with <strong className="text-white">Original Box, Bill, Accessories</strong> and <strong className="text-amber-300">11-12 Months Official Manufacturer Warranty</strong> — priced 25% to 35% below MRP!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="block font-black text-white">5-10 Days Old</span>
                <span className="text-[10px] text-slate-400">Mint Unboxed Condition</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="block font-black text-white">Brand Warranty</span>
                <span className="text-[10px] text-slate-400">11+ Months Official</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-2.5">
              <PackageCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <span className="block font-black text-white">Original Box &amp; GST Bill</span>
                <span className="text-[10px] text-slate-400">Complete Kit</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-2.5">
              <Award className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="block font-black text-white">25% Price Cut</span>
                <span className="text-[10px] text-slate-400">Instant Savings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Brand Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <span className="text-xs font-bold text-slate-500 shrink-0 font-heading">Brand:</span>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer font-heading ${
                selectedBrand === b
                  ? 'bg-[#0052FF] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search open box iPhone, Galaxy, OnePlus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0052FF] outline-none text-slate-900"
          />
        </div>
      </div>

      {/* Products Grid */}
      {openBoxProducts.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
          <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">No Open Box Mobiles Found</h3>
          <p className="text-xs text-slate-500">Try changing your brand filter or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {openBoxProducts.map((product) => {
            const savingsPercent = Math.round(
              ((product.originalPrice - product.refurbPrice) / product.originalPrice) * 100
            );

            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200 hover:border-[#0052FF] rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Age Badge */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider font-heading">
                    {product.openBoxAgeDays || 7} Days Old
                  </span>
                  <span className="bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[9px] font-mono px-2 py-0.5 rounded-full">
                    {product.brandWarrantyMonths || 11}M Brand Warranty
                  </span>
                </div>

                <div>
                  {/* Image Container */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-4/3 mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                      
                    </div>
                  </div>

                  {/* Title & Specs */}
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider font-heading block">
                    {product.brand} &bull; Open Box Delivery
                  </span>
                  <h3 className="font-heading text-sm font-black text-slate-900 group-hover:text-[#0052FF] transition-colors leading-snug line-clamp-2 mt-0.5">
                    {product.title}
                  </h3>

                  <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Original Tax Invoice &amp; Accessories</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Zero usage scratches or blemishes</span>
                    </div>
                  </div>
                </div>

                {/* Price & Buy Action */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 line-through font-mono block">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="font-mono text-lg font-black text-[#0052FF]">
                        ₹{product.refurbPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-[11px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                      Save {savingsPercent}%
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="w-full bg-[#0052FF] hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-full text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-heading"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Buy Open Box Mobile
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Trust & Guarantee Callout */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 font-heading">Need Help Selecting an Open Box Mobile?</h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Visit our physical store at <strong>Recell store, Pathsala road, Khekra, Baghpat, U.P., 250101</strong> or call our Customer Helpline for live video inspection of device condition before dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:9310552055"
            className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-full text-xs flex items-center gap-2 transition-all font-heading"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            Helpline: +91 9310552055
          </a>
        </div>
      </div>
    </div>
  );
};
