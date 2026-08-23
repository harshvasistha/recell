import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from './firebase';

// Email OTP would need a separate transactional email provider wired in
// (Firebase Auth has no built-in "send a 6-digit code by email" primitive -
// only phone numbers get that via SMS). Per the site owner's decision,
// email signup/login instead uses Firebase's real passwordless "email link"
// sign-in: we send a one-time sign-in link to the address, and clicking it
// (from any device) completes login - no password, no code to mistype.
//
// IMPORTANT (manual setup step, cannot be done from code): in the Firebase
// Console, under Authentication > Sign-in method > Email/Password, the
// "Email link (passwordless sign-in)" toggle must be turned ON, or
// sendSignInLinkToEmail below will fail.

const PENDING_KEY = 'recellPendingEmailAuth';

export interface PendingEmailAuth {
  email: string;
  fullName?: string;
  pincode?: string;
  isNewSignup: boolean;
}

export async function sendEmailSignInLink(pending: PendingEmailAuth): Promise<void> {
  const actionCodeSettings = {
    // Land back on the EXACT page the user was on when they opened the
    // sign-in modal (e.g. a product page, /buy, /track) instead of always
    // forcing them back to the home page. App.tsx's root-level effect
    // detects the sign-in link on that page, completes it, and strips only
    // Firebase's own query params from the URL - the path itself is left
    // alone, so parseRouteFromLocation() resolves back to the right tab on
    // this fresh page load with no extra state-plumbing needed.
    url: `${window.location.origin}${window.location.pathname}${window.location.search}`,
    handleCodeInApp: true
  };
  await sendSignInLinkToEmail(auth, pending.email, actionCodeSettings);
  // Firebase's own signInWithEmailLink call needs the email address again
  // to complete - if the link is opened in the same browser this lets us
  // skip re-asking for it. If it's opened elsewhere (different device/
  // browser), completeEmailSignIn's caller falls back to asking for it.
  localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}

export function getPendingEmailAuth(): PendingEmailAuth | null {
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingEmailAuth;
  } catch {
    return null;
  }
}

export function clearPendingEmailAuth(): void {
  localStorage.removeItem(PENDING_KEY);
}

export function isEmailSignInLink(url: string): boolean {
  return isSignInWithEmailLink(auth, url);
}

export async function completeEmailSignIn(email: string, url: string) {
  return signInWithEmailLink(auth, email, url);
}
