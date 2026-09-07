import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHead from "@/components/PageHead";
import ProductImage from "@/components/ProductImage";
import StatusBadge from "@/components/StatusBadge";
import { SkeletonRows } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import { IcPackage, IcChevronRight, IcArrowRight } from "@/components/Icons";
import { getMyOrders } from "@/api/orderApi";
import { useAuth } from "@/context/AuthContext";
import { money, prettyDate } from "@/lib/utils";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const load = async () => {
    setError(null);
    try {
      setOrders(await getMyOrders());
    } catch (e) {
      setError(e);
      setOrders([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page--plain">
      <PageHead title="MY ORDERS" sub={`Order history for ${user?.name || "your account"}.`} crumb="Home" crumbs={[{ label: "My Orders" }]} />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 980 }}>
          {error ? (
            <ErrorMessage error={error} onRetry={load} />
          ) : orders === null ? (
            <SkeletonRows rows={3} />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={<IcPackage size={32} />}
              title="No orders yet"
              text="You haven't placed an order yet. Browse our catalogue and find your next piece of technology."
              action={
                <Link to="/products" className="btn btn--primary">
                  START SHOPPING
                </Link>
              }
            />
          ) : (
            <div style={{ display: "grid", gap: 18 }}>
              {orders.map((o) => (
                <article className="order-card card" key={o.id}>
                  <div className="order-card__head">
                    <span className="oid">{o.id}</span>
                    <span className="when">Placed {prettyDate(o.createdAt)}</span>
                    <StatusBadge status={o.status} />
                    <StatusBadge status={o.paymentStatus === "Paid" ? "Paid" : "Payment Pending"} tone={o.paymentStatus === "Paid" ? "success" : "warning"} dot={false} />
                    <Link to={`/orders/${o.id}`} className="btn btn--soft btn--sm" style={{ marginLeft: "auto" }}>
                      Details <IcChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="order-card__items">
                    {o.items.map((it) => (
                      <div className="order-item" key={it.productId}>
                        <ProductImage src={it.image} name={it.name} alt={it.name} />
                        <span style={{ minWidth: 0 }}>
                          <Link to={`/products/${it.productId}`} className="order-item__name" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {it.name}
                          </Link>
                          <span className="order-item__qty">Qty {it.qty}</span>
                        </span>
                        <span className="order-item__amt">{money(it.price * it.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-card__foot">
                    <span className="muted small">
                      {o.items.reduce((s, i) => s + i.qty, 0)} items · {o.paymentMethod}
                    </span>
                    <span className="total">{money(o.total)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
