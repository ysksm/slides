export interface Product {
  id: string;
  name: string;
  price: number;
}

export function calculateTotal(items: Product[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}
