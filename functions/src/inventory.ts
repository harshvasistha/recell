import * as admin from 'firebase-admin';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { allocateStock, isConfirmedSale, StockProduct } from './inventoryPolicy';

// Must run before any transaction writes. The private ledger makes retries and
// concurrent payment callbacks/order triggers allocate an order exactly once.
export async function prepareInventoryAllocation(transaction: admin.firestore.Transaction, orderId: string, order: Record<string, any>, db = admin.firestore()) {
  const ledgerRef = db.collection('inventory_allocations').doc(orderId);
  if ((await transaction.get(ledgerRef)).exists) return () => {};
  const catalogRef = db.doc('system/catalog');
  const products = (await transaction.get(catalogRef)).data()?.products as StockProduct[] | undefined;
  let updated: StockProduct[] | undefined;
  try { updated = allocateStock(products || [], order.items); }
  catch { /* Record captured payment even if inventory needs a human review. */ }
  return () => {
    const status = updated ? 'Allocated' : 'Review Required';
    if (updated) transaction.update(catalogRef, { products: updated });
    transaction.create(ledgerRef, { orderId, status, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    transaction.update(db.collection('orders').doc(orderId), { inventoryStatus: status });
  };
}
export const syncSoldInventory = onDocumentWritten(
  { document: 'orders/{orderId}', region: 'asia-south1', retry: true },
  async event => {
    if (!event.data?.after.exists) return;
    const orderId = event.params.orderId;
    await admin.firestore().runTransaction(async transaction => {
      // Read current state, rather than a possibly stale trigger payload.
      const order = (await transaction.get(admin.firestore().collection('orders').doc(orderId))).data();
      if (!order || !isConfirmedSale(order)) return;
      const commit = await prepareInventoryAllocation(transaction, orderId, order);
      commit();
    });
  }
);
