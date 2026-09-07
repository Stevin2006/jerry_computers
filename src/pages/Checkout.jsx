import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHead from "@/components/PageHead";
import EmptyState from "@/components/EmptyState";
import ProductImage from "@/components/ProductImage";
import { IcCheckCircle, IcLock, IcTruck, IcPackage, IcArrowRight } from "@/components/Icons";
import { createOrder } from "@/api/orderApi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { money, cx } from "@/lib/utils";

const PAYMENTS = ["UPI", "Card", "Net Banking", "Cash on Delivery"];
const ORDER_KEY = "jc_last_order";

function emptyAddress() {
  return { fullName: "", phone: "", line: "", city: "", state: "", pincode: "" };
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState(() => ({
    ...emptyAddress(),
    ...(user?.address || {}),
    fullName: user?.name || "",
    phone: user?.phone || "",
  }));
  const [payment, setPayment] = useState("UPI");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [lastOrder, setLastOrder] = useState(sessionStorage.getItem(ORDER_KEY) || null);

  const set = (k) => (e) => setAddress((a) => ({ ...a, [k]: e.target.value }));
  const required = ["fullName", "phone", "line", "city", "state", "pincode"];

  const validate = () => {
    const e = {};
    required.forEach((k) => {
      if (!String(address[k] || "").trim()) e[k] = "Required";
    });
    if (address.phone && !/^[+]?[\d\s-]{10,15}$/.test(address.phone)) e.phone = "Enter a valid phone number";
    if (address.pincode && !/^\d{6}$/.test(address.pincode)) e.pincode = "6-digit PIN code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) {
      toast.error("Please complete the delivery address.", "Missing details");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        address,
        paymentMethod: payment === "Cash on Delivery" ? "COD" : payment,
      };
      const data = await createOrder(payload);
      const order = data.order;
      sessionStorage.setItem(ORDER_KEY, order.id);
      setPlaced(order);
      clearCart();
      toast.success(`Order ${order.id} placed successfully.`, "Thank you!");
    } catch (err) {
      toast.error(err?.message || "Could not place your order.", "Order failed");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (placed) window.scrollTo(0, 0);
  }, [placed]);

  /* ---------------- success ---------------- */
  if (placed) {
    return (
      <div className="page--plain">
        <section className="section">
          <div className="container" style={{ maxWidth: 640 }}>
            <div className="card card--pad text-center" style={{ padding: 46 }}>
              <span className="empty__art" style={{ margin: "0 auto 18px", width: 90, height: 90 }}>
                <IcCheckCircle size={42} />
              </span>
              <h1 className="title-lg">ORDER CONFIRMED</h1>
              <p className="muted">Thank you! Your order has been placed successfully and is now being processed.</p>
              <div className="card" style={{ background: "var(--bg)", padding: 18, margin: "22px 0", display: "grid", gap: 4 }}>
                <div className="kv__row">
                  <dt>Order ID</dt>
                  <dd style={{ color: "var(--primary)" }}>{placed.id}</dd>
                </div>
                <div className="kv__row">
                  <dt>Amount paid</dt>
                  <dd>{money(placed.total)}</dd>
                </div>
                <div className="kv__row">
                  <dt>Payment</dt>
                  <dd>{placed.paymentStatus}</dd>
                </div>
                <div className="kv__row">
                  <dt>Delivery to</dt>
                  <dd>{placed.address.city}</dd>
                </div>
              </div>
              <div className="flex-center wrap">
                <Link to={`/orders/${placed.id}`} className="btn btn--primary">
                  <IcPackage size={16} /> Track Order
                </Link>
                <Link to="/products" className="btn btn--outline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page--plain">
        <section className="section">
          <div className="container" style={{ maxWidth: 620 }}>
            {lastOrder ? (
              <EmptyState
                icon={<IcPackage size={32} />}
                title="You already placed an order"
                text={`Order ${lastOrder} was placed successfully. Track its status from your orders page.`}
                action={
                  <div className="flex-center wrap">
                    <Link to={`/orders/${lastOrder}`} className="btn btn--primary">
                      Track Order
                    </Link>
                    <Link to="/products" className="btn btn--outline">
                      Keep Shopping
                    </Link>
                  </div>
                }
              />
            ) : (
              <EmptyState
                icon={<IcPackage size={32} />}
                title="Your cart is empty"
                text="Add some products to your cart before checking out."
                action={
                  <Link to="/products" className="btn btn--primary">
                    Browse Products
                  </Link>
                }
              />
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page--plain">
      <PageHead title="CHECKOUT" sub="Almost there — confirm delivery and payment." crumb="Home" crumbs={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <section className="section section--tight">
        <div className="container">
          <div className="checkout-grid">
            <div style={{ display: "grid", gap: 22 }}>
              {/* address */}
              <div className="card card--pad">
                <h3 style={{ fontSize: 17, marginTop: 0 }} className="flex-align">
                  <IcTruck size={19} style={{ color: "var(--primary)" }} /> Delivery Address
                </h3>
                <div className="field-row">
                  <div className="field">
                    <label className="label" htmlFor="co-full">
                      Full Name <span className="req">*</span>
                    </label>
                    <input id="co-full" className="input" value={address.fullName} onChange={set("fullName")} placeholder="Recipient name" />
                    {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="co-phone">
                      Phone <span className="req">*</span>
                    </label>
                    <input id="co-phone" className="input" value={address.phone} onChange={set("phone")} placeholder="Mobile number" />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor="co-line">
                    Address <span className="req">*</span>
                  </label>
                  <input id="co-line" className="input" value={address.line} onChange={set("line")} placeholder="House no, street, area" />
                  {errors.line && <span className="field-error">{errors.line}</span>}
                </div>
                <div className="field-row field-row--3">
                  <div className="field">
                    <label className="label" htmlFor="co-city">
                      City <span className="req">*</span>
                    </label>
                    <input id="co-city" className="input" value={address.city} onChange={set("city")} placeholder="City" />
                    {errors.city && <span className="field-error">{errors.city}</span>}
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="co-state">
                      State <span className="req">*</span>
                    </label>
                    <input id="co-state" className="input" value={address.state} onChange={set("state")} placeholder="State" />
                    {errors.state && <span className="field-error">{errors.state}</span>}
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="co-pin">
                      PIN Code <span className="req">*</span>
                    </label>
                    <input id="co-pin" className="input" value={address.pincode} onChange={set("pincode")} placeholder="600000" inputMode="numeric" />
                    {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                  </div>
                </div>
              </div>

              {/* payment */}
              <div className="card card--pad">
                <h3 style={{ fontSize: 17, marginTop: 0 }} className="flex-align">
                  <IcLock size={19} style={{ color: "var(--primary)" }} /> Payment Method
                </h3>
                <div className="chip-options">
                  {PAYMENTS.map((p) => (
                    <label className="chip-option" key={p}>
                      <input type="radio" name="payment" checked={payment === p} onChange={() => setPayment(p)} />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
                <p className="muted tiny mt-12" style={{ marginBottom: 0 }}>
                  Payments are processed securely by our payment partner. Demo mode never collects real card details.
                </p>
              </div>
            </div>

            {/* summary */}
            <aside className="card card--pad summary-card">
              <h3 style={{ fontSize: 17, marginTop: 0 }}>Review your order</h3>
              <div style={{ maxHeight: 260, overflowY: "auto", display: "grid", gap: 12 }}>
                {items.map((i) => (
                  <div className="flex-align" key={i.productId} style={{ gap: 12 }}>
                    <ProductImage src={i.image} category={i.category} name={i.name} alt={i.name} style={{ width: 48, height: 48, borderRadius: 10, border: "1px solid var(--line)", objectFit: "cover" }} />
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span className="cell-title" style={{ display: "block", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {i.name}
                      </span>
                      <span className="tiny muted">
                        Qty {i.qty} · {money(i.price)}
                      </span>
                    </span>
                    <b style={{ fontSize: 13 }}>{money(i.price * i.qty)}</b>
                  </div>
                ))}
              </div>
              <hr className="divider" />
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : money(shipping)}</span>
              </div>
              <div className="summary-row summary-row--total">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
              <button className="btn btn--primary btn--lg btn--block mt-16" onClick={placeOrder} disabled={busy}>
                {busy ? (
                  <>
                    <span className="spinner" /> Placing order…
                  </>
                ) : (
                  <>
                    PLACE ORDER · {money(total)} <IcArrowRight size={17} />
                  </>
                )}
              </button>
              <button className="btn btn--ghost btn--block mt-8" onClick={() => navigate("/cart")}>
                Back to cart
              </button>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
