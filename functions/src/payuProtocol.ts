import { createHash, timingSafeEqual } from 'crypto';
export const sha512 = (value: string) => createHash('sha512').update(value).digest('hex');
export function requestHash(fields: Record<string, string>, salt: string): string {
  return sha512([fields.key, fields.txnid, fields.amount, fields.productinfo, fields.firstname, fields.email,
    fields.udf1 || '', fields.udf2 || '', fields.udf3 || '', fields.udf4 || '', fields.udf5 || '',
    '', '', '', '', '', salt].join('|'));
}
export function validResponse(fields: Record<string, string>, salt: string): boolean {
  const sequence = [salt, fields.status, '', '', '', '', '', fields.udf5 || '', fields.udf4 || '',
    fields.udf3 || '', fields.udf2 || '', fields.udf1 || '', fields.email, fields.firstname,
    fields.productinfo, fields.amount, fields.txnid, fields.key].join('|');
  const expected = sha512(fields.additionalCharges ? `${fields.additionalCharges}|${sequence}` : sequence);
  return /^[a-f0-9]{128}$/i.test(fields.hash || '') && timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(fields.hash, 'hex'));
}
export function capturedPayment(detail: Record<string, unknown>, txnid: string, amount: string): boolean {
  return detail.status === 'success' && detail.unmappedstatus === 'captured' &&
    detail.txnid === txnid && Number(detail.amt ?? detail.amount) === Number(amount) &&
    typeof detail.mihpayid !== 'undefined' && /^\d+$/.test(String(detail.mihpayid));
}
