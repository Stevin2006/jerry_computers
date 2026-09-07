/**
 * WishlistContext — persisted wishlist of product snapshots.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const KEY = "jc_wishlist";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* noop */
    }
  }, [items]);

  const snapshot = useCallback(
    (product) => ({
      productId: String(product.id),
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      rating: product.rating,
      stock: product.stock,
      image: product.images?.[0] || product.img || "",
    }),
    []
  );

  const toggle = useCallback(
    (product) => {
      const id = String(product.id);
      setItems((prev) =>
        prev.some((i) => i.productId === id)
          ? prev.filter((i) => i.productId !== id)
          : [snapshot(product), ...prev]
      );
    },
    [snapshot]
  );

  const has = useCallback((id) => items.some((i) => i.productId === String(id)), [items]);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.productId !== String(id)));
  }, []);

  const value = useMemo(
    () => ({ items, count: items.length, has, toggle, remove }),
    [items, has, toggle, remove]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
