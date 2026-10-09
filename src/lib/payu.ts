import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
export async function startPayuCheckout(data: Record<string, unknown>): Promise<void> {
  const result = await httpsCallable<Record<string, unknown>, { action: string; fields: Record<string, string> }>(functions, 'createPayuCheckout')(data);
  if (result.data.action !== 'https://secure.payu.in/_payment') throw new Error('Unexpected payment destination.');
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = result.data.action;
  for (const [name, value] of Object.entries(result.data.fields)) {
    const input = document.createElement('input'); input.type = 'hidden'; input.name = name; input.value = value; form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
export async function checkPayuPayment(txnid: string) {
  return (await httpsCallable<{ txnid: string }, { status: string; orderId: string }>(functions, 'verifyPayuPayment')({ txnid })).data;
}
