import { Link } from "react-router-dom";
import { cx } from "@/lib/utils";

/**
 * Jerry Computers brand lockup. Pass `to` to render as a home link.
 */
export default function Logo({ className, tagline = false, dark = false, to = "/" }) {
  const inner = (
    <>
      <span className="brand__logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17V7l10 10V7" />
        </svg>
      </span>
      <span className="brand__text">
        <span className="brand__name">
          JERRY&nbsp;<em>COMPUTERS</em>
        </span>
        {tagline && <span className={cx("brand__tag", dark && "brand__tag--dark")}>Your Complete Technology Partner</span>}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cx("brand", className)} aria-label="Jerry Computers — home">
        {inner}
      </Link>
    );
  }
  return (
    <span className={cx("brand", className)} aria-label="Jerry Computers">
      {inner}
    </span>
  );
}
