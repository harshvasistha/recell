const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const replacement = `        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Feature 1 */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-6 p-8 sm:p-10 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-3xl space-y-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-5 z-10 relative">
              <div className="w-16 h-16 rounded-2xl bg-[#0052FF] text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">Complete Inspection</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Screen glass, display touch, camera, speakers, battery health, and body condition verified transparently right in front of you.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs z-10 w-full mt-4">
              {['Display Touch', 'Camera & OIS', 'Battery Health', 'Microphone'].map((item, idx) => (
                <div key={idx} className="p-3 bg-white border border-indigo-100 rounded-2xl flex items-center gap-2.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#0052FF] shrink-0" />
                  <span className="font-bold text-slate-700 text-[11px] sm:text-xs">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-6 p-8 sm:p-10 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl space-y-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-900 text-2xl sm:text-3xl font-heading">3-Month Warranty</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Every certified pre-owned phone sold includes 90 days of comprehensive hardware protection with free reverse pickup.
              </p>
            </div>
            <button
              onClick={() => onOpenLegal('warranty')}
              className="text-base font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 pt-3 cursor-pointer transition-colors mt-auto"
            >
              Read Warranty Terms &rarr;
            </button>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-6 p-8 sm:p-10 bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-3xl space-y-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/30">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-900 text-2xl sm:text-3xl font-heading">DoD Military Data Wipe</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                100% zero data leak guarantee. Department of Defense compliant sanitization permanently wipes all personal files.
              </p>
            </div>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="text-base font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 pt-3 cursor-pointer transition-colors mt-auto"
            >
              Data Protection Certificate &rarr;
            </button>
          </motion.div>

          {/* Feature 4 */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            className="md:col-span-6 p-8 sm:p-10 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-3xl space-y-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-900 text-2xl sm:text-3xl font-heading">Zero Landfill Recycling</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Dispose of dead devices responsibly. We divert toxic lithium batteries and circuit boards from polluting water tables.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 mt-auto">
              <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-4 py-2 rounded-xl font-mono shadow-sm">
                45 Tons E-Waste Saved
              </span>
            </div>
          </motion.div>

        </div>`;

// Find the start and end of the Bento Grid Layout
const startTag = '{/* Bento Grid Layout */}';
const endTag = '</motion.section>';
const startIndex = code.indexOf(startTag);
const endIndex = code.indexOf(endTag, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex + startTag.length) + '\n' + replacement + '\n      ' + code.substring(endIndex);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('Replaced features section.');
} else {
  console.log('Could not find section.');
}
