import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "@/api/adminApi";
import { SkeletonBlock } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import StatusBadge from "@/components/StatusBadge";
import ProductImage from "@/components/ProductImage";
import {
  IcPackage,
  IcUsers,
  IcBag,
  IcWrench,
  IcHeadset,
  IcArrowRight,
  IcBarChart,
  IcWallet,
  IcAlertCircle,
  IcChevronRight,
} from "@/components/Icons";
import { money, prettyDate } from "@/lib/utils";

const STAT_CARDS = [
  { key: "revenue", label: "Total Revenue", icon: IcWallet, tone: "success", prefix: "₹" },
  { key: "orders", label: "Total Orders", icon: IcPackage, tone: "primary" },
  { key: "customers", label: "Total Customers", icon: IcUsers, tone: "violet" },
  { key: "products", label: "Total Products", icon: IcBag, tone: "info" },
  { key: "pendingServices", label: "Pending Services", icon: IcWrench, tone: "warning" },
  { key: "openTickets", label: "Open Support Tickets", icon: IcHeadset, tone: "danger" },
];

function formatRevenue(value, prefix) {
  if (prefix) {
    const v = Number(value);
    if (v >= 1e6) return `₹${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `₹${(v / 1e3).toFixed(1)}k`;
    return money(v);
  }
  return Number(value || 0).toLocaleString("en-IN");
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      setData(await getDashboard());
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) return <ErrorMessage error={error} onRetry={load} />;
  if (!data) return <SkeletonBlock lines={10} height={240} />;

  const maxSales = Math.max(...data.salesSeries.map((s) => s.sales), 1);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 22 }}>
        <div>
          <h1 className="admin-h1">Dashboard</h1>
          <p className="muted small" style={{ margin: 0 }}>
            Live overview of Jerry Computers · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16 }}>
        {STAT_CARDS.map((c) => (
          <div className="stat-big" key={c.key}>
            <div>
              <div className="l">{c.label}</div>
              <div className="v">{formatRevenue(data[c.key], c.prefix)}</div>
            </div>
            <span
              className="stat-card__ic"
              style={{
                background:
                  c.tone === "success" ? "var(--success-soft)" : c.tone === "violet" ? "#f1eafe" : c.tone === "warning" ? "var(--warning-soft)" : c.tone === "danger" ? "var(--danger-soft)" : "var(--primary-050)",
                color: c.tone === "success" ? "#15803d" : c.tone === "violet" ? "#7c3aed" : c.tone === "warning" ? "#b45309" : c.tone === "danger" ? "var(--danger)" : "var(--primary)",
              }}
            >
              <c.icon size={19} />
            </span>
          </div>
        ))}
      </div>

      {/* chart + order flow */}
      <div className="grid-2 mt-24" style={{ gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        <div className="card card--pad">
          <div className="flex-between" style={{ marginBottom: 8 }}>
            <h3 style={{ fontSize: 16, margin: 0 }} className="flex-align">
              <IcBarChart size={17} style={{ color: "var(--primary)" }} /> Sales overview (7 days)
            </h3>
            <span className="muted small">Last 7 days</span>
          </div>
          <div className="bar-chart">
            {data.salesSeries.map((s, i) => (
              <div className="bar-col" key={i} title={`${money(s.sales)} · ${s.orders} orders`}>
                <span className="tiny semibold" style={{ color: "var(--muted)" }}>
                  {s.sales >= 1000 ? `${(s.sales / 1000).toFixed(1)}k` : s.sales}
                </span>
                <div className="bar" style={{ height: `${Math.max(3, (s.sales / maxSales) * 100)}%` }} />
                <span className="m">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card card--pad">
          <h3 style={{ fontSize: 16, marginTop: 0 }}>Orders by status</h3>
          <div style={{ display: "grid", gap: 14 }}>
            {Object.entries(data.orderFlow).map(([status, count]) => (
              <div key={status}>
                <div className="flex-between small" style={{ marginBottom: 6 }}>
                  <StatusBadge status={status} dot={false} />
                  <b>{count}</b>
                </div>
                <div className="pct-bar">
                  <span
                    style={{
                      width: `${(count / Math.max(1, data.orders)) * 100}%`,
                      background: { Pending: "#f59e0b", Confirmed: "#0e7490", Processing: "#2563eb", Shipped: "#7c3aed", Delivered: "#16a34a", Cancelled: "#dc2626" }[status] || "#2563eb",
                    }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(data.orderFlow).length === 0 && <p className="muted small">No orders yet.</p>}
          </div>
        </div>
      </div>

      {/* recent orders + low stock */}
      <div className="grid-2 mt-20" style={{ gridTemplateColumns: "1.6fr 1fr", gap: 20, alignItems: "start" }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="flex-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: 16, margin: 0 }}>Recent orders</h3>
            <Link to="/admin/orders" className="small semibold">
              Manage <IcArrowRight size={12} />
            </Link>
          </div>
          <div>
            {data.recentOrders.map((o) => (
              <Link to="/admin/orders" key={o.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 20px", borderBottom: "1px solid var(--line)", textDecoration: "none", color: "inherit" }}>
                <div className="flex-align" style={{ gap: 8, width: 190, flex: "0 0 auto" }}>
                  {o.items?.slice(0, 3).map((it, i) => (
                    <ProductImage key={i} src={it.image} name={it.name} alt="" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover", border: "1px solid var(--line)" }} />
                  ))}
                </div>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <b className="small">{o.id}</b>
                  <span className="tiny muted" style={{ display: "block" }}>
                    {o.customerName} · {prettyDate(o.createdAt)}
                  </span>
                </span>
                <StatusBadge status={o.status} dot={false} />
                <b className="small nowrap">{money(o.total)}</b>
              </Link>
            ))}
            {data.recentOrders.length === 0 && <p className="muted small" style={{ padding: 20 }}>No orders yet.</p>}
          </div>
        </div>

        <div className="card" style={{ overflow: "hidden" }}>
          <div className="flex-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: 16, margin: 0 }} className="flex-align">
              <IcAlertCircle size={16} style={{ color: "#b45309" }} /> Low-stock products
            </h3>
            <Link to="/admin/products" className="small semibold">
              Manage
            </Link>
          </div>
          <div>
            {data.lowStock.length === 0 ? (
              <p className="muted small" style={{ padding: 20, margin: 0 }}>
                All products are well stocked ✓
              </p>
            ) : (
              data.lowStock.map((p) => (
                <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "11px 20px", borderBottom: "1px solid var(--line)" }}>
                  <ProductImage src={p.image} category={p.category} name={p.name} alt="" style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover" }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="small semibold" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </span>
                    <span className="tiny muted">{p.brand}</span>
                  </span>
                  <span className={`badge ${p.stock === 0 ? "badge--danger" : "badge--warning"}`}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* services & tickets */}
      <div className="grid-2 mt-20" style={{ gap: 20, alignItems: "start" }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="flex-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: 16, margin: 0 }}>Recent service requests</h3>
            <Link to="/admin/service-requests" className="small semibold">
              Manage <IcChevronRight size={12} />
            </Link>
          </div>
          <div>
            {data.recentServices.map((r) => (
              <Link to="/admin/service-requests" key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", borderBottom: "1px solid var(--line)", textDecoration: "none", color: "inherit" }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <b className="small">{r.id}</b>
                  <span className="tiny muted" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.categoryLabel} · {r.customerName}
                  </span>
                </span>
                <StatusBadge status={r.status} dot={false} />
              </Link>
            ))}
            {data.recentServices.length === 0 && <p className="muted small" style={{ padding: 20 }}>No service requests yet.</p>}
          </div>
        </div>
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="flex-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: 16, margin: 0 }}>Support tickets</h3>
            <Link to="/admin/support-tickets" className="small semibold">
              Manage <IcChevronRight size={12} />
            </Link>
          </div>
          <div>
            {data.recentTickets.map((t) => (
              <Link to="/admin/support-tickets" key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", borderBottom: "1px solid var(--line)", textDecoration: "none", color: "inherit" }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <b className="small">{t.id}</b>
                  <span className="tiny muted" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.subject}
                  </span>
                </span>
                <StatusBadge status={t.priority} dot={false} />
              </Link>
            ))}
            {data.recentTickets.length === 0 && <p className="muted small" style={{ padding: 20 }}>No tickets yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
