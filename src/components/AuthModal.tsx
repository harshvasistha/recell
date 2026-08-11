import React, { useState } from 'react';
import { RecellLogo } from './RecellLogo';
import { X, CheckCircle2, ArrowRight, Smartphone, Mail, Lock, User, ShieldCheck, MapPin, LogOut, Package } from 'lucide-react';
import { saveUserProfile } from '../lib/dbService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { name: string; phone: string; role: string; email?: string; pincode?: string }) => void;
  user?: { name: string; phone: string; role: string; email?: string; pincode?: string } | null;
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
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [otpInput, setOtpInput] = useState('520055');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setPincode('');
    setOtpInput('520055');
    setStep('form');
    setErrorMsg('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSendOtpStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Field Validation
    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone || cleanPhone.length < 10) {
      setErrorMsg('Mandatory: Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Please enter a password with at least 4 characters.');
      return;
    }

    if (mode === 'signup' && step === 'form') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep('otp');
      }, 500);
      return;
    }

    // Direct Sign In or Verify OTP
    handleVerifyAndComplete();
  };

  const handleVerifyAndComplete = async () => {
    if (step === 'otp' && otpInput.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code sent to your mobile.');
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const userDisplayName = fullName.trim() || `User ${cleanPhone.slice(-4)}`;

      const userProfileData = {
        uid: `USR-${cleanPhone || Date.now()}`,
        name: userDisplayName,
        phone: phone.trim().startsWith('+91') ? phone.trim() : `+91 ${phone.trim()}`,
        email: email.trim() || `${cleanPhone || 'user'}@recell.in`,
        pincode: pincode.trim() || '250101',
        role: 'customer' as const,
        createdAt: new Date().toISOString()
      };

      // Save user profile to Firestore
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
    } catch (err) {
      console.error('Auth error:', err);
      setIsSubmitting(false);
      setErrorMsg('Failed to create account. Please check your connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* LOGGED IN USER VIEW */}
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
                  <strong className="font-mono text-slate-900">{user.email || 'Not provided'}</strong>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Hub Service Area:
                  </span>
                  <strong className="font-mono text-slate-900">{user.pincode || 'Khekra 250101'}</strong>
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
          /* AUTHENTICATION FORM VIEW */
          <>
            {/* Header Banner */}
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
                    ? 'Register with Mobile or Email & Password to access instant quotes & orders.'
                    : 'Sign in to access doorstep buyback quotes, order tracking & warranty claims.'}
                </p>
              </div>

              {/* Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 mt-4 bg-blue-900/40 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'phone'
                      ? 'bg-white text-[#0052FF] shadow-sm'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Mobile &amp; Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-white text-[#0052FF] shadow-sm'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email &amp; Password
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6">
              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <X className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {step === 'otp' ? (
                /* OTP STEP VIEW */
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                    <span className="bg-emerald-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      SMS SENT
                    </span>
                    <h4 className="font-heading font-black text-sm text-slate-900 pt-1">
                      Verify Your Mobile Number
                    </h4>
                    <p className="text-xs text-slate-600">
                      We dispatched a 6-digit verification code to <strong className="font-mono text-emerald-700">{phone}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Enter 6-Digit SMS OTP</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-emerald-300 rounded-xl text-center font-mono font-black text-lg tracking-widest text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 text-center font-medium">
                      Demo OTP code <span className="font-mono font-bold text-emerald-600">520055</span> auto-filled for fast testing.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyAndComplete}
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all font-heading"
                  >
                    {isSubmitting ? (
                      'Verifying OTP...'
                    ) : (
                      <>
                        <span>Verify OTP &amp; Redirect to Dashboard</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                  >
                    &larr; Change Mobile Number ({phone})
                  </button>
                </div>
              ) : (
                /* INITIAL DETAILS FORM VIEW */
                <form onSubmit={handleSendOtpStep} className="space-y-4">
                  {/* Full Name field (Sign Up only) */}
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
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] focus:bg-white outline-none text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mandatory Phone Field */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Mobile Number <span className="text-rose-500 font-black">* (Mandatory for OTP)</span>
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        maxLength={13}
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0052FF] focus:bg-white outline-none text-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={4}
                        placeholder="Enter account password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] focus:bg-white outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Optional Pincode Field on Sign Up */}
                  {mode === 'signup' && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Pincode (Optional)</label>
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
                    disabled={isSubmitting}
                    className="w-full bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all mt-2 disabled:opacity-50 font-heading"
                  >
                    {isSubmitting ? (
                      'Processing...'
                    ) : mode === 'signup' ? (
                      <>
                        <span>Send SMS OTP &amp; Register</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Toggle Mode */}
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
                  className="font-bold text-[#0052FF] hover:underline cursor-pointer font-heading"
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
