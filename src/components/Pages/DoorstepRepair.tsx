import React, { useState } from 'react';
import { Wrench, ShieldCheck, Clock, CheckCircle2, MapPin, Smartphone, ChevronRight, Gift, HelpCircle, FileText } from 'lucide-react';

export const DoorstepRepair: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [selectedModel, setSelectedModel] = useState('iPhone 13');
  const [selectedRepair, setSelectedRepair] = useState('Screen Glass & Display');
  const [customInstruction, setCustomInstruction] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pincode, setPincode] = useState('250101');
  const [booked, setBooked] = useState(false);

  // Minimum starting price per repair type
  const repairOptions = [
    { type: 'Screen Glass & Display', startPrice: 1199, icon: '📱', desc: 'Cracked glass or LCD touch replacement' },
    { type: 'Charging Port Replacement', startPrice: 299, icon: '🔌', desc: 'Slow charging or loose port fix' },
    { type: 'Original Battery Swap', startPrice: 699, icon: '🔋', desc: 'High capacity certified battery cell' },
    { type: 'Camera Module Repair', startPrice: 999, icon: '📷', desc: 'Blurry lens, OIS shake, or glass fix' },
    { type: 'Back Glass Replacement', startPrice: 799, icon: '✨', desc: 'Laser rear glass panel replacement' },
    { type: 'Speaker & Earpiece Mesh', startPrice: 399, icon: '🔊', desc: 'Low call volume or distorted sound' },
    { type: 'Other / Custom Repair Issue', startPrice: 299, icon: '🛠️', desc: 'Model not listed or custom issue details' },
  ];

  const currentOption = repairOptions.find(r => r.type === selectedRepair) || repairOptions[0];

  const handleBookRepair = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10 text-slate-900">
      {/* Title Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" /> Express Doorstep Service
            </span>
            <span className="bg-emerald-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 animate-pulse">
              <Gift className="w-3.5 h-3.5" /> Free Pickup For First 1,000 Users
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">30-Minute Mobile Repair at Your Doorstep</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Don't leave your phone at risky market repair shops. Watch our certified technician replace screen glass, battery, or charging port right inside your home or office with ESD safety.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 p-4.5 rounded-2xl text-center shrink-0 space-y-1 relative z-10">
          <p className="text-xl font-black text-amber-400 font-mono">₹0 Pickup Fee</p>
          <p className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider">First 1,000 Users Free</p>
        </div>
      </div>

      {/* Free Pickup Offer Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-xs">
            🎁
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">No Pickup & Doorstep Visit Charges!</h4>
            <p className="text-xs text-slate-600">Zero technician visit fee for the first 1,000 users in Khekra, Baghpat & 250101 area.</p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-3 py-1 rounded-full border border-amber-300">
          Limited Slots Active
        </span>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-xs">
          <ShieldCheck className="w-8 h-8 text-indigo-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">100% Live Visual Repair</p>
            <p className="text-slate-500">Phone never leaves your sight during service.</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-xs">
          <Clock className="w-8 h-8 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">30-Min Fast Turnaround</p>
            <p className="text-slate-500">Quick ESD-safe component replacement.</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Grade-A Certified Spares</p>
            <p className="text-slate-500">OEM quality displays & original battery cells.</p>
          </div>
        </div>
      </div>

      {/* Interactive Booking Widget */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900">Book Instant Doorstep Repair Slot</h2>
            <p className="text-xs text-slate-500 mt-0.5">Active in Khekra, Baghpat (250101) &amp; NCR region with zero pickup charge.</p>
          </div>
          <span className="bg-emerald-50 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200">
            ₹0 Doorstep Visit Fee
          </span>
        </div>

        {booked ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-900">Doorstep Repair Slot Confirmed!</h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              Our certified technician will call <strong>{customerPhone}</strong> shortly to confirm arrival at Pincode {pincode}.
            </p>
            <div className="p-4 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 max-w-sm mx-auto space-y-1 text-left">
              <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">Booking Summary:</p>
              <p>• <strong>Device:</strong> {selectedBrand} {selectedModel}</p>
              <p>• <strong>Service:</strong> {selectedRepair} (Starts @ ₹{currentOption.startPrice})</p>
              <p>• <strong>Pickup Charge:</strong> <span className="text-emerald-600 font-bold">FREE (₹0 for 1,000 Users)</span></p>
              {customInstruction && (
                <p>• <strong>Custom Note:</strong> "{customInstruction}"</p>
              )}
            </div>
            <button
              onClick={() => {
                setBooked(false);
                setCustomInstruction('');
              }}
              className="text-xs text-emerald-800 font-bold underline pt-2 cursor-pointer"
            >
              Book Another Repair
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookRepair} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                >
                  <option value="Apple">Apple iPhone</option>
                  <option value="Samsung">Samsung Galaxy</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Xiaomi">Xiaomi / Redmi</option>
                  <option value="Vivo">Vivo</option>
                  <option value="Oppo">Oppo</option>
                  <option value="Realme">Realme</option>
                  <option value="Google">Google Pixel</option>
                  <option value="iQOO">iQOO</option>
                  <option value="Motorola">Motorola</option>
                  <option value="Other">Other Brand (Specify in box below)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Device Model <span className="text-slate-400 font-normal">(If not listed, type below)</span>
                </label>
                <input
                  type="text"
                  required
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  placeholder="e.g. iPhone 13 / S23 Ultra / Redmi Note 12"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Repair Type Options with Minimum Price */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center justify-between">
                <span>Select Repair Service Type</span>
                <span className="text-[11px] text-[#0052FF] font-semibold">Minimum prices listed for each repair</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {repairOptions.map((option) => (
                  <div
                    key={option.type}
                    onClick={() => setSelectedRepair(option.type)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedRepair === option.type
                        ? 'bg-amber-50 border-amber-500 font-bold text-amber-950 shadow-xs ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{option.icon}</span>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{option.type}</p>
                        <p className="text-[10px] text-slate-500 font-normal">{option.desc}</p>
                      </div>
                    </div>
                    <span className="font-mono text-amber-700 font-extrabold text-xs whitespace-nowrap bg-amber-100/60 px-2 py-0.5 rounded-lg border border-amber-200">
                      Starts @ ₹{option.startPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Instruction / Unlisted Model Box */}
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 font-heading">
                  <FileText className="w-4 h-4 text-[#0052FF]" />
                  Custom Instruction / Unlisted Model & Issue Box
                </label>
                <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-100 px-2 py-0.5 rounded-full">
                  Optional
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                If your phone model is not in the list, or your specific repair requirement is not available above (e.g., motherboard IC repair, liquid damage cleaning, custom glass fitting), write your instructions here:
              </p>
              <textarea
                rows={3}
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="e.g. My model is iPhone 11 Pro Max. Need front glass replacement + speaker mesh cleaning. Please call before arriving."
                className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF] font-medium"
              />
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 Mobile Number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Confirm Button without Price */}
            <button
              type="submit"
              className="w-full bg-[#0052FF] hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all mt-4 cursor-pointer font-heading"
            >
              Confirm Doorstep Repair Booking
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
