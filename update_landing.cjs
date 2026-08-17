const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const gradingSystem = `
      {/* 4.5. REFURBISHED GRADING SYSTEM */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mt-20 mb-20"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider inline-block font-heading shadow-sm">
            Transparent Quality
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading drop-shadow-sm">Device Grading System</h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Every device passes a strict 32-point hardware test. Choose the condition that fits your budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Superb Grade */}
          <div className="p-8 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-6 shadow-sm">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-heading">Superb (A+)</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Flawless condition. Looks and feels like a brand-new device out of the box. No visible scratches or dents.
            </p>
            <ul className="space-y-2 mt-4 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> 100% Functionality</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Pristine Screen & Body</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Battery Health &gt; 90%</li>
            </ul>
          </div>

          {/* Good Grade */}
          <div className="p-8 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 transform md:-translate-y-4 relative border-t-4 border-t-blue-500">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">Most Popular</div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-6 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-heading">Good (A)</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Excellent value. Minor signs of wear like light micro-scratches on the body, invisible when screen is on.
            </p>
            <ul className="space-y-2 mt-4 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> 100% Functionality</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Light Usage Marks</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Battery Health &gt; 85%</li>
            </ul>
          </div>

          {/* Fair Grade */}
          <div className="p-8 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-6 shadow-sm">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-heading">Fair (B)</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Budget-friendly. Noticeable scratches or minor dents on the frame, but completely structurally sound and tested.
            </p>
            <ul className="space-y-2 mt-4 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> 100% Functionality</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Visible Scratches/Dents</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Battery Health &gt; 80%</li>
            </ul>
          </div>
        </div>
      </motion.section>
`;

code = code.replace('{/* 4. RECELL VS UNORGANIZED LOCAL MARKET COMPARISON */}', gradingSystem + '\n      {/* 4. RECELL VS UNORGANIZED LOCAL MARKET COMPARISON */}');
fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Added grading system');
