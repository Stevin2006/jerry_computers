/**
 * CartContext — persisted shopping cart.
 * Cart is intentionally local-first so guests can shop; the backend
 * takes ownership once an order is placed at checkout.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const KEY = "jc_cart";

export const FREE_SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 199;

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* noop */
    }
  }, [items]);

  const addItem = useCallback((product, qty = 1, toast) => {
    const max = Math.min(qty, product.stock ?? 99);
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === String(product.id));
      if (existing) {
        const nextQty = Math.min(existing.qty + Math.max(1, max), product.stock ?? 99);
        toast?.success?.("Quantity updated in your cart.", `${product.name}`);
        return prev.map((i) => (i.productId === existing.productId ? { ...i, qty: nextQty } : i));
      }
      toast?.success?.("Added to your cart.", `${product.name}`);
      return [
        ...prev,
        {
          productId: String(product.id),
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          mrp: product.mrp,
          image: product.images?.[0] || product.img || "",
          stock: product.stock ?? 99,
          qty: 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== String(productId)));
  }, []);

  const setQty = useCallback((productId, qty) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === String(productId) ? { ...i, qty: Math.min(Math.max(1, Number(qty) || 1), i.stock || 99) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return { subtotal, shipping, total: subtotal + shipping, count: items.reduce((s, i) => s + i.qty, 0) };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      ...totals,
      addItem,
      removeItem,
      setQty,
      clearCart,
      inCart: (id) => items.some((i) => i.productId === String(id)),
    }),
    [items, totals, addItem, removeItem, setQty, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
