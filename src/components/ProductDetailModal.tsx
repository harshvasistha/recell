import React, { useState } from 'react';
import { CatalogProduct } from '../types';
import { X, ShieldCheck, Battery, CheckCircle2, Truck, PackageCheck, AlertCircle, ShoppingCart, IndianRupee } from 'lucide-react';
import { PRODUCT_IMAGE_FALLBACK, onProductImageError } from '../utils/productImageFallback';

interface ProductDetailModalProps {
  product: CatalogProduct | null;
  onClose: () => void;
  onAddToCart: (product: CatalogProduct) => void;
  onBuyNow: (product: CatalogProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.images[0] || '');
  const [pincodeCheck, setPincodeCheck] = useState<string>('110001'); // Delhi default
  const [pincodeStatus, setPincodeStatus] = useState<string>('Express Delivery in 2-3 Days via Delhivery');

  const discountAmount = product.originalPrice - product.refurbPrice;
  const discountPercent = Math.round((discountAmount / product.originalPrice) * 100);

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeCheck.length === 6) {
      setPincodeStatus(`Verified: Express Delivery to Pincode ${pincodeCheck} in 2-4 Days (Free Shipping)`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian Pincode');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto text-white shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Photos Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center p-4 shadow-sm">
              <img
                src={activeImage || product.images[0] || PRODUCT_IMAGE_FALLBACK}
                alt={product.title}
                className="w-full h-full object-contain drop-shadow-md"
                onError={onProductImageError}
              />
              <span className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                {product.conditionGrade === 'Open Box' ? '12-Month Brand' : '3-Month RePhone'} Warranty
              </span>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex flex-wrap items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border-2 transition-all p-1 flex items-center justify-center ${
                      activeImage === img ? 'border-[#0052FF] ring-2 ring-[#0052FF]/20' : 'border-slate-200 opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain drop-shadow-sm" onError={onProductImageError} />
                  </button>
                ))}
              </div>
            )}

            {/* Serial / IMEI Verification Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>IMEI / Serial:</span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded">{product.serialImei}</span>
              </div>
            </div>

            {/* Grade Specific Explanation Box */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] leading-snug text-slate-300">
                {product.conditionGrade === 'Grade A' && (
                  <p className="text-emerald-400 font-medium">
                    <strong className="text-white font-bold">Grade A:</strong> Under official service center warranty ({product.brandWarrantyMonths || product.warrantyMonths || 6} months remaining). 100% original parts.
                  </p>
                )}
                {product.conditionGrade === 'Grade A1' && (
                  <p className="text-blue-400 font-medium">
                    <strong className="text-white font-bold">Grade A1:</strong> New condition mobile phone with {product.warrantyMonths} Months ReCell warranty. 100% original untampered hardware.
                  </p>
                )}
                {product.conditionGrade === 'Grade B' && (
                  <p className="text-amber-400 font-medium">
                    <strong className="text-white font-bold">Grade B:</strong> Minor rough cosmetic condition (light frame scuffs), <span className="underline font-bold text-white">NEVER REPAIRED</span>. Includes {product.warrantyMonths} Months ReCell warranty.
                  </p>
                )}
                {product.conditionGrade === 'Grade B1' && (
                  <p className="text-purple-400 font-medium">
                    <strong className="text-white font-bold">Grade B1 (Budget):</strong> Certified Repaired phone (Folder/screen, jack, mic, speaker). 100% functional pass, no warranty, lowest budget price.
                  </p>
                )}
                {!['Grade A', 'Grade A1', 'Grade B', 'Grade B1'].includes(product.conditionGrade) && (
                  <p className="text-slate-300">
                    <strong className="text-white font-bold">{product.conditionGrade}:</strong> Certified 55-point inspected pre-owned device with {product.warrantyMonths} Months warranty.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Details, Inspection Report & Buy Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold mb-1">
                <span>{product.brand}</span>
                <span>•</span>
                <span>{product.storage}</span>
                <span>•</span>
                <span>{product.color}</span>
              </div>
              <h1 className="text-2xl font-black text-white">{product.title}</h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{product.description}</p>
            </div>

            {/* Pricing Card */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">{product.isOpenBox || product.conditionGrade === 'Open Box' ? 'Selling Price' : 'Refurbished Price'}</span>
                <div className="text-3xl font-black text-white font-mono flex items-center">
                  <IndianRupee className="w-6 h-6" />
                  {product.refurbPrice.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-2 text-xs mt-0.5">
                  <span className="text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-emerald-400 font-bold">Save ₹{discountAmount.toLocaleString('en-IN')} ({discountPercent}% OFF)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Ready to Ship
                </span>
              </div>
            </div>

            {/* 55-Point Inspection Checklist Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                55-Point Inspection Report
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Screen Display:</span>
                  <span className="text-emerald-400 font-bold">PASSED (100%)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Touch Response:</span>
                  <span className="text-emerald-400 font-bold">PASSED</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Cameras & Sensors:</span>
                  <span className="text-emerald-400 font-bold">PASSED</span>
                </div>
              </div>
            </div>

            {/* What's in the Box */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-slate-300 flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-indigo-400" />
                Included in Package:
              </p>
              <p className="text-slate-400 pl-5">
                • {product.title} (Sanitized) <br />
                • High-speed USB charging cable <br />
                • {product.conditionGrade === 'Open Box' ? '12-Month Brand' : 'RePhone 3-Month'} Warranty Card with QR Warranty Register <br />
                • SIM Ejector tool
              </p>
            </div>

            {/* Delivery Pincode Checker */}
            <form onSubmit={handlePincodeSubmit} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-purple-400" />
                Estimate Delivery Date
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeCheck}
                  onChange={(e) => setPincodeCheck(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono w-32"
                  placeholder="Enter Pincode"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700"
                >
                  Check
                </button>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">{pincodeStatus}</p>
            </form>

            {/* Checkout Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  onBuyNow(product);
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-[#0052FF] to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white text-[16px] font-black py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,82,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,82,255,0.23)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Buy Now (Razorpay)
              </button>

              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};
