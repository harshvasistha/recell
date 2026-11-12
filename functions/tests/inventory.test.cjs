const { test } = require('node:test');
const assert = require('node:assert/strict');
const { allocateStock, isConfirmedSale } = require('../lib/inventoryPolicy');
const { prepareInventoryAllocation } = require('../lib/inventory');
const item = { productId: 'phone' };
const stock = () => [{ id: 'phone', stockCount: 1, inStock: true }, { id: 'other', stockCount: 3, inStock: true }];
test('last unit becomes unavailable and unrelated stock stays unchanged', () => {
  const original = stock(), updated = allocateStock(original, [item]);
  assert.equal(updated[0].stockCount, 0); assert.equal(updated[0].inStock, false);
  assert.equal(updated[1].stockCount, 3); assert.equal(original[0].stockCount, 1);
});
test('insufficient, missing, duplicate or invalid items never produce negative inventory', () => {
  for (const items of [[item, item], [{ productId: 'missing' }], [], [null]]) assert.throws(() => allocateStock(stock(), items));
  assert.throws(() => allocateStock([{ id:'phone',stockCount:0,inStock:false }],[item]));
});
test('multi-unit listings decrement one unit without hiding remaining units', () => {
  assert.deepEqual(allocateStock([{id:'phone',stockCount:2,inStock:true}],[item]), [{id:'phone',stockCount:1,inStock:true}]);
});
test('unpaid, failed, cancelled and manual-reference orders do not allocate; paid and confirmed COD do', () => {
  for(const paymentMethod of ['PayU','UPI Canara Bank']) {
    assert.equal(isConfirmedSale({paymentMethod,paymentStatus:'Pending Token',orderStatus:'Awaiting Payment'}),false);
    assert.equal(isConfirmedSale({paymentMethod,paymentStatus:'Failed',orderStatus:'Confirmed'}),false);
    assert.equal(isConfirmedSale({paymentMethod,paymentStatus:'Paid',orderStatus:'Confirmed'}),true);
  }
  assert.equal(isConfirmedSale({paymentMethod:'Cash on Delivery',orderStatus:'Confirmed'}),true);
  assert.equal(isConfirmedSale({paymentMethod:'Cash on Delivery',orderStatus:'Cancelled'}),false);
});
function fixture(products) {
  const records = new Map([['system/catalog',{products}],['orders/order',{}]]);
  const db = { doc:path => ({path}), collection:name => ({doc:id => ({path:`${name}/${id}`})}) };
  const transaction = () => {
    let writing=false; const ops=[];
    return { get:async ref => { assert.equal(writing,false,'all reads must precede writes'); return {exists:records.has(ref.path),data:()=>records.get(ref.path)}; },
      update:(ref,data)=>{ writing=true;ops.push(()=>records.set(ref.path,{...records.get(ref.path),...data})); },
      create:(ref,data)=>{ writing=true;ops.push(()=>{assert.equal(records.has(ref.path),false);records.set(ref.path,data)}); },
      commit:()=>ops.forEach(op=>op()) };
  };
  return {records,db,transaction};
}
test('duplicate callback/trigger allocates once using private order ledger', async () => {
  const f=fixture(stock());
  for(let n=0;n<2;n++) { const t=f.transaction();const apply=await prepareInventoryAllocation(t,'order',{items:[item]},f.db);apply();t.commit(); }
  assert.equal(f.records.get('system/catalog').products[0].stockCount,0);
  assert.equal(f.records.get('orders/order').inventoryStatus,'Allocated');
});
test('second buyer gets explicit stock review without negative stock or lost payment evidence', async () => {
  const f=fixture(stock());
  for (const id of ['order','second']) {const t=f.transaction();const apply=await prepareInventoryAllocation(t,id,{items:[item]},f.db);apply();t.commit();}
  assert.equal(f.records.get('system/catalog').products[0].stockCount,0);
  assert.equal(f.records.get('orders/second').inventoryStatus,'Review Required');
});
