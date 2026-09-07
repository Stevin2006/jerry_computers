import { Link, useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";
import RatingStars from "./RatingStars";
import { IcHeart, IcCart } from "./Icons";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { money, cx } from "@/lib/utils";

export default function ProductCard({ product, showAction = true, className }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();
  const inWishlist = has(product.id);

  const stock = product.stock ?? 0;
  const stockClass = stock === 0 ? "stock-out" : stock <= 8 ? "stock-low" : "stock-in";
  const stockLabel = stock === 0 ? "Out of stock" : stock <= 8 ? `Only ${stock} left` : "In stock";

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
    toast[inWishlist ? "info" : "success"](inWishlist ? "Removed from your wishlist." : "Saved to your wishlist.", product.name);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock === 0) return;
    addItem(product, 1, toast);
  };

  const to = `/products/${product.id}`;

  return (
    <article className={cx("product-card", className)}>
      <div className="product-card__media">
        <Link to={to} aria-label={product.name} onClick={(e) => e.stopPropagation()}>
          {product.discount > 0 && (
            <span className="badge badge--danger product-card__ribbon">-{product.discount}%</span>
          )}
          <ProductImage src={product.images?.[0] || product.img} category={product.category} name={product.name} alt={product.name} />
        </Link>
        <button
          className={cx("product-card__wish", inWishlist && "product-card__wish--on")}
          onClick={handleWish}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <IcHeart size={17} />
        </button>
        {product.tags?.includes("deal") && (
          <span className="tag deal-tag" style={{ position: "absolute", bottom: 10, left: 10, zIndex: 2, fontSize: 11, background: "#fff3d6", border: "0", color: "#92400e" }}>
            Deal
          </span>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__brand">
          <span>{product.brand}</span>
          <span className="cat">{product.categoryName || product.category}</span>
        </div>
        <Link to={to} className="product-card__name" onClick={(e) => e.stopPropagation()}>
          {product.name}
        </Link>
        <RatingStars rating={product.rating} count={product.reviewCount} />
        <div className="product-card__price">
          <span className="price-now">{money(product.price)}</span>
          {product.mrp > product.price && <span className="price-old">{money(product.mrp)}</span>}
          {product.discount > 0 && <span className="discount-pct">{product.discount}% off</span>}
        </div>
        <span className={cx("stock-line", stockClass)}>{stockLabel}</span>
        {showAction && (
          <div className="product-card__foot">
            <button
              className="btn add-cart-btn"
              disabled={stock === 0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (stock === 0) return;
                addItem(product, 1, toast);
              }}
            >
              <IcCart size={17} />
              {stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function ProductRow({ product, onAction, actionLabel = "View", subtitle }) {
  /* compact horizontal hit used by search & wishlist-style lists */
  const { addItem } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  return (
    <Link to={`/products/${product.id}`} className="search-hit" onClick={onAction}>
      <ProductImage className="search-hit__thumb" src={product.images?.[0] || product.img} category={product.category} name={product.name} alt={product.name} />
      <span style={{ minWidth: 0 }}>
        <span className="search-hit__name" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {product.name}
        </span>
        <span className="search-hit__cat">
          {product.brand} · {product.categoryName || product.category}
        </span>
      </span>
      <span className="search-hit__price" onClick={(e) => e.preventDefault()}>
        {money(product.price)}
        {product.mrp > product.price && <s>{money(product.mrp)}</s>}
        <button
          className="btn btn--soft btn--sm"
          style={{ marginLeft: 6, marginTop: 4 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(product, 1, toast);
            onAction?.();
          }}
        >
          <IcCart size={14} /> {actionLabel}
        </button>
      </span>
    </Link>
  );
}
