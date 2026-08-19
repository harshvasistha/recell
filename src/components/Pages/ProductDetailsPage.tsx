import React, { useState, useEffect } from 'react';
import { CatalogProduct } from '../../types';
import { 
  ShieldCheck, CheckCircle2, Truck, PackageCheck, ShoppingCart, 
  IndianRupee, ChevronRight, Star, CreditCard, Wallet, MapPin, 
  ArrowLeft, Zap, Smartphone, Cpu, Camera, Battery, Layers, 
  SlidersHorizontal, Check, Info, Award
} from 'lucide-react';

interface ProductDetailsPageProps {
  product: CatalogProduct;
  onAddToCart: (product: CatalogProduct) => void;
  onBuyNow: (product: CatalogProduct) => void;
  onBack: () => void;
  catalog: CatalogProduct[];
  onSelectProduct: (product: CatalogProduct) => void;
  onNavigateHome?: () => void;
  onNavigateCategory?: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onBack,
  catalog,
  onSelectProduct,
  onNavigateHome,
  onNavigateCategory
}) => {
  const [activeImage, setActiveImage] = useState<string>(product.images?.[0] || '');
  const [selectedGrade, setSelectedGrade] = useState<string>(product.conditionGrade || 'Open Box');
  const [pincodeCheck, setPincodeCheck] = useState<string>('110001');
  const [pincodeStatus, setPincodeStatus] = useState<string>('Express Delivery in 2-3 Days');

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
    setSelectedGrade(product.conditionGrade || 'Open Box');
  }, [product]);

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

  // Other storage/RAM configs of this exact same phone model, so the page
  // can offer a variant switcher instead of only ever showing one fixed
  // config (each variant is its own CatalogProduct entry sharing brand+model).
  const sameModelVariants = catalog
    .filter(p => p.brand === product.brand && p.model === product.model)
    .sort((a, b) => a.refurbPrice - b.refurbPrice);

  const isCurrentOpenBox = selectedGrade === 'Open Box' || product.conditionGrade === 'Open Box';
  const cleanTitle = product.title.replace(/\s*-\s*Refurbished/gi, '').replace(/\[Grade.*?\]/gi, '').trim();

  // Specs object
  const specs = product.specs || {
    screen: '6.74" HD+ IPS LCD 90Hz Display',
    processor: 'MediaTek Octa-Core High Performance',
    rearCamera: '50MP AI Dual / Triple Camera',
    frontCamera: '8MP AI Selfie Camera',
    battery: '5000mAh with Fast Charging',
    os: 'Android 13 / 14 with Brand UI',
    dimensions: 'Slim 8.1mm profile, 192g',
    features: 'Side-mounted Fingerprint, Dual SIM, 3.5mm Audio'
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-24 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <button onClick={onBack} className="hover:text-blue-600 flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <ChevronRight className="w-3 h-3" />
          <button
            type="button"
            onClick={() => onNavigateHome?.()}
            className="hover:text-blue-600 cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button
            type="button"
            onClick={() => onNavigateCategory?.()}
            className="hover:text-blue-600 cursor-pointer"
          >
            {isCurrentOpenBox ? "Buy Open Box" : "Buy Certified Pre-Owned"} {product.brand}
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-slate-900">{cleanTitle}</span>
        </div>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Images Gallery */}
            <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col md:flex-row gap-6 border-b lg:border-b-0 lg:border-r border-slate-200">
              {/* Thumbnails (Vertical on desktop) */}
              <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {(product.images && product.images.length > 0 ? product.images : [activeImage]).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all p-1.5 flex items-center justify-center bg-slate-50 ${
                      activeImage === img ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.model} view ${idx + 1}`} 
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'; }}
                    />
                  </button>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="flex-1 order-1 md:order-2">
                <div className="relative w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center p-8 border border-slate-100">
                  <img
                    src={activeImage || product.images?.[0] || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'}
                    alt={cleanTitle}
                    className="max-w-full max-h-full object-contain drop-shadow-xl transition-all duration-300"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'; }}
                  />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isCurrentOpenBox ? "12 Months Manufacturer Warranty" : "3 Months Recell Warranty"}
                  </div>

                  {isCurrentOpenBox && (
                    <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      100% Sealed & Unused
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-6 p-6 lg:p-10 flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 font-heading tracking-tight">
                {cleanTitle}
              </h1>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center bg-emerald-600 text-white px-2 py-0.5 rounded text-xs font-bold gap-1">
                  4.5 <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-xs text-slate-500 font-medium">Verified 91mobiles & Retail Specs</span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                </span>
              </div>

              {/* Pricing */}
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-end gap-3 mb-1">
                  {discountPercent > 0 && (
                    <span className="text-emerald-600 font-black text-2xl">-{discountPercent}% OFF</span>
                  )}
                  <div className="text-3xl font-black text-slate-900 flex items-center">
                    <IndianRupee className="w-6 h-6 stroke-[2.5]" />
                    {product.refurbPrice.toLocaleString('en-IN')}
                  </div>
                  {discountPercent > 0 && (
                    <span className="text-slate-400 line-through text-lg font-medium flex items-center mb-1">
                      <IndianRupee className="w-4 h-4" />
                      {product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mt-1">
                  Get additional ₹1,000 instant discount with UPI / Credit Card offers
                </div>
              </div>

              {/* Grading System */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2.5">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Device Grading System
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Selected: <strong className="text-slate-900">{selectedGrade}</strong></span>
                </div>
                
                {/* Grading System: Open Box, A, A1, B, B1 */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {[
                    { id: 'Open Box', label: 'Open Box', desc: 'Sealed 12M' },
                    { id: 'Grade A', label: 'Grade A', desc: 'Like New' },
                    { id: 'Grade A1', label: 'Grade A1', desc: 'Superb' },
                    { id: 'Grade B', label: 'Grade B', desc: 'Good' },
                    { id: 'Grade B1', label: 'Grade B1', desc: 'Fair' }
                  ].map((grade) => (
                    <button
                      key={grade.id}
                      type="button"
                      onClick={() => setSelectedGrade(grade.id)}
                      className={`py-2.5 px-1 text-center rounded-xl border-2 transition-all ${
                        selectedGrade === grade.id 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="block text-xs font-black leading-tight">{grade.label}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{grade.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-3 bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                    {selectedGrade === 'Open Box' 
                      ? 'Open Box: 100% Sealed & Unused unit with original packaging, accessories, and 12-Month Official Manufacturer Warranty.' 
                      : `${selectedGrade}: Certified thoroughly inspected unit with 3-Month Recell Warranty and 7-day refund policy.`}
                  </p>
                </div>
              </div>

              {/* Key Features List */}
              <ul className="space-y-2 mb-6 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Condition:</strong> {selectedGrade === 'Open Box' ? 'Open Box (Sealed & Unused)' : selectedGrade}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Warranty:</strong> {isCurrentOpenBox ? '12 Months Official Manufacturer Warranty' : '3 Months Comprehensive Recell Warranty'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Original Packaging:</strong> Original Box, Charger & Factory Accessories Included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Return Policy:</strong> 7 Days No-Questions-Asked Refund Guarantee</span>
                </li>
              </ul>

              {/* Storage Variant Switcher & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-xs text-slate-900 mb-1.5 uppercase tracking-wider">Storage Variant</h3>
                  {sameModelVariants.length > 1 ? (
                    <div className="flex flex-wrap gap-2">
                      {sameModelVariants.map(variant => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => variant.id !== product.id && onSelectProduct(variant)}
                          className={`text-xs font-black px-3.5 py-2 rounded-lg border-2 transition-all ${
                            variant.id === product.id
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400'
                          }`}
                        >
                          {variant.storage}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="inline-block border-2 border-emerald-600 bg-emerald-50 text-emerald-900 text-xs font-black px-4 py-2 rounded-lg">
                      {product.storage}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 mb-1.5 uppercase tracking-wider">Color</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-white ring-2 ring-emerald-500"></div>
                    <span className="text-xs font-semibold text-slate-700">{product.color || 'Assorted Official'}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Pincode */}
              <div className="mb-6 border-t border-slate-200 pt-5">
                <h3 className="font-bold text-xs text-slate-900 mb-2 uppercase tracking-wider">Check Delivery & Pincode</h3>
                <form onSubmit={handlePincodeSubmit} className="relative max-w-md">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeCheck}
                    onChange={(e) => setPincodeCheck(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-24 py-2.5 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Enter 6-digit Pincode"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xs hover:text-emerald-700 px-3 py-1.5 rounded-lg bg-emerald-50"
                  >
                    Check
                  </button>
                </form>
                <p className="text-xs text-emerald-700 mt-2 font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> {pincodeStatus}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={() => onAddToCart(product)}
                  className="bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-800 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={() => onBuyNow(product)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Technical Specifications - Open Box only; the Refurbished
            dedicated page intentionally omits this section per catalog rules
            (Refurbished listings are graded/inspected units, not spec sheets). */}
        {product.conditionGrade === 'Open Box' && (
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-heading">
                {product.brand} {product.model} Complete Technical Specifications
              </h2>
              <p className="text-xs text-slate-500 mt-1">Sourced from official manufacturer retail spec sheet ({product.brand})</p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              100% Brand Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Display & Screen</span>
                <span className="font-semibold text-slate-900">{(specs as any)['Display'] || (specs as any)['screen'] || '6.74" 90Hz Smooth Display'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <Cpu className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Processor & Performance</span>
                <span className="font-semibold text-slate-900">{(specs as any)['Processor'] || (specs as any)['processor'] || 'High Performance Octa-Core Processor'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <Camera className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Rear Camera Matrix</span>
                <span className="font-semibold text-slate-900">{(specs as any)['Rear Camera'] || (specs as any)['Camera'] || (specs as any)['rearCamera'] || '50MP AI Dual / Triple Camera Setup'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <Camera className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Front Selfie Camera</span>
                <span className="font-semibold text-slate-900">{(specs as any)['Front Camera'] || (specs as any)['frontCamera'] || '8MP / 16MP AI Portrait Selfie Camera'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <Battery className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Battery & Charging</span>
                <span className="font-semibold text-slate-900">{(specs as any)['Battery'] || (specs as any)['battery'] || '5000mAh Massive Battery + Fast Charge'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <Layers className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Operating System</span>
                <span className="font-semibold text-slate-900">{(specs as any)['OS'] || (specs as any)['os'] || 'Official HyperOS / ColorOS'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <SlidersHorizontal className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Dimensions & Form Factor</span>
                <span className="font-semibold text-slate-900">{(specs as any)['Dimensions & Weight'] || (specs as any)['Dimensions'] || (specs as any)['dimensions'] || 'Ergonomic Slim Profile'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Security & Connectivity</span>
                <span className="font-semibold text-slate-900">{(specs as any)['Security & Ports'] || (specs as any)['Features'] || (specs as any)['features'] || 'Side Fingerprint, Dual SIM, 3.5mm Jack'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <PackageCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Box Contents</span>
                <span className="font-semibold text-slate-900">{(specs as any)['Box Contents'] || 'Handset, Power Adapter, USB-C Cable, SIM Tool, Warranty Card'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <Award className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">RAM & ROM Configuration</span>
                <span className="font-semibold text-slate-900">{(specs as any)['RAM & Storage'] || (product.storage ? product.storage + ' Built-in' : 'Official Storage Variant')}</span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map(rec => (
                <div key={rec.id} onClick={() => onSelectProduct(rec)} className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="aspect-square bg-slate-50 rounded-xl mb-4 p-4 flex items-center justify-center relative">
                    <img 
                      src={rec.images?.[0] || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'} 
                      alt={rec.title}
                      className="max-h-full object-contain group-hover:scale-105 transition-transform" 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'; }} 
                    />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1 truncate">{rec.title.replace(/\s*-\s*Refurbished/gi, '')}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-emerald-600">₹{rec.refurbPrice.toLocaleString('en-IN')}</span>
                    {rec.originalPrice > rec.refurbPrice && (
                      <span className="text-xs text-slate-400 line-through">₹{rec.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ReCell Trust Badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
             <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-slate-900 mb-1">12-Month Brand Warranty</h3>
             <p className="text-xs text-slate-500">Official manufacturer warranty support valid across all authorized service centers.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <PackageCheck className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-slate-900 mb-1">Original Sealed Packaging</h3>
             <p className="text-xs text-slate-500">Unused condition with original cable, charger, manuals, and serial-matched invoice.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
             <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Wallet className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-slate-900 mb-1">7-Day Refund Guarantee</h3>
             <p className="text-xs text-slate-500">100% money-back guarantee with zero hassle return pickup at your doorstep.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
