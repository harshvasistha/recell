import React, { useState } from 'react';
import { RecellLogo } from './RecellLogo';
import { X, CheckCircle2, ArrowRight, Smartphone, Mail, Lock, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { name: string; phone: string; role: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [fullName, setFullName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [pincode, setPincode] = useState('250101');
  const [userRole, setUserRole] = useState<'seller' | 'buyer' | 'technician'>('seller');
  const [step, setStep] = useState<'form' | 'otp' | 'done'>('form');
  const [otp, setOtp] = useState(['4', '8', '2', '1']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'form') {
      setStep('otp');
    } else if (step === 'otp') {
      setStep('done');
      setTimeout(() => {
        onSuccess({
          name: fullName || 'Valued Recell User',
          phone: phoneOrEmail || '+91 98765 43210',
          role: userRole
        });
        onClose();
        setStep('form');
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#0052FF] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="space-y-2">
            <RecellLogo variant="badge" />
            <h3 className="text-xl font-black mt-2">
              {mode === 'register' ? 'Create Your Free Recell Account' : 'Welcome Back to Recell'}
            </h3>
            <p className="text-xs text-blue-100 font-medium">
              {mode === 'register' 
                ? 'Get instant 60s trade-in cash, track certified orders & doorstep repair warranty claims.' 
                : 'Enter your phone number to access saved orders & doorstep quotes.'}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'done' ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900">Account Registered Successfully!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Welcome to Recell. You can now request instant doorstep cash pickups and claim 3-Month warranty coverage.
              </p>
            </div>
          ) : step === 'otp' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-[#0052FF]">Step 2 of 2: Mobile OTP Verification</span>
                <p className="text-xs text-slate-500">We sent a 4-digit verification code to <span className="font-bold text-slate-800">{phoneOrEmail || 'your mobile'}</span></p>
              </div>

              <div className="flex justify-center gap-3 py-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 text-center text-lg font-black bg-slate-50 border-2 border-slate-200 focus:border-[#0052FF] rounded-xl focus:outline-none"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                Verify &amp; Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] focus:bg-white outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number or Email</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] focus:bg-white outline-none"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Account Purpose</label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] outline-none font-medium"
                    >
                      <option value="seller">Sell Devices</option>
                      <option value="buyer">Buy Refurbished</option>
                      <option value="technician">Repair Service</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all mt-2"
              >
                {mode === 'register' ? 'Get Instant Verification OTP' : 'Sign In with OTP'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {mode === 'register' ? 'Already have an account?' : 'New to Recell?'}
                </span>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                  className="font-bold text-[#0052FF] hover:underline cursor-pointer"
                >
                  {mode === 'register' ? 'Sign In Here' : 'Create Free Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
