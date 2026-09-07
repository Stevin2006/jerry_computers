import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductImage from "@/components/ProductImage";
import StatusBadge, { Stepper } from "@/components/StatusBadge";
import { SkeletonBlock } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import PageHead from "@/components/PageHead";
import { IcPackage, IcHeadset, IcMapPin, IcChevronRight } from "@/components/Icons";
import { getOrder } from "@/api/orderApi";
import { money, prettyDate } from "@/lib/utils";

const FALLBACK_STEPS = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      setOrder(await getOrder(id));
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <div className="page--plain">
        <div className="container" style={{ maxWidth: 860 }}>
          <EmptyState
            icon={<IcPackage size={32} />}
            title="Order not found"
            text="We couldn't find this order for your account."
            action={
              <Link to="/orders" className="btn btn--primary">
                Back to My Orders
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page--plain">
        <div className="container" style={{ maxWidth: 860, display: "grid", gap: 20 }}>
          <SkeletonBlock lines={6} height={180} />
          <SkeletonBlock lines={4} height={120} />
        </div>
      </div>
    );
  }

  const steps = order.timeline?.length
    ? order.timeline
    : FALLBACK_STEPS.map((label) => ({
        label,
        done: FALLBACK_STEPS.indexOf(label) <= FALLBACK_STEPS.indexOf(order.status) && order.status !== "Cancelled",
      }));

  return (
    <div className="page--plain">
      <PageHead
        eyebrow="Order tracking"
        title={`ORDER ${order.id}`}
        sub={`Placed ${prettyDate(order.createdAt)} · ${order.paymentMethod}`}
        crumb="Home"
        crumbs={[{ label: "My Orders", to: "/orders" }, { label: order.id }]}
      />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 980 }}>
          {/* status stepper */}
          <div className="card card--pad" style={{ marginBottom: 22 }}>
            <div className="flex-between" style={{ marginBottom: 26 }}>
              <h3 style={{ fontSize: 16, margin: 0 }}>Order status</h3>
              <div className="flex-align gap-8">
                <StatusBadge status={order.status} />
                <StatusBadge status={order.paymentStatus === "Paid" ? "Paid" : "Payment Pending"} tone={order.paymentStatus === "Paid" ? "success" : "warning"} dot={false} />
              </div>
            </div>
            {order.status === "Cancelled" ? (
              <div className="alert alert--error">
                <b>This order was cancelled.</b> If you were charged, a refund will be initiated to your original payment method.
              </div>
            ) : (
              <Stepper steps={steps} />
            )}
          </div>

          {/* items */}
          <div className="card" style={{ padding: "8px 26px", marginBottom: 22 }}>
            {order.items.map((it) => (
              <div className="order-item" key={it.productId}>
                <ProductImage src={it.image} name={it.name} alt={it.name} />
                <span style={{ minWidth: 0 }}>
                  <Link to={`/products/${it.productId}`} className="order-item__name" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {it.name}
                  </Link>
                  <span className="order-item__qty">
                    {money(it.price)} × {it.qty}
                  </span>
                </span>
                <span className="order-item__amt">{money(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="flex-between" style={{ padding: "14px 0" }}>
              <span className="muted">
                Shipping: {order.shipping === 0 ? "FREE" : money(order.shipping)}
              </span>
              <Link to="/products" className="btn btn--soft btn--sm">
                Buy again <IcChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid-2" style={{ gap: 22 }}>
            {/* totals */}
            <div className="card card--pad">
              <h3 style={{ fontSize: 16, marginTop: 0 }}>Payment summary</h3>
              <dl className="kv">
                <div className="kv__row">
                  <dt>Subtotal</dt>
                  <dd>{money(order.subtotal)}</dd>
                </div>
                <div className="kv__row">
                  <dt>Shipping</dt>
                  <dd>{order.shipping === 0 ? "FREE" : money(order.shipping)}</dd>
                </div>
                <div className="kv__row">
                  <dt>Method</dt>
                  <dd>{order.paymentMethod}</dd>
                </div>
                <div className="kv__row" style={{ borderTop: "1px solid var(--line)", marginTop: 8, paddingTop: 14 }}>
                  <dt style={{ fontWeight: 800, color: "var(--ink)" }}>Total</dt>
                  <dd style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>{money(order.total)}</dd>
                </div>
              </dl>
            </div>
            {/* delivery */}
            <div className="card card--pad">
              <h3 style={{ fontSize: 16, marginTop: 0 }} className="flex-align">
                <IcMapPin size={18} style={{ color: "var(--primary)" }} /> Delivery address
              </h3>
              <p style={{ lineHeight: 1.8, margin: "0 0 14px" }}>
                <b>{order.address?.fullName}</b>
                <br />
                {order.address?.phone}
                <br />
                {order.address?.line}, {order.address?.city} — {order.address?.pincode}
                <br />
                {order.address?.state}
              </p>
              <Link to={`/support?order=${order.id}`} className="btn btn--soft btn--sm">
                <IcHeadset size={15} /> Need help with this order?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
