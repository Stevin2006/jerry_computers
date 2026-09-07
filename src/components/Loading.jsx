import { cx } from "@/lib/utils";

export function Spinner({ dark = false, size = 20 }) {
  return <span className={cx("spinner", dark && "spinner--dark")} style={{ width: size, height: size }} role="status" aria-label="Loading" />;
}

/** Full-page / block centered loader */
export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="empty" role="status">
      <div className="empty__art" style={{ background: "transparent", width: "auto", height: "auto" }}>
        <Spinner dark size={30} />
      </div>
      <p className="muted" style={{ margin: 0 }}>
        {label}
      </p>
    </div>
  );
}

export function InlineLoader({ text = "Please wait…" }) {
  return (
    <span className="flex-align gap-8 muted" role="status" style={{ fontSize: 14 }}>
      <Spinner dark size={16} /> {text}
    </span>
  );
}

export function SkeletonCard() {
  return (
    <div className="skel--card">
      <div className="skel skel-media" style={{ aspectRatio: "1/0.92" }} />
      <div className="skel-body">
        <div className="skel skel--line w40" />
        <div className="skel skel--line w70" />
        <div className="skel skel--line w50" />
        <div className="skel skel--line w40" />
        <div className="skel skel--line" style={{ height: 40, borderRadius: 10 }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8, className }) {
  return (
    <div className={cx("grid-products", className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonRows({ rows = 4 }) {
  return (
    <div className="card card--pad" style={{ display: "grid", gap: 18 }} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="flex-align" key={i} style={{ gap: 14 }}>
          <div className="skel" style={{ width: 44, height: 44, borderRadius: 12, flex: "0 0 auto" }} />
          <div style={{ flex: 1, display: "grid", gap: 8 }}>
            <div className="skel skel--line w60" />
            <div className="skel skel--line w30" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonBlock({ lines = 5, height = 220, className }) {
  return (
    <div className={cx("card card--pad", className)} style={{ display: "grid", gap: 14 }} aria-hidden="true">
      <div className="skel skel--line w40" style={{ height: 20 }} />
      <div className="skel" style={{ height, borderRadius: 14 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div className="skel skel--line" style={{ width: `${[90, 80, 95, 70, 85][i % 5]}%` }} key={i} />
      ))}
    </div>
  );
}
