import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHead from "@/components/PageHead";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import RatingStars from "@/components/RatingStars";
import StatusBadge from "@/components/StatusBadge";
import { SkeletonBlock } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import {
  IcHeart,
  IcCart,
  IcZap,
  IcWrench,
  IcHeadset,
  IcTruck,
  IcShield,
  IcRefresh,
  IcCheck,
  IcMinus,
  IcPlus,
  IcChevronRight,
  IcPackage,
  IcMapPin,
} from "@/components/Icons";
import { getProduct, getProducts } from "@/api/productApi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { money, cx } from "@/lib/utils";

const RECENT_KEY = "jc_recent";

function rememberRecent(id) {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    const next = [String(id), ...list.filter((x) => x !== String(id))].slice(0, 12);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* noop */
  }
}

const PRODUCT_SERVICE = {
  computers: { key: "computer", label: "Computer Service", verb: "installation or upgrade" },
  laptops: { key: "laptop", label: "Laptop Service", verb: "setup or maintenance" },
  printers: { key: "printer", label: "Printer Service", verb: "setup or troubleshooting" },
  cctv: { key: "cctv", label: "CCTV & Security", verb: "installation or configuration" },
  gaming: { key: "gaming", label: "Gaming Service", verb: "setup or optimisation" },
  accessories: { key: "accessories", label: "Peripheral Service", verb: "setup" },
};

const SAMPLE_REVIEWS = [
  {
    name: "Karthik R.",
    date: "Verified Purchase",
    rating: 5,
    text: "Excellent product and even better service. Jerry's team delivered, set everything up and explained the warranty. Highly recommended.",
  },
  {
    name: "Priya S.",
    date: "Verified Purchase",
    rating: 4,
    text: "Genuine piece with proper invoice. Works exactly as described. Delivery took a day longer than promised but they kept me updated throughout.",
  },
  {
    name: "Manoj V.",
    date: "Verified Purchase",
    rating: 4,
    text: "Good value for money. The in-store technician helped me choose the right variant and even migrated my data for free.",
  },
];

export default function ProductDetails({ id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("overview");
  const [recommended, setRecommended] = useState(null);
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    setRecommended(null);
    try {
      const data = await getProduct(id);
      setProduct(data);
      rememberRecent(id);
      window.document.title = `${data.name} — Jerry Computers`;
      try {
        const rel = await getProducts({ category: data.category, sort: "rating", pageSize: 8 });
        setRecommended((rel.results || []).filter((p) => String(p.id) !== String(id)).slice(0, 4));
      } catch {
        setRecommended([]);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="page--plain">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <SkeletonBlock lines={2} height={430} />
          <SkeletonBlock lines={8} height={240} />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page--plain">
        <div className="container">
          <EmptyState
            icon={<IcPackage size={34} />}
            title="Product not found"
            text="This product may have been removed or the link is incorrect."
            action={
              <Link to="/products" className="btn btn--primary">
                Browse products
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const images = (product.images && product.images.length ? product.images : [product.img || ""]).filter(Boolean);
  const inWish = has(product.id);
  const stock = product.stock ?? 0;
  const svc = PRODUCT_SERVICE[product.category] || PRODUCT_SERVICE.computers;
  const requestPath = `/services/request?category=${svc.key}&product=${encodeURIComponent(product.name)}`;

  const addToCart = (goCheckout = false) => {
    addItem(product, qty, toast);
    if (goCheckout) navigate("/checkout");
  };

  const specsEntries = product.specs ? Object.entries(product.specs) : [];

  return (
    <div className="page--plain">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb" style={{ marginTop: 26 }}>
          <Link to="/">Home</Link>
          <IcChevronRight size={12} className="sep" />
          <Link to="/products">Products</Link>
          <IcChevronRight size={12} className="sep" />
          <Link to={`/products/${product.category}`}>{product.categoryName || product.category}</Link>
          <IcChevronRight size={12} className="sep" />
          <span>{product.brand}</span>
        </nav>

        <div className="pd-layout mt-12">
          {/* ---------- gallery ---------- */}
          <div className="pd-gallery">
            <div className="pd-gallery__main">
              {product.discount > 0 && <span className="badge badge--danger pd-gallery__ribbon">SAVE {product.discount}%</span>}
              <ProductImage src={images[activeImg]} category={product.category} name={product.name} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((src, i) => (
                  <button key={i} className={cx("pd-thumb", activeImg === i && "pd-thumb--active")} onClick={() => setActiveImg(i)} aria-label={`View image ${i + 1}`}>
                    <ProductImage src={src} category={product.category} name={product.name} alt="" />
                  </button>
                ))}
              </div>
            )}
            <div className="pd-meta">
              <div>
                <IcTruck size={17} /> {product.price >= 50000 ? "Free express delivery" : "Express delivery · ₹199 under ₹50,000"}
              </div>
              <div>
                <IcShield size={17} /> Warranty-backed · genuine products
              </div>
              <div>
                <IcMapPin size={17} /> Available at Jerry Computers stores &amp; online
              </div>
            </div>
          </div>

          {/* ---------- info ---------- */}
          <div className="pd-info">
            <div className="pd-brand small semibold" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {product.brand} · {product.categoryName}
            </div>
            <h1>{product.name}</h1>
            <div className="pd-rating">
              <RatingStars rating={product.rating} count={product.reviewCount} />
              <span className="tag" style={{ fontSize: 12 }}>
                {product.tags?.length ? product.tags.join(" · ").toUpperCase() : "Genuine product"}
              </span>
            </div>

            <div className="pd-price">
              <span className="price-now">{money(product.price)}</span>
              {product.mrp > product.price && <span className="price-old">{money(product.mrp)}</span>}
              {product.discount > 0 && <span className="discount-pct">Save {product.discount}%</span>}
            </div>
            <p className="muted mt-12" style={{ lineHeight: 1.7 }}>
              {product.tagline || product.description}
            </p>

            <div className="flex-align gap-8" style={{ margin: "14px 0 20px" }}>
              <StatusBadge
                status={stock === 0 ? "Out of stock" : stock <= 8 ? "Only few left" : "In stock"}
                tone={stock === 0 ? "danger" : stock <= 8 ? "warning" : "success"}
              />
            </div>

            {specsEntries.length > 0 && (
              <ul className="pd-spec-list" aria-label="Key specifications">
                {specsEntries.slice(0, 5).map(([k, v]) => (
                  <li key={k}>
                    <b>{k}</b>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="pd-actions mt-20">
              <div className="pd-actions-row flex-align">
                <div className="qty" role="group" aria-label="Quantity">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">
                    <IcMinus size={15} />
                  </button>
                  <input value={qty} readOnly aria-label="Quantity" />
                  <button onClick={() => setQty((q) => Math.min(stock || 1, q + 1))} disabled={qty >= stock} aria-label="Increase quantity">
                    <IcPlus size={15} />
                  </button>
                </div>
                <button className="btn btn--primary pd-buy" disabled={stock === 0} onClick={() => addToCart(false)}>
                  <IcCart size={17} /> Add to Cart
                </button>
                <button className="btn btn--dark pd-buy" disabled={stock === 0} onClick={() => addToCart(true)}>
                  <IcZap size={17} /> Buy Now
                </button>
                <button
                  className={cx("btn btn--outline pd-wish", inWish && "btn--danger-soft")}
                  style={{ padding: 0 }}
                  onClick={() => {
                    toggle(product);
                    toast[inWish ? "info" : "success"](inWish ? "Removed from wishlist." : "Saved to wishlist.", product.name);
                  }}
                  aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
                  aria-pressed={inWish}
                >
                  <IcHeart size={19} />
                </button>
              </div>

              {/* product → service connect */}
              <div className="aftercare" role="complementary" aria-label="Need help with this product?">
                <span className="aftercare__ic">
                  <IcWrench size={24} />
                </span>
                <div style={{ minWidth: 220, flex: 1 }}>
                  <h3>NEED HELP WITH THIS PRODUCT?</h3>
                  <p>
                    Jerry technicians can handle {svc.verb} — professional {svc.label} with genuine care.
                  </p>
                </div>
                <div className="aftercare__actions">
                  <Link to={requestPath} className="btn btn--white btn--sm">
                    <IcWrench size={15} /> Request Installation
                  </Link>
                  <Link to={`/support?product=${encodeURIComponent(product.name)}`} className="btn btn--outline-dark btn--sm">
                    <IcHeadset size={15} /> Get Technical Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- tabs ---------- */}
        <div className="card card--pad mt-40" style={{ padding: 0, overflow: "hidden" }}>
          <div className="tabs" role="tablist" style={{ padding: "0 20px" }}>
            {[
              ["overview", "Overview"],
              ["specs", "Specifications"],
              ["reviews", `Reviews (${product.reviewCount})`],
            ].map(([key, label]) => (
              <button key={key} role="tab" aria-selected={tab === key} className={cx("tab", tab === key && "tab--active")} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>
          <div className="tab-panel" style={{ padding: "28px 30px" }} role="tabpanel">
            {tab === "overview" && (
              <div className="split" style={{ gridTemplateColumns: "1.6fr 1fr", gap: 34 }}>
                <div>
                  <h3 className="title-sm">About this product</h3>
                  <p style={{ lineHeight: 1.85, color: "var(--ink-2)" }}>{product.description}</p>
                  <div className="promo__features" style={{ marginTop: 10 }}>
                    {["Professional installation available", `Warranty: ${product.specs?.Warranty || "1 year"}`, "Free tech support consultation", "Genuine product with GST invoice"].map((f) => (
                      <div className="promo__feature" style={{ color: "var(--ink)" }} key={f}>
                        <IcCheck size={17} style={{ color: "var(--success)" }} /> {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card--flat" style={{ background: "var(--bg)", borderRadius: 16, padding: 22 }}>
                  <h4 className="title-sm" style={{ marginBottom: 12 }}>
                    Why buy from Jerry Computers?
                  </h4>
                  <ul className="pd-meta" style={{ background: "transparent", padding: 0 }}>
                    <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <IcTruck size={17} style={{ color: "var(--primary)" }} /> Fast insured delivery, free above ₹50,000.
                    </li>
                    <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <IcWrench size={17} style={{ color: "var(--primary)" }} /> Optional installation &amp; setup by certified techs.
                    </li>
                    <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <IcShield size={17} style={{ color: "var(--primary)" }} /> Extended service plans available.
                    </li>
                    <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <IcRefresh size={17} style={{ color: "var(--primary)" }} /> Easy returns within 7 days.
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {tab === "specs" && (
              specsEntries.length ? (
                <table className="spec-table">
                  <tbody>
                    {specsEntries.map(([k, v]) => (
                      <tr key={k}>
                        <td>{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="muted">Full specifications coming soon.</p>
              )
            )}
            {tab === "reviews" && (
              <div>
                <div className="flex-between" style={{ marginBottom: 10 }}>
                  <div className="flex-align gap-12">
                    <span className="price-tag" style={{ fontSize: 34 }}>
                      {Number(product.rating).toFixed(1)}
                    </span>
                    <RatingStars rating={product.rating} count={product.reviewCount} />
                  </div>
                  <span className="muted small">{product.reviewCount} verified reviews</span>
                </div>
                <div className="pct-bar" style={{ maxWidth: 420, marginBottom: 18 }}>
                  <span style={{ width: `${(Number(product.rating) / 5) * 100}%`, background: "#f59e0b" }} />
                </div>
                {SAMPLE_REVIEWS.map((r) => (
                  <div className="review-item" key={r.name}>
                    <span className="avatar avatar--teal">{r.name[0]}</span>
                    <div>
                      <div className="msg__head">
                        <span className="msg__who">
                          {r.name} <small>· {r.date}</small>
                        </span>
                        <RatingStars rating={r.rating} size={12} />
                      </div>
                      <p style={{ color: "var(--ink-2)" }}>{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---------- related ---------- */}
        {recommended && recommended.length > 0 && (
          <section className="mt-40">
            <h2 className="title">You may also like</h2>
            <p className="muted" style={{ marginBottom: 24 }}>
              More {product.categoryName} from Jerry Computers.
            </p>
            <div className="grid-products">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
