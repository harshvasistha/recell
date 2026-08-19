import React, { useState, useEffect } from 'react';
import { RecellLogo } from './RecellLogo';
import { X, CheckCircle2, ArrowRight, Smartphone, Mail, Lock, User, ShieldCheck, MapPin, LogOut, Package } from 'lucide-react';
import { ensureUserProfile, getUserProfile, UserProfile } from '../lib/dbService';
import { auth } from '../lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';

// Local-dev-only OTP shortcut so you can test the phone flow without live SMS
// billing enabled. import.meta.env.DEV is always false in a production build
// (Vite strips this branch entirely), so this never ships to recell.co.in.
const DEV_OTP_BYPASS = import.meta.env.DEV ? '520055' : null;

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
  
  const [otpInput, setOtpInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Cleanup recaptcha on open
      if (!(window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible'
          });
        } catch (e) {
          console.warn("Recaptcha init error", e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setPincode('');
    setOtpInput('');
    setStep('form');
    setErrorMsg('');
    setSuccessMsg('');
    setConfirmationResult(null);
    onClose();
  };

  const handleSendOtpStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (authMethod === 'phone') {
      const cleanPhone = phone.replace(/\D/g, '');
      if (!phone || cleanPhone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
    } else {
      if (!email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
    }

    if (!password || password.length < 4) {
      setErrorMsg('Please enter a password with at least 4 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (authMethod === 'phone') {
        // Phone always requires a real, freshly-verified Firebase SMS OTP -
        // for both signup AND signin. There is no password check for phone;
        // OTP possession of the device is the credential.
        const formattedPhone = phone.trim().startsWith('+') ? phone.trim() : `+91${phone.trim()}`;
        const appVerifier = (window as any).recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(confirmation);
        setSuccessMsg('OTP sent to your phone.');
        setIsSubmitting(false);
        setStep('otp');
        return;
      }

      // Email/password uses real Firebase Authentication - no OTP step needed,
      // the password itself is the verified credential.
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        try { await sendEmailVerification(cred.user); } catch { /* non-fatal */ }
        await finishLogin(email.trim(), { isNewSignup: true });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        await finishLogin(email.trim(), { isNewSignup: false });
      }
      setIsSubmitting(false);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(mapAuthError(err));
    }
  };

  // Shared completion step once a real credential (phone OTP or Firebase
  // email/password) has been verified. Role is ALWAYS read from the existing
  // Firestore profile (or defaulted to 'customer' on first creation) - it is
  // never computed from whatever the user typed into the form.
  const finishLogin = async (
    docKey: string,
    opts: { isNewSignup: boolean }
  ) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = authMethod === 'phone'
      ? (phone.trim().startsWith('+') ? phone.trim() : `+91 ${phone.trim()}`)
      : undefined;
    const userDisplayName = fullName.trim() || (authMethod === 'email' ? email.split('@')[0] : `User ${cleanPhone.slice(-4)}`);

    let profile: UserProfile | null;

    if (opts.isNewSignup) {
      profile = await ensureUserProfile(docKey, {
        uid: docKey,
        name: userDisplayName,
        phone: formattedPhone || '',
        email: authMethod === 'email' ? email.trim() : undefined,
        pincode: pincode.trim() || '250101'
      });
    } else {
      profile = await getUserProfile(docKey);
      if (!profile) {
        // Phone sign-in for a number with no existing account - treat as
        // first-time signup rather than a dead end.
        if (authMethod === 'phone') {
          profile = await ensureUserProfile(docKey, {
            uid: docKey,
            name: userDisplayName,
            phone: formattedPhone || '',
            pincode: pincode.trim() || '250101'
          });
        } else {
          throw new Error('No account found. Please create an account first.');
        }
      }
    }

    setIsSubmitting(false);
    onSuccess({
      name: profile.name,
      phone: profile.phone,
      role: profile.role,
      email: profile.email,
      pincode: profile.pincode
    });

    if (profile.role === 'admin') {
      document.dispatchEvent(new CustomEvent('NAVIGATE_ADMIN'));
    } else {
      document.dispatchEvent(new CustomEvent('NAVIGATE_HOME'));
    }

    handleClose();
  };

  const mapAuthError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') return 'An account with this email already exists. Try signing in instead.';
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') return 'Incorrect email or password.';
    if (code === 'auth/user-not-found') return 'No account found with this email. Please sign up.';
    if (code === 'auth/weak-password') return 'Password is too weak - use at least 6 characters.';
    if (code === 'auth/invalid-phone-number') return 'Please enter a valid mobile number.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please try again later.';
    return err?.message || 'Failed to authenticate. Please check your details and try again.';
  };

  const handleVerifyAndComplete = async () => {
    if (otpInput.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const isDevBypass = DEV_OTP_BYPASS !== null && otpInput === DEV_OTP_BYPASS;

      if (!isDevBypass) {
        if (!confirmationResult) {
          throw new Error('OTP session expired. Please request a new code.');
        }
        try {
          await confirmationResult.confirm(otpInput);
        } catch (e) {
          throw new Error('Invalid SMS OTP.');
        }
      }

      const cleanPhone = phone.trim().startsWith('+') ? phone.trim() : `+91 ${phone.trim()}`;
      await finishLogin(cleanPhone, { isNewSignup: mode === 'signup' });
    } catch (err: any) {
      console.error('Auth error:', err);
      setIsSubmitting(false);
      setErrorMsg(mapAuthError(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div id="recaptcha-container"></div>
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
                  {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                </h3>
                <p className="text-xs text-blue-100 font-medium">
                  {mode === 'signup'
                    ? 'Register to access instant quotes & orders.'
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
                    setStep('form');
                  }}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'phone'
                      ? 'bg-white text-[#0052FF] shadow-sm'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setErrorMsg('');
                    setStep('form');
                  }}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-white text-[#0052FF] shadow-sm'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {errorMsg}
                </div>
              )}
              {/* Success Message */}
              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {successMsg}
                </div>
              )}

              {step === 'otp' ? (
                /* OTP VERIFICATION VIEW */
                <div className="space-y-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <h4 className="font-heading font-black text-sm text-slate-900 pt-1">
                      Verify Your {authMethod === 'phone' ? 'Mobile' : 'Email'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Enter the 6-digit OTP code sent to your {authMethod === 'phone' ? 'phone' : 'email'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Enter 6-Digit OTP</label>
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
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyAndComplete}
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all font-heading"
                  >
                    {isSubmitting ? 'Verifying...' : 'Activate Account & Continue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                  >
                    &larr; Change {authMethod === 'phone' ? 'Mobile Number' : 'Email Address'}
                  </button>
                </div>
              ) : (
                /* INITIAL DETAILS FORM VIEW */
                <form onSubmit={handleSendOtpStep} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {authMethod === 'phone' ? (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          maxLength={13}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0052FF] outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={4}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0052FF] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all mt-2 disabled:opacity-50 font-heading"
                  >
                    {isSubmitting ? (
                      'Processing...'
                    ) : mode === 'signup' ? (
                      <>
                        <span>Get OTP &amp; Activate Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Toggle Mode */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{mode === 'signup' ? 'Already have an account?' : 'New to Recell?'}</span>
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
