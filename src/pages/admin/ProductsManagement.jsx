import { useCallback, useEffect, useMemo, useState } from "react";
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "@/api/adminApi";
import { getBrands } from "@/api/productApi";
import { categories } from "@/data/mockCategories";
import StatusBadge from "@/components/StatusBadge";
import Modal, { ConfirmDialog } from "@/components/Modal";
import ProductImage from "@/components/ProductImage";
import { SkeletonRows } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { IcPlus, IcEdit, IcTrash, IcSearch, IcMinus, IcBag } from "@/components/Icons";
import { money, cx } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const EMPTY = { name: "", brand: "", category: "computers", tagline: "", description: "", price: "", mrp: "", stock: "", image: "", images: [] };

const PRICE_OPTIONS = [
  { value: 0, label: "Any price" },
  { value: 10000, label: "Under ₹10,000" },
  { value: 25000, label: "Under ₹25,000" },
  { value: 50000, label: "Under ₹50,000" },
  { value: 100000, label: "Under ₹1,00,000" },
  { value: 200000, label: "Under ₹2,00,000" },
];

const STOCK_OPTIONS = [
  { value: "", label: "Any stock" },
  { value: "in", label: "In stock" },
  { value: "out", label: "Out of stock" },
];

export default function ProductsManagement() {
  const toast = useToast();
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [stockFilter, setStockFilter] = useState("");
  const [brands, setBrands] = useState([]);
  const [modal, setModal] = useState(null); // {mode:'add'|'edit', product}
  const [form, setForm] = useState(EMPTY);
  const [formErr, setFormErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stockUpdating, setStockUpdating] = useState({});

  /* Server-side search + filters — partial name match, combinable filters. */
  const load = useCallback(
    async () => {
      setError(null);
      try {
        setList(
          await adminGetProducts({
            search: q,
            category: cat,
            brand,
            maxPrice: maxPrice || "",
            stock: stockFilter,
          })
        );
      } catch (e) {
        setError(e);
        setList([]);
      }
      /* keep the brand filter options in sync with the catalogue */
      getBrands()
        .then((bs) => setBrands(bs || []))
        .catch(() => {});
    },
    [q, cat, brand, maxPrice, stockFilter]
  );

  /* Debounced auto-reload whenever search text or any filter changes. */
  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  const resetFilters = () => {
    setQ("");
    setCat("");
    setBrand("");
    setMaxPrice(0);
    setStockFilter("");
  };

  const filtered = useMemo(() => {
    if (!list) return [];
    return list;
  }, [list]);

  const openAdd = () => {
    setForm({ ...EMPTY, price: "", mrp: "" });
    setFormErr({});
    setModal({ mode: "add" });
  };
  const openEdit = (p) => {
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      tagline: p.tagline || "",
      description: p.description || "",
      price: String(p.price),
      mrp: String(p.mrp || p.price),
      stock: String(p.stock),
      image: "",
      images: p.images || [],
    });
    setFormErr({});
    setModal({ mode: "edit", product: p });
  };

  const save = async () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name required";
    if (!form.brand.trim()) errs.brand = "Brand required";
    if (!form.category) errs.category = "Category required";
    if (!(Number(form.price) > 0)) errs.price = "Enter a valid price";
    if (form.stock === "" || Number(form.stock) < 0) errs.stock = "Enter stock";
    setFormErr(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      tagline: form.tagline,
      description: form.description,
      price: Number(form.price),
      mrp: Number(form.mrp || form.price),
      stock: Number(form.stock),
      images: form.image ? [form.image, ...form.images] : form.images,
    };
    try {
      if (modal.mode === "add") {
        const res = await adminCreateProduct(payload);
        toast.success("Product added to the catalogue.", res.product?.id);
      } else {
        const res = await adminUpdateProduct(modal.product.id, payload);
        toast.success("Product updated successfully.", modal.product.id);
      }
      setModal(null);
      load();
    } catch (e) {
      toast.error(e?.message || "Could not save product.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteProduct(toDelete.id);
      toast.info("Product deleted from catalogue.", toDelete.name);
      setToDelete(null);
      load();
    } catch (e) {
      toast.error(e?.message || "Could not delete product.");
    } finally {
      setDeleting(false);
    }
  };

  const quickStock = async (p, delta) => {
    const next = Math.max(0, p.stock + delta);
    setStockUpdating((s) => ({ ...s, [p.id]: true }));
    try {
      await adminUpdateProduct(p.id, { stock: next });
      toast.success(`Stock set to ${next}.`, p.name);
      load();
    } catch (e) {
      toast.error(e?.message);
    } finally {
      setStockUpdating((s) => ({ ...s, [p.id]: false }));
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="admin-h1">Products</h1>
          <p className="muted small" style={{ margin: 0 }}>
            {list?.length || 0} products in catalogue
          </p>
        </div>
        <button className="btn btn--primary" onClick={openAdd}>
          <IcPlus size={16} /> Add Product
        </button>
      </div>

      <div className="flex-align wrap" style={{ gap: 10, marginBottom: 16 }}>
        <div className="input-icon" style={{ width: 260, maxWidth: "100%" }}>
          <IcSearch size={16} />
          <input className="input" placeholder="Search products by name…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
        </div>
        <select className="select" style={{ width: 170 }} value={cat} onChange={(e) => { setCat(e.target.value); }} aria-label="Filter category">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="select" style={{ width: 150 }} value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Filter brand">
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select className="select" style={{ width: 170 }} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} aria-label="Filter price">
          {PRICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select className="select" style={{ width: 150 }} value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} aria-label="Filter stock">
          {STOCK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {[q, cat, brand, maxPrice, stockFilter].some(Boolean) && (
          <button className="btn btn--ghost btn--sm" onClick={resetFilters}>
            Clear filters
          </button>
        )}
      </div>

      {error ? (
        <ErrorMessage error={error} onRetry={load} />
      ) : !list ? (
        <SkeletonRows rows={6} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="cell-main">
                      <ProductImage src={p.images?.[0] || p.img} category={p.category} name={p.name} alt="" className="cell-thumb" />
                      <span style={{ minWidth: 0 }}>
                        <span className="cell-title" style={{ display: "block", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.name}
                        </span>
                        <span className="cell-sub">
                          #{p.id} · {p.brand}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge--primary">{p.categoryName || p.category}</span>
                  </td>
                  <td>
                    <b>{money(p.price)}</b>
                    <span className="cell-sub" style={{ display: "block" }}>
                      MRP {money(p.mrp)}
                    </span>
                  </td>
                  <td>
                    <div className="flex-align" style={{ gap: 6 }}>
                      <button className="icon-mini" disabled={stockUpdating[p.id]} onClick={() => quickStock(p, -1)} aria-label={`Decrease stock of ${p.name}`}>
                        <IcMinus size={14} />
                      </button>
                      <b className="nowrap">{p.stock}</b>
                      <button className="icon-mini" disabled={stockUpdating[p.id]} onClick={() => quickStock(p, 1)} aria-label={`Increase stock of ${p.name}`}>
                        <IcPlus size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={p.stock === 0 ? "Out of stock" : p.stock <= 8 ? "Low stock" : "Active"} tone={p.stock === 0 ? "danger" : p.stock <= 8 ? "warning" : "success"} />
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                      <button className="icon-mini" onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`} title="Edit">
                        <IcEdit size={15} />
                      </button>
                      <button className="icon-mini icon-mini--danger" onClick={() => setToDelete(p)} aria-label={`Delete ${p.name}`} title="Delete">
                        <IcTrash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty">
                      <IcBag size={26} style={{ color: "var(--faint)" }} />
                      <p className="muted">No products match your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* add/edit modal */}
      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add Product" : `Edit · ${modal?.product?.id}`}
        labelledBy="product-modal-title"
        size="lg"
        footer={
          <>
            <button className="btn btn--outline" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={save} disabled={busy}>
              {busy ? <span className="spinner" /> : <IcBag size={15} />} {modal?.mode === "add" ? "Create Product" : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="field-row">
          <div className="field">
            <label className="label">
              Product Name <span className="req">*</span>
            </label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {formErr.name && <span className="field-error">{formErr.name}</span>}
          </div>
          <div className="field">
            <label className="label">
              Brand <span className="req">*</span>
            </label>
            <input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            {formErr.brand && <span className="field-error">{formErr.brand}</span>}
          </div>
        </div>
        <div className="field">
          <label className="label">
            Category <span className="req">*</span>
          </label>
          <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
          {formErr.category && <span className="field-error">{formErr.category}</span>}
        </div>
        <div className="field">
          <label className="label">Short tagline</label>
          <input className="input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="One-line pitch shown on cards" />
        </div>
        <div className="field">
          <label className="label">Description</label>
          <textarea className="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="field-row field-row--3">
          <div className="field">
            <label className="label">
              Selling Price (₹) <span className="req">*</span>
            </label>
            <input className="input" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            {formErr.price && <span className="field-error">{formErr.price}</span>}
          </div>
          <div className="field">
            <label className="label">MRP (₹)</label>
            <input className="input" type="number" min="0" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
          </div>
          <div className="field">
            <label className="label">
              Stock <span className="req">*</span>
            </label>
            <input className="input" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            {formErr.stock && <span className="field-error">{formErr.stock}</span>}
          </div>
        </div>
        <div className="field">
          <label className="label">Image URL (new)</label>
          <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://… (leave blank to keep current)" />
          {form.images.length > 0 && (
            <p className="hint">
              Current images ({form.images.length}): <span style={{ wordBreak: "break-all" }}>{form.images.join(" · ")}</span>
            </p>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete this product?"
        message={`“${toDelete?.name}” will be permanently removed from the catalogue. This action cannot be undone.`}
        confirmLabel="Delete Product"
        busy={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
