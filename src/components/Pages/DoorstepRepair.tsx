import React, { useState } from 'react';
import { Wrench, ShieldCheck, Clock, CheckCircle2, MapPin, Smartphone, ChevronRight } from 'lucide-react';

export const DoorstepRepair: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [selectedModel, setSelectedModel] = useState('iPhone 13');
  const [selectedRepair, setSelectedRepair] = useState('Screen Glass & Display');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pincode, setPincode] = useState('250101');
  const [booked, setBooked] = useState(false);

  const repairPrices: Record<string, number> = {
    'Screen Glass & Display': 3499,
    'Original Battery Swap': 1899,
    'Charging Port Replacement': 999,
    'Camera Module Repair': 2299,
    'Back Glass Replacement': 1499,
    'Speaker & Earpiece Mesh': 799
  };

  const handleBookRepair = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10 text-slate-900">
      {/* Title Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <span className="bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" /> Express Doorstep Service
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">30-Minute Mobile Repair at Your Doorstep</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Don't leave your phone at risky market repair shops. Watch our certified L2 technician replace original screen glass, battery, or charging port right inside your home or office.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl text-center shrink-0 space-y-1">
          <p className="text-2xl font-black text-amber-400 font-mono">6 Months</p>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Repair Warranty</p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-indigo-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">100% Data Privacy</p>
            <p className="text-slate-500">Phone never leaves your sight during repair.</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3">
          <Clock className="w-8 h-8 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">30-Min Fast Turnaround</p>
            <p className="text-slate-500">Quick ESD-safe component replacement.</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Grade-A Certified Parts</p>
            <p className="text-slate-500">OEM quality screens & original battery cells.</p>
          </div>
        </div>
      </div>

      {/* Interactive Booking Widget */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-black text-slate-900">Book Instant Doorstep Repair Slot</h2>
          <p className="text-xs text-slate-500 mt-0.5">Active in Meerut (250101) &amp; NCR region with zero visit charge.</p>
        </div>

        {booked ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-900">Doorstep Repair Slot Confirmed!</h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              Our technician lead will call <strong>{customerPhone}</strong> within 15 minutes to confirm arrival at Pincode {pincode}.
            </p>
            <div className="p-3 bg-white border border-emerald-200 rounded-xl text-xs font-mono font-bold text-slate-800 max-w-sm mx-auto">
              Estimated Total: ₹{repairPrices[selectedRepair]?.toLocaleString('en-IN')} (Pay After Repair)
            </div>
            <button
              onClick={() => setBooked(false)}
              className="text-xs text-emerald-800 font-bold underline pt-2"
            >
              Book Another Repair
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookRepair} className="space-y-4 text-xs">
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
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Device Model</label>
                <input
                  type="text"
                  required
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  placeholder="e.g. iPhone 13 / S23 Ultra"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Select Repair Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.keys(repairPrices).map((repairKey) => (
                  <div
                    key={repairKey}
                    onClick={() => setSelectedRepair(repairKey)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedRepair === repairKey
                        ? 'bg-amber-50 border-amber-500 font-bold text-amber-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{repairKey}</span>
                    <span className="font-mono text-amber-700 font-bold">₹{repairPrices[repairKey].toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 Phone"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all mt-4"
            >
              Confirm Repair Booking (Pay ₹{repairPrices[selectedRepair]} After Work)
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
