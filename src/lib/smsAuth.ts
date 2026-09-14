import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Thin wrappers around the sendOtpCode / verifyOtpCode Cloud Functions,
// which replace Firebase's native signInWithPhoneNumber() (blocked for
// India by Firebase's own SMS region policy) with a custom OTP flow sent
// through the HMI Media SMS gateway. The actual SMS gateway credentials
// never reach the browser - only these two callable-function requests do.

// Requests a fresh 6-digit OTP be sent to `phone` (any format containing a
// 10-digit Indian mobile number - the function strips everything else).
// Throws (via the Cloud Function's HttpsError) if a resend is requested too
// soon after the last one.
export async function sendOtpCode(phone: string): Promise<void> {
  const fn = httpsCallable<{ phone: string }, { sent: boolean }>(functions, 'sendOtpCode');
  await fn({ phone });
}

// Verifies `code` against the OTP most recently sent to `phone`. On success
// returns a Firebase Auth custom token - the caller must still call
// signInWithCustomToken(auth, token) to actually establish a signed-in
// session. Throws (via the Cloud Function's HttpsError) on a wrong/expired
// code or too many incorrect attempts.
export async function verifyOtpCode(phone: string, code: string): Promise<string> {
  const fn = httpsCallable<{ phone: string; code: string }, { customToken: string }>(
    functions,
    'verifyOtpCode'
  );
  const res = await fn({ phone, code });
  return res.data.customToken;
}
