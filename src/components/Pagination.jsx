import { IcChevronLeft, IcChevronRight } from "./Icons";
import { cx } from "@/lib/utils";

export default function Pagination({ page = 1, pageCount = 1, onChange, total }) {
  if (pageCount <= 1) return null;
  const pages = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <nav className="pager" aria-label="Pagination">
      <button className="page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <IcChevronLeft size={17} />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="muted small">
            …
          </span>
        ) : (
          <button key={p} className={cx("page-btn", p === page && "page-btn--active")} aria-current={p === page ? "page" : undefined} onClick={() => onChange(p)}>
            {p}
          </button>
        )
      )}
      <button className="page-btn" disabled={page >= pageCount} onClick={() => onChange(page + 1)} aria-label="Next page">
        <IcChevronRight size={17} />
      </button>
    </nav>
  );
}
