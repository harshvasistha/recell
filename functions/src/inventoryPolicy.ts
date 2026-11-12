export interface StockProduct { id: string; stockCount: number; inStock: boolean; [key: string]: unknown }
export function isConfirmedSale(order: Record<string, any>): boolean {
  // COD is allocated when the order is accepted; online/manual UPI require verified payment.
  return order.paymentStatus === 'Paid' || (order.paymentMethod === 'Cash on Delivery' &&
    ['Confirmed', 'Packed', 'In Transit', 'Out for Delivery', 'Delivered'].includes(order.orderStatus));
}
export function allocateStock(products: StockProduct[], items: Array<{ productId: string }>): StockProduct[] {
  if (!Array.isArray(items) || !items.length) throw new Error('Order has no products.');
  const quantities = new Map<string, number>();
  for (const item of items) {
    if (!item || typeof item.productId !== 'string') throw new Error('Invalid product reference.');
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + 1);
  }
  for (const [id, quantity] of quantities) {
    const product = products.find(p => p.id === id);
    if (!product || !product.inStock || !Number.isInteger(product.stockCount) || product.stockCount < quantity) {
      throw new Error(`Insufficient stock: ${id}`);
    }
  }
  return products.map(product => {
    const quantity = quantities.get(product.id);
    if (!quantity) return product;
    const stockCount = product.stockCount - quantity;
    return { ...product, stockCount, inStock: stockCount > 0 };
  });
}
