import { Link, useNavigate } from "react-router-dom";
import PageHead from "@/components/PageHead";
import EmptyState from "@/components/EmptyState";
import ProductImage from "@/components/ProductImage";
import { IcCart, IcMinus, IcPlus, IcTrash, IcTruck, IcArrowRight, IcCheck } from "@/components/Icons";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { money } from "@/lib/utils";

export default function Cart() {
  const { items, subtotal, shipping, total, setQty, removeItem, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <div className="page--plain">
        <PageHead title="YOUR CART" sub="Review the technology you've picked." crumb="Home" crumbs={[{ label: "Cart" }]} />
        <section className="section">
          <div className="container" style={{ maxWidth: 680 }}>
            <EmptyState
              icon={<IcCart size={32} />}
              title="Your cart is empty"
              text="Looks like you haven't added any technology yet. Explore our products and build your perfect setup."
              action={
                <Link to="/products" className="btn btn--primary">
                  Start Shopping
                </Link>
              }
            />
          </div>
        </section>
      </div>
    );
  }

  const missing = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="page--plain">
      <PageHead title="YOUR CART" sub="Review the technology you've picked." crumb="Home" crumbs={[{ label: "Cart" }]} />
      <section className="section section--tight">
        <div className="container">
          <div className="cart-layout">
            <div>
              <div className="card" style={{ padding: "6px 26px" }}>
                {items.map((item) => (
                  <div className="cart-line" key={item.productId}>
                    <ProductImage src={item.image} category={item.category} name={item.name} alt={item.name} />
                    <div style={{ minWidth: 0 }}>
                      <Link to={`/products/${item.productId}`} className="cart-line__name" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </Link>
                      <div className="cart-line__meta">
                        {item.brand} · {money(item.mrp)} M.R.P
                      </div>
                      <div className="qty mt-12">
                        <button onClick={() => setQty(item.productId, item.qty - 1)} aria-label="Decrease quantity">
                          <IcMinus size={14} />
                        </button>
                        <input value={item.qty} readOnly aria-label="Quantity" />
                        <button onClick={() => setQty(item.productId, item.qty + 1)} disabled={item.qty >= item.stock} aria-label="Increase quantity">
                          <IcPlus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="cart-line__side">
                      <span className="price-tag">{money(item.price * item.qty)}</span>
                      <button
                        className="icon-btn"
                        style={{ width: 34, height: 34 }}
                        onClick={() => {
                          removeItem(item.productId);
                          toast.info("Removed from cart.", item.name);
                        }}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <IcTrash size={16} style={{ color: "var(--danger)" }} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex-between" style={{ padding: "16px 0" }}>
                  <button className="btn btn--ghost" onClick={clearCart}>
                    <IcTrash size={15} /> Clear cart
                  </button>
                  <Link to="/products" className="btn btn--soft">
                    Continue shopping <IcArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>

            {/* summary */}
            <aside className="card card--pad summary-card">
              <h3 style={{ fontSize: 17, marginTop: 0 }}>Order Summary</h3>
              {missing > 0 ? (
                <div className="free-ship free-ship--warn">
                  <IcTruck size={18} />
                  <span>
                    Add {money(missing)} more for <b>FREE delivery</b>
                  </span>
                </div>
              ) : (
                <div className="free-ship">
                  <IcCheck size={18} />
                  <span>
                    <b>Free delivery</b> unlocked!
                  </span>
                </div>
              )}
              <div className="summary-row">
                <span>Subtotal ({items.length} item{items.length > 1 ? "s" : ""})</span>
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
              {!isAuthenticated && (
                <p className="muted tiny" style={{ marginTop: 12 }}>
                  You'll be asked to log in before checkout.
                </p>
              )}
              <button className="btn btn--primary btn--lg btn--block mt-16" onClick={() => navigate("/checkout")}>
                PROCEED TO CHECKOUT <IcArrowRight size={17} />
              </button>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
