import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, RotateCcw, X, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'warranty' | 'returns';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'warranty' | 'returns'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-black tracking-tight">Recell Legal &amp; Policy Compliance</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 sm:p-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Privacy &amp; Data Wipe Guarantee
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === 'terms'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Terms &amp; Trade-In Conditions
          </button>

          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === 'warranty'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            3-Month Warranty Policy
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === 'returns'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            7-Day Return &amp; Refund Policy
          </button>
        </div>

        {/* Policy Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 leading-relaxed font-normal">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">100% Military-Grade Data Erasure Guarantee</h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Recell uses Department of Defense (DoD 5220.22-M) compliant sanitization protocols. Once a trade-in device is handed over, all accounts, photos, and messages are permanently destroyed before diagnostic testing or resale.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">1. Information We Collect</h3>
              <p>
                When you initiate a trade-in quote or place an order for certified pre-owned devices, we collect your name, contact mobile number, delivery/pickup address, pincode, and payment details (UPI ID or bank account details for instant payouts).
              </p>

              <h3 className="font-bold text-slate-900 text-sm">2. Use of Device Photographs</h3>
              <p>
                Photos uploaded during the 32-point inspection wizard are strictly used by our field agents and AI valuation algorithms to verify physical body scratches, screen cracks, or battery swelling. Photos are never shared publicly or sold to third parties.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">3. Zero Data Leakage Commitment</h3>
              <p>
                We maintain an absolute zero-leakage guarantee. Sellers are encouraged to sign out of iCloud / Google Accounts prior to agent arrival. In the event an account remains signed in, our field agent assists in remote factory resets.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">1. Trade-in Valuation Validity</h3>
              <p>
                The 60-second AI quote generated on Recell is an initial estimation based on the self-reported condition. Final payout pricing is confirmed at your doorstep after our field agent executes the live 32-point hardware diagnostic test.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">2. Proof of Ownership</h3>
              <p>
                Sellers must present a valid Government ID (Aadhaar, PAN, Driving License, or Voter ID) at the time of doorstep pickup. Devices flagged with reported stolen IMEIs, iCloud lockouts, or unpaid carrier blacklist status will be rejected immediately.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">3. Instant Doorstep Payout</h3>
              <p>
                Upon agreeing to the final verified quote, payout is initiated immediately via Razorpay / Bank Transfer or UPI to the account specified by the seller. Title and ownership transfer to Recell once payment is confirmed.
              </p>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">Recell 3-Month Comprehensive Hardware Warranty</h4>
                  <p className="text-[11px] text-indigo-800 mt-0.5">
                    All certified pre-owned devices include 90 days of hardware protection starting from the date of delivery.
                  </p>
                </div>
              </div>

              {/* High-visibility Warning Alert for Water & Physical Damage */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-900">
                <FileText className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h5 className="font-black text-rose-700 uppercase tracking-wider text-[11px]">Strict Exclusions &amp; Void Terms</h5>
                  <p className="font-semibold">
                    &bull; <strong className="text-rose-950">Water Damage:</strong> Liquid immersion, moisture contact, rainfall exposure, or internal moisture indicator trips are strictly NOT considered under warranty.
                  </p>
                  <p className="font-semibold">
                    &bull; <strong className="text-rose-950">Physical Damage:</strong> Accidental drops, cracked screens, bent chassis, broken glass back, or third-party disassembly completely void the warranty.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">What is Covered?</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Touchscreen responsiveness and display defects (not caused by accidental drops).</li>
                <li>Battery cell degradation below 80% within warranty period.</li>
                <li>Earpiece, loudspeaker, and internal microphone hardware failure.</li>
                <li>Charging port connectivity issues and motherboard boot loops.</li>
              </ul>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-900">
                <RotateCcw className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h5 className="font-black text-rose-700 uppercase tracking-wider text-[11px]">Return Exception Notice</h5>
                  <p className="font-bold">
                    Returns are strictly NOT applicable if the phone is physically damaged (cracked display, drop dents) or water damaged (liquid exposure) after delivery. Devices returned with physical or liquid damage will be rejected and shipped back to the buyer.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">1. 7-Day Hassle-Free Return Window</h3>
              <p>
                If you are not 100% satisfied with your certified refurbished device in its delivered pristine state, you may request a full return or replacement within 7 calendar days of delivery via our "Track / Warranty / Repairs" portal.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">2. Free Reverse Pickup</h3>
              <p>
                Once a valid return request is submitted, our courier partner (Delhivery / Shiprocket) schedules a free reverse pickup from your address within 24-48 hours.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">3. Refund Processing</h3>
              <p>
                Refunds are credited back to your original payment method (Razorpay UPI / Card) within 3-5 business days following physical inspection at our central hub.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-semibold">
          <span>Recell Registered Legal &amp; Compliance Dept</span>
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-full text-xs"
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
