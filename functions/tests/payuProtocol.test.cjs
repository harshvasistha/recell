const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { requestHash, validResponse, capturedPayment } = require('../lib/payuProtocol');
const digest = s => createHash('sha512').update(s).digest('hex');
const fields = { key: 'merchant', txnid: 'transaction', amount: '499.00', productinfo: 'Phone', firstname: 'Harsh', email: 'buyer@example.com', udf1: 'ORD-1' };
test('request uses the documented empty UDF slots and salt sequence', () => {
  assert.equal(requestHash(fields, 'secret'), digest('merchant|transaction|499.00|Phone|Harsh|buyer@example.com|ORD-1||||||||||secret'));
});
test('callback hash detects tampered amount and malformed signatures', () => {
  const callback = { ...fields, status: 'success' };
  callback.hash = digest('secret|success||||||||||ORD-1|buyer@example.com|Harsh|Phone|499.00|transaction|merchant');
  assert.equal(validResponse(callback, 'secret'), true);
  assert.equal(validResponse({ ...callback, amount: '1.00' }, 'secret'), false);
  assert.equal(validResponse({ ...callback, hash: 'bad' }, 'secret'), false);
});
test('additionalCharges prefix is authenticated', () => {
  const callback = { ...fields, status: 'success', additionalCharges: '10.00' };
  callback.hash = digest('10.00|secret|success||||||||||ORD-1|buyer@example.com|Harsh|Phone|499.00|transaction|merchant');
  assert.equal(validResponse(callback, 'secret'), true);
  assert.equal(validResponse({ ...callback, additionalCharges: '1.00' }, 'secret'), false);
});
test('only captured, matching transactions can mark an order paid', () => {
  const detail = { status: 'success', unmappedstatus: 'captured', txnid: 'transaction', amt: '499.00', mihpayid: '12345' };
  assert.equal(capturedPayment(detail, 'transaction', '499.00'), true);
  for (const override of [{ amt: '1.00' }, { status: 'failure' }, { unmappedstatus: 'auth' }, { txnid: 'other' }, { mihpayid: '' }]) {
    assert.equal(capturedPayment({ ...detail, ...override }, 'transaction', '499.00'), false);
  }
});
