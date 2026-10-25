import { test } from 'node:test';
import assert from 'node:assert/strict';
import { syncUrlWithRoute } from '../src/utils/routing';
function navigate(search: string, tab = 'landing') {
  let written='';
  (globalThis as any).window = {location:{pathname:'/',search,hash:''},history:{replaceState:(_:unknown,__:unknown,value:string)=>{written=value;},pushState:()=>{}}};
  syncUrlWithRoute(tab as any);
  delete (globalThis as any).window;
  return written;
}
test('SPA route sync preserves new and legacy PayU transaction refs',()=>{
  for (const ref of ['a'.repeat(24),'b'.repeat(32)]) {
    assert.equal(navigate(`?payu_txn=${ref}`),''); // already canonical: do not remove the reference
    assert.equal(navigate(`?payu_txn=${ref}`,'buy'),`/buy?payu_txn=${ref}`);
  }
});
test('invalid PayU reference is not carried to another route',()=>{
  assert.equal(navigate('?payu_txn=invalid','buy'),'/buy');
});
