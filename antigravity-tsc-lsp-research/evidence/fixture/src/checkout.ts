import { Product, calculateTotal } from "./pricing";

export function processCheckout(): number {
  const cart: Product[] = [
    { id: "p1", name: "Notebook", price: 1200 },
    { id: "p2", name: "Pen", price: 300 }
  ];
  return calculateTotal(cart, 0.1);
}
