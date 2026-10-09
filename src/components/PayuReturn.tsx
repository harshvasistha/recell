import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { checkPayuPayment } from '../lib/payu';
export function PayuReturn() {
  const txnid = new URLSearchParams(window.location.search).get('payu_txn');
  const [message, setMessage] = useState('Checking your PayU payment…');
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  async function check() {
    if (!txnid || busy) return;
    if (!auth.currentUser) { setMessage('Sign in with the account used at checkout to check your payment.'); return; }
    setBusy(true);
    try {
      const result = await checkPayuPayment(txnid);
      if (result.status === 'paid') { setComplete(true); setMessage(`Payment verified. Order ${result.orderId} is confirmed. You can track it using your phone number.`); }
      else if (result.status === 'failed') setMessage('PayU reports this payment failed. If money was debited, contact support before placing another order.');
      else setMessage('Your payment is awaiting verification. Check again shortly. Do not pay again if money was debited.');
    } catch { setMessage('We could not verify your payment yet. Please check again or contact support.'); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    if (!txnid || !/^[a-f0-9]{32}$/.test(txnid)) return;
    return onAuthStateChanged(auth, () => { void check(); });
  }, [txnid]);
  if (!txnid || !/^[a-f0-9]{32}$/.test(txnid)) return null;
  return <aside role="status" className="fixed bottom-4 left-4 right-4 z-[100] rounded-xl border border-orange-300 bg-white p-4 text-stone-900 shadow-xl">
    <p>{message}</p>
    {!complete && <button disabled={busy} onClick={() => void check()} className="mt-2 rounded-lg bg-orange-700 px-4 py-2 text-white">{busy ? 'Checking…' : 'Check payment'}</button>}
    {complete && <button onClick={() => { const url = new URL(window.location.href); url.searchParams.delete('payu_txn'); window.location.replace(url.toString()); }} className="mt-2 rounded-lg bg-orange-700 px-4 py-2 text-white">Continue shopping</button>}
  </aside>;
}
