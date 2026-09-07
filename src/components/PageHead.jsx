import { Link } from "react-router-dom";
import { IcChevronRight } from "./Icons";
import { cx } from "@/lib/utils";

/**
 * Standard inner-page hero: breadcrumbs + eyebrow + title + subtitle +
 * optional action buttons on the right.
 */
export default function PageHead({ eyebrow, title, sub, crumb = "Home", dark = false, actions, crumbs }) {
  return (
    <div className={cx("page-hero", dark && "page-hero--navy")}>
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">{crumb}</Link>
          {crumbs?.map((c, i) => (
            <span key={i} className="flex-align" style={{ gap: 7 }}>
              <IcChevronRight size={12} className="sep" />
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        <div className="page-hero__inner">
          <div style={{ maxWidth: 720 }}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1 className="page-hero__title">{title}</h1>
            {sub && <p style={{ fontSize: 17, color: "var(--muted)", maxWidth: 640, margin: 0 }}>{sub}</p>}
          </div>
          {actions && <div className="svc-hero-actions">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
