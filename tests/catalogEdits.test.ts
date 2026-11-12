import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyCatalogEdits } from '../src/utils/catalogEdits';
import type { CatalogProduct } from '../src/types';
const make = (extra = {}) => ({id:'phone',title:'Phone',stockCount:1,inStock:true,...extra} as CatalogProduct);
test('editing a title from an older session cannot resurrect a sold device',()=>{
  const result=applyCatalogEdits([make({stockCount:0,inStock:false})],[make()],[make({title:'New title'})]);
  assert.equal(result[0].title,'New title');assert.equal(result[0].stockCount,0);assert.equal(result[0].inStock,false);
});
test('stale explicit stock edit rejects instead of overwriting sale',()=>{
  assert.throws(()=>applyCatalogEdits([make({stockCount:0,inStock:false})],[make()],[make({stockCount:2})]),/Stock changed/);
});
test('admin product additions and removals preserve other concurrent additions',()=>{
  const other=make({id:'other'}),added=make({id:'new'});
  assert.deepEqual(applyCatalogEdits([make(),other],[make()],[added]),[other,added]);
});
