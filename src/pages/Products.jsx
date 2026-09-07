import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHead from "@/components/PageHead";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { SkeletonGrid } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import { categories, categoryByKey } from "@/data/mockCategories";
import { getProducts, getBrands } from "@/api/productApi";
import { IcPackage, IcFilter, IcX } from "@/components/Icons";
import { cx } from "@/lib/utils";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer rating" },
  { value: "discount", label: "Biggest discount" },
];

const PRICE_OPTIONS = [
  { value: 0, label: "Any price" },
  { value: 10000, label: "Under ₹10,000" },
  { value: 25000, label: "Under ₹25,000" },
  { value: 50000, label: "Under ₹50,000" },
  { value: 100000, label: "Under ₹1,00,000" },
  { value: 200000, label: "Under ₹2,00,000" },
];

export default function Products({ initialCategory = "" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const dealsParam = searchParams.get("deals") === "1";

  const [search, setSearch] = useState(qParam);
  const [category, setCategory] = useState(initialCategory || searchParams.get("category") || "");
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("featured");
  const [deals, setDeals] = useState(dealsParam);
  const [page, setPage] = useState(1);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [mobileFilters, setMobileFilters] = useState(false);

  const activeCategory = categoryByKey(category);

  /* keep local state in sync when the URL drives navigation */
  useEffect(() => {
    setSearch(qParam);
    setDeals(dealsParam);
  }, [qParam, dealsParam]);

  useEffect(() => {
    setCategory(initialCategory);
    setPage(1);
  }, [initialCategory]);

  useEffect(() => {
    getBrands()
      .then(setBrands)
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search,
        category,
        brand,
        maxPrice,
        minRating,
        sort: deals ? "discount" : sort,
        page,
        pageSize: deals ? 60 : 12,
      };
      const data = await getProducts(params);
      if (deals) {
        const list = (data.results || []).filter((p) => p.discount > 0 && (p.tags || []).includes("deal"));
        setResult({ ...data, results: list, count: list.length });
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [search, category, brand, maxPrice, minRating, sort, deals, page]);

  useEffect(() => {
    load();
  }, [load]);

  const count = useMemo(() => result?.count ?? 0, [result]);

  const heading = deals
    ? "TODAY'S TECHNOLOGY DEALS"
    : activeCategory
      ? activeCategory.name.toUpperCase()
      : search
        ? `Results for “${search}”`
        : "ALL TECHNOLOGY PRODUCTS";

  const subtitle = deals
    ? "Real discounts on real technology — while stock lasts."
    : activeCategory
      ? activeCategory.description
      : search
        ? `${count} matching product${count === 1 ? "" : "s"}`
        : "Browse computers, laptops, printers, CCTV & security, gaming and accessories.";

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setMaxPrice(0);
    setMinRating(0);
    setSort("featured");
    setDeals(false);
    setSearchParams({});
    setPage(1);
  };

  const filterCount = [brand, maxPrice, minRating, search].filter(Boolean).length + (deals ? 1 : 0);

  const toggleFilter = (key, value) => {
    if (key === "brand") setBrand((v) => (v === value ? "" : value));
    if (key === "maxPrice") setMaxPrice((v) => (Number(v) === Number(value) ? 0 : value));
    if (key === "minRating") setMinRating((v) => (Number(v) === Number(value) ? 0 : value));
    setPage(1);
  };

  return (
    <div className="page--plain">
      <PageHead
        eyebrow={deals ? "Deals" : activeCategory ? activeCategory.name : "Catalogue"}
        title={heading}
        sub={subtitle}
        crumbs={[
          { label: "Products", to: "/products" },
          ...(activeCategory ? [{ label: activeCategory.name }] : []),
        ]}
      />

      <section className="section section--tight">
        <div className="container">
          <div className="catalog-layout">
            {/* ------------ sidebar ------------ */}
            <aside className={cx("catalog-side", mobileFilters && "catalog-side--open")}>
              <div className="card card--pad-sm" style={{ padding: "6px 16px" }}>
                <div className="filter-group">
                  <h3 className="filter-group__title" style={{ margin: 0 }}>
                    Category
                  </h3>
                  <div className="filter-options">
                    <button className={cx("filter-option", !category && "filter-option--active")} onClick={() => { setCategory(""); setPage(1); }}>
                      All categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.key}
                        className={cx("filter-option", category === c.key && "filter-option--active")}
                        onClick={() => {
                          setCategory(c.key);
                          setPage(1);
                        }}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h3 className="filter-group__title" style={{ margin: 0 }}>
                    Brand
                  </h3>
                  <div className="filter-options">
                    <button className={cx("filter-option", !brand && "filter-option--active")} onClick={() => toggleFilter("brand", "")}>
                      All brands
                    </button>
                    {brands.map((b) => (
                      <button key={b} className={cx("filter-option", brand === b && "filter-option--active")} onClick={() => toggleFilter("brand", b)}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h3 className="filter-group__title" style={{ margin: 0 }}>
                    Price
                  </h3>
                  <div className="filter-options">
                    {PRICE_OPTIONS.map((o) => (
                      <button key={o.value} className={cx("filter-option", Number(maxPrice) === o.value && "filter-option--active")} onClick={() => toggleFilter("maxPrice", o.value)}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group" style={{ paddingBottom: 14 }}>
                  <h3 className="filter-group__title" style={{ margin: 0 }}>
                    Rating
                  </h3>
                  <div className="filter-options">
                    {[0, 4, 4.5].map((r) => (
                      <button key={r} className={cx("filter-option", Number(minRating) === r && "filter-option--active")} onClick={() => toggleFilter("minRating", r)}>
                        {r === 0 ? "Any rating" : `★★★★ ${r} & above`}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn btn--ghost btn--sm btn--block" onClick={clearFilters}>
                  <IcX size={14} /> Clear all filters
                </button>
              </div>
            </aside>

            {/* ------------ main ------------ */}
            <div className="catalog-main">
              <div className="toolbar">
                <button className="btn btn--outline btn--sm filter-toggle" onClick={() => setMobileFilters((o) => !o)} aria-expanded={mobileFilters}>
                  <IcFilter size={15} /> Filters {filterCount > 0 && `(${filterCount})`}
                </button>
                <span className="toolbar__count">
                  <b>{count}</b> product{count === 1 ? "" : "s"}
                </span>
                {filterCount > 0 && (
                  <button className="btn btn--ghost btn--sm" onClick={clearFilters}>
                    <IcX size={14} /> Reset
                  </button>
                )}
                <span className="spacer" />
                <label htmlFor="sort" className="small muted" style={{ fontWeight: 600 }}>
                  Sort
                </label>
                <select id="sort" className="select sort-select" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && <ErrorMessage error={error} onRetry={load} />}

              {loading ? (
                <SkeletonGrid count={8} />
              ) : result && result.results.length === 0 ? (
                <EmptyState
                  icon={<IcPackage size={34} />}
                  title={deals ? "No deals right now" : "No products found"}
                  text={
                    deals
                      ? "New deals land regularly — check back soon or browse the full catalogue."
                      : "Try removing some filters or searching for something else."
                  }
                  action={
                    <button className="btn btn--primary" onClick={clearFilters}>
                      Clear filters & browse all
                    </button>
                  }
                />
              ) : (
                <>
                  <div className="grid-products">
                    {(result?.results || []).map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                  {!deals && (
                    <Pagination
                      page={result?.page || 1}
                      pageCount={result?.pageCount || 1}
                      onChange={(p) => {
                        setPage(p);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
