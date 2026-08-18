import React, { useState } from 'react';
import { CatalogProduct } from '../../types';
import { ShieldCheck, CheckCircle2, Truck, PackageCheck, ShoppingCart, IndianRupee, ChevronRight, Star, CreditCard, Wallet, MapPin, Search, ArrowLeft, Zap } from 'lucide-react';

interface ProductDetailsPageProps {
  product: CatalogProduct;
  onAddToCart: (product: CatalogProduct) => void;
  onBuyNow: (product: CatalogProduct) => void;
  onBack: () => void;
  catalog: CatalogProduct[]; // For recommendations
  onSelectProduct: (product: CatalogProduct) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onBack,
  catalog,
  onSelectProduct
}) => {
  const [activeImage, setActiveImage] = useState<string>(product.images[0] || '');
  const [pincodeCheck, setPincodeCheck] = useState<string>('110001');
  const [pincodeStatus, setPincodeStatus] = useState<string>('Express Delivery in 2-3 Days');

  const discountAmount = product.originalPrice - product.refurbPrice;
  const discountPercent = Math.round((discountAmount / product.originalPrice) * 100);

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeCheck.length === 6) {
      setPincodeStatus(`Verified: Express Delivery to Pincode ${pincodeCheck} in 2-4 Days`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Pincode');
    }
  };

  const recommendedProducts = catalog
    .filter(p => p.id !== product.id && p.brand === product.brand)
    .slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-24 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button onClick={onBack} className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-blue-600 cursor-pointer">Buy Refurbished {product.brand}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-slate-900">{product.title}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Images */}
            <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col md:flex-row gap-6 border-b lg:border-b-0 lg:border-r border-slate-200">
              {/* Thumbnails (Vertical on desktop) */}
              <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all p-1.5 flex items-center justify-center ${
                      activeImage === img ? 'border-emerald-500' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="flex-1 order-1 md:order-2">
                <div className="relative w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center p-8">
                  <img
                    src={activeImage || product.images[0]}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain drop-shadow-xl"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {product.brandWarrantyMonths || product.warrantyMonths || 12} Months Warranty
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-6 p-6 lg:p-10 flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{product.title} - Refurbished</h1>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center bg-emerald-500 text-white px-2 py-0.5 rounded text-xs font-bold gap-1">
                  4.4 <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-xs text-slate-500 underline decoration-dashed">5121 reviews</span>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-red-500 font-bold text-2xl">-{discountPercent}%</span>
                  <div className="text-3xl font-black text-slate-900 flex items-center">
                    <IndianRupee className="w-6 h-6 stroke-[2.5]" />
                    {product.refurbPrice.toLocaleString('en-IN')}
                  </div>
                  <span className="text-slate-400 line-through text-lg font-medium flex items-center mb-1">
                    <IndianRupee className="w-4 h-4" />
                    {product.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  Get it for ₹{(product.refurbPrice - 1000).toLocaleString('en-IN')} with Bank Offers
                </div>
              </div>

              {/* Condition Options (Visual only) */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-3">
                  <h3 className="font-bold text-sm text-slate-900">Condition</h3>
                  <a href="#" className="text-xs text-blue-600 hover:underline">Learn More</a>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button className={`py-2 px-1 text-[11px] font-bold border-2 rounded-lg text-center ${product.conditionGrade.includes('Open Box') ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    Open Box
                  </button>
                  <button className={`py-2 px-1 text-[11px] font-bold border-2 rounded-lg text-center ${product.conditionGrade === 'Grade A' ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    Superb
                  </button>
                  <button className={`py-2 px-1 text-[11px] font-bold border-2 rounded-lg text-center ${product.conditionGrade === 'Grade B' ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    Good
                  </button>
                  <button className={`py-2 px-1 text-[11px] font-bold border-2 rounded-lg text-center ${product.conditionGrade === 'Grade B1' ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    Fair
                  </button>
                </div>
                <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-800 font-medium">
                    All devices have a default {product.brandWarrantyMonths || product.warrantyMonths || 12} Months warranty out of the box
                  </p>
                </div>
              </div>

              {/* Key Features List */}
              <ul className="space-y-2 mb-8 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  Fully tested & 100% functional
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  {product.conditionGrade}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  {product.brandWarrantyMonths || product.warrantyMonths || 12} Months Warranty
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  7 days no question refund policy
                </li>
              </ul>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-2">Storage</h3>
                  <div className="inline-block border-2 border-emerald-500 bg-emerald-50 text-emerald-800 text-xs font-bold px-4 py-2 rounded-lg">
                    {product.storage}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-2">Color</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white ring-2 ring-emerald-500"></div>
                    <span className="text-xs font-medium text-slate-700">{product.color}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Pincode */}
              <div className="mb-8 border-t border-slate-200 pt-6">
                <h3 className="font-bold text-sm text-slate-900 mb-3">Check Delivery</h3>
                <form onSubmit={handlePincodeSubmit} className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeCheck}
                    onChange={(e) => setPincodeCheck(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-24 py-3 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Postal code e.g. 414001"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-sm hover:text-emerald-700 px-2"
                  >
                    Check
                  </button>
                </form>
                <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> {pincodeStatus}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <button
                  onClick={() => onAddToCart(product)}
                  className="bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button
                  onClick={() => onBuyNow(product)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-colors"
                >
                  Buy Now
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map(rec => (
                <div key={rec.id} onClick={() => onSelectProduct(rec)} className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="aspect-square bg-slate-50 rounded-xl mb-4 p-4 flex items-center justify-center relative">
                    <img src={rec.images[0]} className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1 truncate">{rec.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-emerald-600">₹{rec.refurbPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-400 line-through">₹{rec.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Blocks */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
             <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Certified Quality</h3>
             <p className="text-sm text-slate-500">Every device undergoes a strict 55-point quality check by our experts.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <PackageCheck className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Original Accessories</h3>
             <p className="text-sm text-slate-500">Devices come with a certified box, charging cable, and a warranty card.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
             <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Wallet className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-slate-900 mb-2">Secure Payments</h3>
             <p className="text-sm text-slate-500">Pay securely via Credit Card, EMI, UPI or choose Cash on Delivery.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
