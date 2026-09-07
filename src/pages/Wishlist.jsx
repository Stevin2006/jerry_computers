import { Link } from "react-router-dom";
import PageHead from "@/components/PageHead";
import EmptyState from "@/components/EmptyState";
import ProductImage from "@/components/ProductImage";
import RatingStars from "@/components/RatingStars";
import { IcHeart, IcCart, IcTrash, IcArrowRight } from "@/components/Icons";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { money } from "@/lib/utils";

export default function Wishlist() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();

  if (items.length === 0) {
    return (
      <div className="page--plain">
        <PageHead title="YOUR WISHLIST" sub="Products you've saved for later." crumb="Home" crumbs={[{ label: "Wishlist" }]} />
        <section className="section">
          <div className="container" style={{ maxWidth: 680 }}>
            <EmptyState
              icon={<IcHeart size={30} />}
              title="Your wishlist is empty"
              text="Tap the heart on any product to save it here and compare later."
              action={
                <Link to="/products" className="btn btn--primary">
                  Explore Products
                </Link>
              }
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page--plain">
      <PageHead
        title="YOUR WISHLIST"
        sub={`${items.length} saved product${items.length > 1 ? "s" : ""} — ready when you are.`}
        crumb="Home"
        crumbs={[{ label: "Wishlist" }]}
      />
      <section className="section section--tight">
        <div className="container">
          <div className="wish-grid">
            {items.map((w) => (
              <article className="card card--hover" key={w.productId} style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <Link to={`/products/${w.productId}`} style={{ position: "relative", display: "block", aspectRatio: "1/0.85", background: "var(--sunken)" }}>
                  <ProductImage src={w.image} category={w.category} name={w.name} alt={w.name} />
                </Link>
                <div className="card--pad-sm" style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  <span className="tiny" style={{ color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 700 }}>
                    {w.brand}
                  </span>
                  <Link to={`/products/${w.productId}`} className="cart-line__name">
                    {w.name}
                  </Link>
                  <RatingStars rating={w.rating} size={12} />
                  <div className="flex-align">
                    <span className="price-tag">{money(w.price)}</span>
                    {w.mrp > w.price && <span className="price-old" style={{ fontSize: 12 }}>{money(w.mrp)}</span>}
                  </div>
                  <div className="flex-align mt-8" style={{ gap: 8, marginTop: "auto" }}>
                    <button
                      className="btn btn--primary btn--sm"
                      style={{ flex: 1 }}
                      onClick={() => {
                        addItem({ ...w, id: w.productId, images: [w.image] }, 1, toast);
                        remove(w.productId);
                        toast.success("Moved to your cart.", w.name);
                      }}
                    >
                      <IcCart size={15} /> Move to Cart
                    </button>
                    <button
                      className="icon-btn"
                      style={{ border: "1px solid var(--line)", width: 36, height: 36 }}
                      onClick={() => {
                        remove(w.productId);
                        toast.info("Removed from wishlist.", w.name);
                      }}
                      aria-label={`Remove ${w.name}`}
                    >
                      <IcTrash size={15} style={{ color: "var(--danger)" }} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="flex-center mt-32">
            <Link to="/products" className="btn btn--outline">
              Discover more technology <IcArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
