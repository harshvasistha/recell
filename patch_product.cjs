const fs = require('fs');
let code = fs.readFileSync('src/components/Pages/ProductDetailsPage.tsx', 'utf8');

const specsStr = `
        {/* Top Specs */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Top Specs</h2>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div>
              <h4 className="text-xs text-slate-500 font-bold mb-1">Display</h4>
              <p className="text-sm font-medium text-slate-900">{product.specs?.screen || 'Standard Display'}</p>
            </div>
            <div>
              <h4 className="text-xs text-slate-500 font-bold mb-1">Processor</h4>
              <p className="text-sm font-medium text-slate-900">{product.specs?.processor || 'Octa-Core Processor'}</p>
            </div>
            <div>
              <h4 className="text-xs text-slate-500 font-bold mb-1">RAM</h4>
              <p className="text-sm font-medium text-slate-900">{product.specs?.ram || product.storage.split('+')[0] + 'GB' || '4GB'}</p>
            </div>
            <div>
              <h4 className="text-xs text-slate-500 font-bold mb-1">Camera</h4>
              <p className="text-sm font-medium text-slate-900">{product.specs?.camera || 'AI Dual Camera'}</p>
            </div>
            <div>
              <h4 className="text-xs text-slate-500 font-bold mb-1">Network</h4>
              <p className="text-sm font-medium text-slate-900">5G / 4G VOLTE, Dual SIM</p>
            </div>
          </div>
        </div>

        {/* What comes with the phone */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center">
          <h2 className="text-xl font-bold text-slate-900 mb-8">What comes with the phone?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                <PackageCheck className="w-8 h-8 text-slate-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">A Minimalistic Box</h4>
              <p className="text-xs text-slate-500">Every refurbished phone is lovingly repackaged in a brand-new SmartBuy box.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                <Zap className="w-8 h-8 text-slate-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">A compatible USB cable</h4>
              <p className="text-xs text-slate-500">Phones come with charging cables out no power adapter to help reduce e-waste.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                <ShieldCheck className="w-8 h-8 text-slate-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">A warranty card</h4>
              <p className="text-xs text-slate-500">We pack in a warranty card that grants you {product.brandWarrantyMonths || product.warrantyMonths || 12} months of protection.</p>
            </div>
          </div>
        </div>
`;

code = code.replace(/        <\/div>\n      <\/div>\n    <\/div>\n  \);\n};/, specsStr + '\n      </div>\n    </div>\n  );\n};\n');

fs.writeFileSync('src/components/Pages/ProductDetailsPage.tsx', code);
