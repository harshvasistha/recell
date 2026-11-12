import type { CatalogProduct } from '../types';
// Apply only fields edited by this admin, keeping newer server-side stock and
// unrelated catalog edits. Explicit stock edits reject a changed baseline.
export function applyCatalogEdits(current: CatalogProduct[], before: CatalogProduct[], after: CatalogProduct[]): CatalogProduct[] {
  const previous = new Map(before.map(p => [p.id, p]));
  const desired = new Map(after.map(p => [p.id, p]));
  const result = current.filter(p => !previous.has(p.id) || desired.has(p.id)).map(product => {
    const old = previous.get(product.id), next = desired.get(product.id);
    if (!old || !next) return product;
    const merged = { ...product } as Record<string, unknown>;
    for (const field of Object.keys(next) as Array<keyof CatalogProduct>) {
      if (JSON.stringify(old[field]) === JSON.stringify(next[field])) continue;
      if ((field === 'stockCount' || field === 'inStock') && product[field] !== old[field]) {
        throw new Error('Stock changed since this edit. Refresh before changing stock.');
      }
      merged[field] = next[field];
    }
    return merged as unknown as CatalogProduct;
  });
  for (const product of after) {
    if (!previous.has(product.id)) {
      if (current.some(p => p.id === product.id)) throw new Error('Product already exists. Refresh before editing.');
      result.push(product);
    }
  }
  return result;
}
