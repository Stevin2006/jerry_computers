import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import StatusBadge from "@/components/StatusBadge";
import RatingStars from "@/components/RatingStars";
import { SkeletonGrid } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import {
  IcHome,
  IcPackage,
  IcWrench,
  IcHeadset,
  IcHeart,
  IcSettings,
  IcClipboardCheck,
  IcArrowRight,
  IcSparkles,
  IcBag,
  IcCart,
  IcTicket,
  IcBox,
} from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getMyOrders } from "@/api/orderApi";
import { getMyServices } from "@/api/serviceApi";
import { getMyTickets } from "@/api/supportApi";
import { getProducts } from "@/api/productApi";
import { money, initials, prettyDate, cx } from "@/lib/utils";

const NAV = [
  { to: "/user", label: "Dashboard", icon: IcHome, end: true },
  { to: "/orders", label: "My Orders", icon: IcPackage },
  { to: "/my-services", label: "Service Requests", icon: IcWrench },
  { to: "/service-history", label: "Service History", icon: IcClipboardCheck },
  { to: "/support/tickets", label: "Support Tickets", icon: IcTicket },
  { to: "/wishlist", label: "Wishlist", icon: IcHeart },
  { to: "/profile", label: "Profile", icon: IcSettings },
];

export default function UserHome() {
  const { user } = useAuth();
  const { count: cartCount, subtotal } = useCart();
  const { count: wishCount } = useWishlist();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [recents, setRecents] = useState([]);

  const load = async () => {
    setError(null);
    try {
      const [orders, services, tickets, featured] = await Promise.all([
        getMyOrders(),
        getMyServices(),
        getMyTickets(),
        getProducts({ pageSize: 40, sort: "rating" }),
      ]);
      let recentIds = [];
      try {
        recentIds = JSON.parse(localStorage.getItem("jc_recent")) || [];
      } catch {
        /* noop */
      }
      const recent = recentIds
        .map((rid) => (featured.results || []).find((p) => String(p.id) === String(rid)))
        .filter(Boolean)
        .slice(0, 4);
      setRecents(recent);
      setData({
        orders,
        services,
        tickets,
        recommended: (featured.results || []).slice(0, 8),
        activeServices: services.filter((s) => !["Completed", "Cancelled"].includes(s.status)).length,
        openTickets: tickets.filter((t) => !["Resolved", "Closed"].includes(t.status)).length,
      });
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page--plain">
      <div className="container">
        <div className="dash-layout" style={{ marginTop: 30 }}>
          <aside className="dash-side">
            <div className="card card--pad-sm">
              <nav className="dash-nav" aria-label="Dashboard">
                {NAV.map((n) => (
                  <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? "dash-nav--active" : undefined)}>
                    <n.icon size={18} /> {n.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="card card--pad-sm mt-16" style={{ background: "linear-gradient(160deg,#0c1a40,#16316e)", border: 0, color: "#cddaf6" }}>
              <IcSparkles size={20} style={{ color: "#8fb4ff" }} />
              <p className="small" style={{ margin: "8px 0", fontWeight: 600, color: "#fff" }}>
                Complete your setup
              </p>
              <p className="tiny" style={{ color: "#9fb2da", margin: 0 }}>
                Add {money(Math.max(0, 50000 - subtotal))} more to your cart for free delivery.
              </p>
              <Link to="/products" className="btn btn--white btn--sm btn--block mt-12">
                Shop now
              </Link>
            </div>
          </aside>

          <div>
            {/* welcome */}
            <div className="welcome-banner">
              <span className="avatar">{initials(user?.name)}</span>
              <div style={{ position: "relative", zIndex: 1 }}>
                <h1>
                  Welcome back, {user?.name?.split(" ")[0]} <span style={{ fontSize: 22 }}>👋</span>
                </h1>
                <p>Here's what's happening with your orders and services.</p>
              </div>
            </div>

            {error ? (
              <div className="mt-24">
                <ErrorMessage error={error} onRetry={load} />
              </div>
            ) : (
              <>
                {/* mini stats */}
                <div className="dash-mini-stats mt-24">
                  <Link to="/orders" className="stat-card" style={{ textDecoration: "none" }}>
                    <div className="stat-card__head">
                      <span className="stat-card__ic" style={{ background: "var(--primary-050)", color: "var(--primary)" }}>
                        <IcPackage size={19} />
                      </span>
                      <StatusBadge status={(data?.orders || []).filter((o) => !["Delivered", "Cancelled"].includes(o.status)).length ? "Processing" : "Delivered"} tone={(data?.orders || []).filter((o) => !["Delivered", "Cancelled"].includes(o.status)).length ? "primary" : "success"} />
                    </div>
                    <div className="stat-card__value">{(data?.orders || []).length}</div>
                    <div className="stat-card__label">Total orders</div>
                  </Link>
                  <Link to="/my-services" className="stat-card" style={{ textDecoration: "none" }}>
                    <div className="stat-card__head">
                      <span className="stat-card__ic" style={{ background: "#f1eafe", color: "#7c3aed" }}>
                        <IcWrench size={19} />
                      </span>
                      <StatusBadge status={(data?.activeServices || 0) ? "In Progress" : "Completed"} tone={(data?.activeServices || 0) ? "primary" : "success"} />
                    </div>
                    <div className="stat-card__value">{data?.activeServices || 0}</div>
                    <div className="stat-card__label">Active services</div>
                  </Link>
                  <Link to="/support/tickets" className="stat-card" style={{ textDecoration: "none" }}>
                    <div className="stat-card__head">
                      <span className="stat-card__ic" style={{ background: "var(--warning-soft)", color: "#b45309" }}>
                        <IcHeadset size={19} />
                      </span>
                    </div>
                    <div className="stat-card__value">{data?.openTickets || 0}</div>
                    <div className="stat-card__label">Open tickets</div>
                  </Link>
                </div>

                {/* recommended */}
                <div className="flex-between mt-32">
                  <h2 className="title" style={{ margin: 0 }}>
                    Recommended for you
                  </h2>
                  <Link to="/products" className="btn btn--ghost btn--sm">
                    Browse all <IcArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid-products mt-16" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}>
                  {(data?.recommended || []).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* recent orders + services */}
                <div className="grid-2 mt-32" style={{ alignItems: "start" }}>
                  <div className="card" style={{ overflow: "hidden" }}>
                    <div className="flex-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
                      <h3 style={{ fontSize: 16, margin: 0 }} className="flex-align">
                        <IcBag size={17} style={{ color: "var(--primary)" }} /> Recent orders
                      </h3>
                      <Link to="/orders" className="small semibold">
                        View all
                      </Link>
                    </div>
                    {(data?.orders || []).length === 0 ? (
                      <div className="empty" style={{ padding: 24 }}>
                        <p className="muted small" style={{ margin: 0 }}>
                          No orders yet.
                        </p>
                        <Link to="/products" className="btn btn--soft btn--sm">
                          Start shopping
                        </Link>
                      </div>
                    ) : (
                      <div>
                        {data.orders.slice(0, 3).map((o) => (
                          <Link to={`/orders/${o.id}`} key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid var(--line)", textDecoration: "none", color: "inherit" }}>
                            <span className="cell-title" style={{ fontSize: 14, flex: 1, minWidth: 0 }}>
                              <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.id}</span>
                              <span className="tiny muted">{o.items.reduce((s, i) => s + i.qty, 0)} items · {money(o.total)}</span>
                            </span>
                            <StatusBadge status={o.status} dot={false} />
                            <IcArrowRight size={14} style={{ color: "var(--faint)" }} />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="card" style={{ overflow: "hidden" }}>
                    <div className="flex-between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
                      <h3 style={{ fontSize: 16, margin: 0 }} className="flex-align">
                        <IcWrench size={17} style={{ color: "#7c3aed" }} /> Service status
                      </h3>
                      <Link to="/my-services" className="small semibold">
                        View all
                      </Link>
                    </div>
                    {(data?.services || []).length === 0 ? (
                      <div className="empty" style={{ padding: 24 }}>
                        <p className="muted small" style={{ margin: 0 }}>
                          No service requests yet.
                        </p>
                        <Link to="/services/request" className="btn btn--soft btn--sm">
                          Request a service
                        </Link>
                      </div>
                    ) : (
                      <div>
                        {data.services.slice(0, 3).map((r) => (
                          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid var(--line)" }}>
                            <span className="avatar avatar--violet avatar--sm">{initials((r.categoryLabel || r.category)?.replace(/[^A-Za-z]/g, ""))}</span>
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span className="cell-title" style={{ fontSize: 13.5, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {r.id} · {r.deviceName || r.categoryLabel}
                              </span>
                              <span className="tiny muted">Requested {prettyDate(r.createdAt)}</span>
                            </span>
                            <StatusBadge status={r.status} dot={false} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* recently viewed + wishlist/cart strip */}
                <div className="grid-2 mt-32" style={{ alignItems: "start" }}>
                  <div>
                    <div className="flex-between">
                      <h2 className="title-sm" style={{ margin: 0 }}>
                        Recently viewed
                      </h2>
                      <span className="muted tiny">{(data?.recommended?.length || 0)} items in catalogue</span>
                    </div>
                    {recents.length === 0 ? (
                      <div className="empty empty--card mt-16" style={{ padding: 30 }}>
                        <IcBox size={28} style={{ color: "var(--faint)" }} />
                        <p className="muted small" style={{ margin: 0 }}>
                          Products you view will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-16" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>
                        {recents.map((p) => (
                          <ProductCard key={p.id} product={p} showAction={false} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="card card--pad" style={{ display: "grid", gap: 4 }}>
                      <div className="flex-between">
                        <span className="muted small">Cart</span>
                        <span className="price-tag">{money(subtotal)}</span>
                      </div>
                      <div className="flex-between">
                        <span className="muted small">Wishlist</span>
                        <b>{wishCount} items</b>
                      </div>
                      <hr className="divider" />
                      <Link to="/cart" className="btn btn--dark btn--sm">
                        <IcCart size={15} /> Go to cart ({cartCount})
                      </Link>
                      <Link to="/services/request" className="btn btn--outline btn--sm mt-8">
                        <IcWrench size={15} /> Book a service
                      </Link>
                    </div>
                    <div className="alert alert--info mt-16">
                      <IcSparkles size={17} />
                      <span>
                        <b>Deal watch:</b>{" "}
                        <Link to="/products?deals=1">Today's technology deals are live.</Link>
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
