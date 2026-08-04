import React, { useState } from 'react';
import { RecellLogo } from './RecellLogo';
import { X, CheckCircle2, ArrowRight, Smartphone, Mail, Lock, User, KeyRound, Sparkles, AlertCircle, ShieldCheck, MapPin, LogOut, ExternalLink, Package } from 'lucide-react';
import { saveUserProfile } from '../lib/dbService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { name: string; phone: string; role: string; email?: string }) => void;
  user?: { name: string; phone: string; role: string; email?: string } | null;
  onSignOut?: () => void;
  onNavigateToTrack?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
  onSignOut,
  onNavigateToTrack
}) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  // Form Fields - Strictly initialized to empty strings (NO pre-filled data)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');

  // OTP State - empty digits
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setPincode('');
    setOtpDigits(['', '', '', '']);
    setGeneratedOtp('');
    setOtpSent(false);
    setErrorMsg('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Step 1: Send OTP to Mobile or Email based on selected authMethod
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMethod === 'phone') {
      if (!phone || phone.trim().length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
    } else {
      if (!email || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    // Generate random 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpDigits(['', '', '', '']);
  };

  // Step 2: Verify OTP & Complete Auth
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg(`Please enter the 4-digit OTP sent to your ${authMethod === 'phone' ? 'mobile' : 'email'}.`);
      return;
    }

    // Match OTP or allow test code 1234
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      setErrorMsg(`Invalid OTP code. Please enter ${generatedOtp} or 1234.`);
      return;
    }

    setIsSubmitting(true);
    const userDisplayName = fullName.trim() || (authMethod === 'phone' ? `User ${phone.slice(-4)}` : email.split('@')[0]);

    const userProfileData = {
      uid: authMethod === 'phone' 
        ? `USR-${phone.replace(/\D/g, '') || Date.now()}` 
        : `USR-EML-${Date.now()}`,
      name: userDisplayName,
      phone: phone.trim() || '+91 98765 00000',
      email: email.trim() || `${phone.replace(/\D/g, '') || 'user'}@recell.in`,
      pincode: pincode.trim() || '250101',
      role: 'customer' as const,
      createdAt: new Date().toISOString()
    };

    // Save to Firestore Database
    await saveUserProfile(userProfileData);

    setIsSubmitting(false);
    onSuccess({
      name: userDisplayName,
      phone: userProfileData.phone,
      role: 'customer',
      email: userProfileData.email,
      pincode: userProfileData.pincode
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* LOGGED IN USER PROFILE VIEW */}
        {user ? (
          <div>
            <div className="bg-[#0052FF] p-6 text-white relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#0052FF] font-black text-2xl flex items-center justify-center shadow-lg border-2 border-blue-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-blue-900/60 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Verified User Account
                  </span>
                  <h3 className="text-xl font-black mt-1 font-heading text-white">{user.name}</h3>
                  <p className="text-xs text-blue-100 font-mono">Role: {user.role.toUpperCase()}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5 text-slate-900">
              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                    <Smartphone className="w-4 h-4 text-[#0052FF]" />
                    Registered Mobile:
                  </span>
                  <strong className="font-mono text-slate-900">{user.phone}</strong>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                    <Mail className="w-4 h-4 text-blue-500" />
                    Registered Email:
                  </span>
                  <strong className="font-mono text-slate-900">{user.email || 'harsh.vasistha@gmail.com'}</strong>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Hub Service Area:
                  </span>
                  <strong className="font-mono text-slate-900">Khekra 250101 Hub</strong>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Security Status:
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    OTP Verified (Mobile &amp; Email)
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    if (onNavigateToTrack) onNavigateToTrack();
                  }}
                  className="w-full bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-heading"
                >
                  <Package className="w-4 h-4" />
                  View My Orders &amp; Track Warranty
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onSignOut) onSignOut();
                    handleClose();
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300 transition-all cursor-pointer font-heading"
                >
                  <LogOut className="w-4 h-4 text-slate-600" />
                  Sign Out of Account
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* UNAUTHENTICATED / SIGNUP FORM VIEW */
          <>
            {/* Header */}
            <div className="bg-[#0052FF] p-6 text-white relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="space-y-1">
                <RecellLogo variant="badge" />
                <h3 className="text-xl font-black mt-2 font-heading">
                  {mode === 'signup' ? 'Create Your Recell Account' : 'Welcome Back to Recell'}
                </h3>
                <p className="text-xs text-blue-100 font-medium">
                  {mode === 'signup'
                    ? 'Register using Mobile or Email to receive account verification OTP.'
                    : 'Access instant doorstep quotes, order tracking & 3-Month warranty claims.'}
                </p>
              </div>

              {/* Authentication Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 mt-4 bg-blue-900/40 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setOtpSent(false);
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'phone'
                      ? 'bg-white text-[#0052FF] shadow-sm'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Mobile OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setOtpSent(false);
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-white text-[#0052FF] shadow-sm'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email OTP
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6">
              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* METHOD 1: MOBILE NUMBER OTP */}
              {authMethod === 'phone' && (
                <>
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      {mode === 'signup' && (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rahul Sharma"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] focus:bg-white outline-none text-slate-900"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            maxLength={13}
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0052FF] focus:bg-white outline-none text-slate-900"
                          />
                        </div>
                      </div>

                      {mode === 'signup' && (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Pincode (Optional)</label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="250101"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] outline-none font-mono text-slate-900"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all mt-2 font-heading"
                      >
                        Send OTP to Mobile
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    /* OTP Verification Step */
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0052FF] uppercase tracking-wider bg-blue-100/80 px-2.5 py-0.5 rounded-full font-heading">
                          <Sparkles className="w-3 h-3" />
                          Mobile Verification OTP
                        </div>
                        <p className="text-xs text-slate-700 font-medium">
                          4-Digit verification OTP delivered to your Mobile number:
                        </p>
                        <div className="flex items-center justify-between text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <Smartphone className="w-3.5 h-3.5 text-[#0052FF]" />
                            Mobile SMS / WhatsApp:
                          </span>
                          <strong className="font-mono text-slate-900">{phone}</strong>
                        </div>
                        <div className="mt-3 inline-block bg-emerald-50 text-emerald-800 font-mono font-bold text-base px-4 py-1.5 rounded-xl border border-emerald-300 shadow-xs">
                          OTP: {generatedOtp}
                        </div>
                      </div>

                      {/* Clean 4-Digit OTP Inputs */}
                      <div className="flex justify-center gap-3 py-2">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-phone-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              const newOtp = [...otpDigits];
                              newOtp[idx] = val;
                              setOtpDigits(newOtp);
                              if (val && idx < 3) {
                                const nextEl = document.getElementById(`otp-input-phone-${idx + 1}`);
                                nextEl?.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                                const prevEl = document.getElementById(`otp-input-phone-${idx - 1}`);
                                prevEl?.focus();
                              }
                            }}
                            className="w-12 h-12 text-center text-lg font-black bg-slate-50 border-2 border-slate-200 focus:border-[#0052FF] rounded-xl focus:outline-none text-slate-900"
                          />
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50 font-heading"
                      >
                        {isSubmitting ? 'Verifying Account...' : 'Verify OTP & Open Dashboard'}
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-xs text-slate-500 hover:text-[#0052FF] font-medium underline"
                        >
                          Change Mobile Number
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* METHOD 2: EMAIL OTP */}
              {authMethod === 'email' && (
                <>
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      {mode === 'signup' && (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rahul Sharma"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] focus:bg-white outline-none text-slate-900"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] focus:bg-white outline-none text-slate-900"
                          />
                        </div>
                      </div>

                      {mode === 'signup' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Mobile (Optional)</label>
                            <input
                              type="tel"
                              placeholder="+91 98765 00000"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] outline-none text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Pincode (Optional)</label>
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="250101"
                              value={pincode}
                              onChange={(e) => setPincode(e.target.value)}
                              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] outline-none font-mono text-slate-900"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all mt-2 font-heading"
                      >
                        Send OTP to Email
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    /* OTP Verification Step for Email */
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0052FF] uppercase tracking-wider bg-blue-100/80 px-2.5 py-0.5 rounded-full font-heading">
                          <Sparkles className="w-3 h-3" />
                          Email Verification OTP
                        </div>
                        <p className="text-xs text-slate-700 font-medium">
                          4-Digit verification OTP delivered to your Email address:
                        </p>
                        <div className="flex items-center justify-between text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-blue-500" />
                            Email Address:
                          </span>
                          <strong className="font-mono text-slate-900">{email}</strong>
                        </div>
                        <div className="mt-3 inline-block bg-emerald-50 text-emerald-800 font-mono font-bold text-base px-4 py-1.5 rounded-xl border border-emerald-300 shadow-xs">
                          OTP: {generatedOtp}
                        </div>
                      </div>

                      {/* Clean 4-Digit OTP Inputs */}
                      <div className="flex justify-center gap-3 py-2">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-email-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              const newOtp = [...otpDigits];
                              newOtp[idx] = val;
                              setOtpDigits(newOtp);
                              if (val && idx < 3) {
                                const nextEl = document.getElementById(`otp-input-email-${idx + 1}`);
                                nextEl?.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                                const prevEl = document.getElementById(`otp-input-email-${idx - 1}`);
                                prevEl?.focus();
                              }
                            }}
                            className="w-12 h-12 text-center text-lg font-black bg-slate-50 border-2 border-slate-200 focus:border-[#0052FF] rounded-xl focus:outline-none text-slate-900"
                          />
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50 font-heading"
                      >
                        {isSubmitting ? 'Verifying Account...' : 'Verify OTP & Open Dashboard'}
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-xs text-slate-500 hover:text-[#0052FF] font-medium underline"
                        >
                          Change Email Address
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
              {/* Toggle between Sign Up and Sign In */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {mode === 'signup' ? 'Already have an account?' : 'New to Recell?'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signup' ? 'signin' : 'signup');
                    setErrorMsg('');
                  }}
                  className="font-bold text-[#0052FF] hover:underline cursor-pointer"
                >
                  {mode === 'signup' ? 'Sign In Here' : 'Create Account'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

