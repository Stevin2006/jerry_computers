import { useEffect, useMemo, useState } from "react";
import { adminGetOrders, adminUpdateOrder } from "@/api/adminApi";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import ProductImage from "@/components/ProductImage";
import { SkeletonRows } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { IcSearch, IcPackage, IcEye } from "@/components/Icons";
import { money, prettyDate } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENTS = ["Paid", "Pending", "Failed", "Refunded"];

export default function OrdersManagement() {
  const toast = useToast();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [view, setView] = useState(null);

  const load = async () => {
    setError(null);
    try {
      setOrders(await adminGetOrders());
    } catch (e) {
      setError(e);
      setOrders([]);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    const ql = q.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (!statusFilter || o.status === statusFilter) &&
        (!ql || o.id.toLowerCase().includes(ql) || (o.customerName || "").toLowerCase().includes(ql) || String(o.address?.phone || "").includes(ql))
    );
  }, [orders, q, statusFilter]);

  const changeStatus = async (o, status) => {
    try {
      const res = await adminUpdateOrder(o.id, { status });
      toast.success(`Order ${o.id} marked as ${status}.`);
      load();
    } catch (e) {
      toast.error(e?.message || "Could not update order.");
    }
  };

  const changePayment = async (o, paymentStatus) => {
    try {
      await adminUpdateOrder(o.id, { paymentStatus });
      toast.success(`Payment status set to ${paymentStatus}.`);
      load();
    } catch (e) {
      toast.error(e?.message || "Could not update order.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="admin-h1">Orders</h1>
        <p className="muted small" style={{ margin: 0 }}>
          {orders?.length || 0} orders · update fulfilment status here
        </p>
      </div>

      <div className="flex-align wrap" style={{ gap: 10, marginBottom: 16 }}>
        <div className="input-icon" style={{ width: 300, maxWidth: "100%" }}>
          <IcSearch size={16} />
          <input className="input" placeholder="Search order ID, customer, phone…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search orders" />
        </div>
        <select className="select" style={{ width: 180 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {error ? (
        <ErrorMessage error={error} onRetry={load} />
      ) : !orders ? (
        <SkeletonRows rows={6} />
      ) : (
        <div className="table-wrap">
          <table className="table table--hover">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>
                    <b className="cell-title">{o.id}</b>
                    <span className="cell-sub" style={{ display: "block" }}>
                      {prettyDate(o.createdAt)}
                    </span>
                  </td>
                  <td>
                    <b className="cell-title" style={{ fontSize: 13.5 }}>
                      {o.customerName}
                    </b>
                    <span className="cell-sub" style={{ display: "block" }}>
                      {o.address?.phone || ""}
                    </span>
                  </td>
                  <td className="small">{o.items.reduce((s, i) => s + i.qty, 0)} items</td>
                  <td>
                    <b>{money(o.total)}</b>
                    <span className="cell-sub" style={{ display: "block" }}>
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <select className="select" style={{ width: 110, padding: "6px 26px 6px 10px", fontSize: 12.5 }} value={o.paymentStatus} onChange={(e) => changePayment(o, e.target.value)} aria-label={`Payment for ${o.id}`}>
                      {PAYMENTS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select className="select" style={{ width: 130, padding: "6px 26px 6px 10px", fontSize: 12.5 }} value={o.status} onChange={(e) => changeStatus(o, e.target.value)} aria-label={`Status for ${o.id}`}>
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="icon-mini" onClick={() => setView(o)} aria-label={`View ${o.id}`}>
                      <IcEye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty">
                      <IcPackage size={26} style={{ color: "var(--faint)" }} />
                      <p className="muted">No orders found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(view)} onClose={() => setView(null)} title={view ? `Order ${view.id}` : ""} labelledBy="order-view-title" size="lg">
        {view && (
          <div style={{ display: "grid", gap: 18 }}>
            <div className="flex-align wrap" style={{ gap: 8 }}>
              <StatusBadge status={view.status} />
              <StatusBadge status={view.paymentStatus === "Paid" ? "Paid" : "Payment Pending"} tone={view.paymentStatus === "Paid" ? "success" : "warning"} />
              <span className="muted small">
                {prettyDate(view.createdAt)} · {view.paymentMethod}
              </span>
            </div>
            <div>
              <h4 style={{ fontSize: 14, margin: "0 0 8px" }}>Items</h4>
              {view.items.map((it) => (
                <div className="flex-align" style={{ gap: 10, padding: "6px 0" }} key={it.productId}>
                  <ProductImage src={it.image} name={it.name} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="small semibold" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {it.name}
                    </span>
                    <span className="tiny muted">
                      {money(it.price)} × {it.qty}
                    </span>
                  </span>
                  <b className="small">{money(it.price * it.qty)}</b>
                </div>
              ))}
            </div>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="card card--pad-sm">
                <h4 style={{ fontSize: 13, marginTop: 0 }}>Billing</h4>
                <dl className="kv">
                  <div className="kv__row" style={{ fontSize: 13, padding: "4px 0" }}>
                    <dt>Subtotal</dt>
                    <dd>{money(view.subtotal)}</dd>
                  </div>
                  <div className="kv__row" style={{ fontSize: 13, padding: "4px 0" }}>
                    <dt>Shipping</dt>
                    <dd>{view.shipping === 0 ? "FREE" : money(view.shipping)}</dd>
                  </div>
                  <div className="kv__row" style={{ fontSize: 15, padding: "8px 0 0" }}>
                    <dt>Total</dt>
                    <dd>{money(view.total)}</dd>
                  </div>
                </dl>
              </div>
              <div className="card card--pad-sm">
                <h4 style={{ fontSize: 13, marginTop: 0 }}>Deliver to</h4>
                <p className="small" style={{ lineHeight: 1.7, margin: 0 }}>
                  <b>{view.address?.fullName}</b> · {view.address?.phone}
                  <br />
                  {view.address?.line}, {view.address?.city}
                  <br />
                  {view.address?.state} — {view.address?.pincode}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
