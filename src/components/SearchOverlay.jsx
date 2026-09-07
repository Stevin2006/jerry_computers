import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IcSearch, IcX, IcPackage } from "./Icons";
import { getProducts } from "@/api/productApi";
import ProductImage from "./ProductImage";
import { money } from "@/lib/utils";
import { Spinner } from "./Loading";

const QUICK = ["Dell laptop", "Gaming PC", "PS5", "HP printer", "CCTV camera", "SSD", "Keyboard", "Gaming monitor"];

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!touched) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    const t = setTimeout(async () => {
      try {
        const data = await getProducts({ search: q, pageSize: 6 });
        setResults(data.results || []);
        setStatus("done");
      } catch {
        setResults([]);
        setStatus("done");
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, touched]);

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    onClose?.();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search products">
      <div className="search-panel">
        <form className="search-panel__input" onSubmit={submit} role="search">
          <IcSearch size={21} style={{ color: "var(--faint)", flex: "0 0 auto" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setTouched(true);
            }}
            placeholder="Search products… try “Gaming PC” or “CCTV camera”"
            aria-label="Search products"
          />
          {status === "loading" && <Spinner dark size={17} />}
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search" style={{ color: "var(--muted)" }}>
            <IcX size={19} />
          </button>
        </form>

        {results.length > 0 && (
          <div className="search-panel__results">
            {results.map((p) => (
              <Link key={p.id} to={`/products/${p.id}`} className="search-hit" onClick={onClose}>
                <ProductImage className="search-hit__thumb" src={p.images?.[0] || p.img} category={p.category} name={p.name} alt={p.name} />
                <span style={{ minWidth: 0 }}>
                  <span className="search-hit__name" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </span>
                  <span className="search-hit__cat">
                    {p.brand} · {p.categoryName || p.category}
                  </span>
                </span>
                <span className="search-hit__price">
                  {money(p.price)}
                  {p.mrp > p.price && <s>{money(p.mrp)}</s>}
                </span>
              </Link>
            ))}
          </div>
        )}

        {touched && status === "done" && query.trim() && results.length === 0 && (
          <div className="empty" style={{ padding: 28 }}>
            <div className="empty__art" style={{ width: 60, height: 60 }}>
              <IcPackage size={26} />
            </div>
            <p style={{ margin: 0 }} className="muted">
              No products match “{query}”.
            </p>
            <Link to={`/products?q=${encodeURIComponent(query)}`} className="btn btn--soft btn--sm" onClick={onClose}>
              See all products
            </Link>
          </div>
        )}

        <div className="search-quick">
          {QUICK.map((q) => (
            <button
              key={q}
              className="tag"
              style={{ cursor: "pointer" }}
              onClick={() => {
                onClose?.();
                navigate(`/products?q=${encodeURIComponent(q)}`);
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
