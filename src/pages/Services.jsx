import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHead from "@/components/PageHead";
import ProductImage from "@/components/ProductImage";
import { SkeletonBlock } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { IcArrowRight, IcWrench, IcCheck, IcHeadset, IcCpu, IcLaptop, IcPrinter, IcCamera, IcGamepad, IcMonitor } from "@/components/Icons";

const GROUP_ICONS = { computer: IcCpu, laptop: IcLaptop, printer: IcPrinter, cctv: IcCamera, gaming: IcGamepad, accessories: IcMonitor, other: IcWrench };
import { getServiceCategories } from "@/api/serviceApi";
import { serviceCategories as fallback } from "@/data/mockServices";
import { useAuth } from "@/context/AuthContext";

export default function Services() {
  const [params] = useSearchParams();
  const focusKey = params.get("type") || "";
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const focusRef = useRef(null);

  const load = async () => {
    setError(null);
    try {
      const res = await getServiceCategories();
      setData(res && res.length ? res : fallback);
    } catch (e) {
      setError(e);
      setData(fallback);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (focusKey && data) {
      setTimeout(() => {
        const el = document.getElementById(`service-${focusKey}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, focusKey]);

  return (
    <div className="page">
      <PageHead
        dark
        eyebrow="Services & support"
        title="PROFESSIONAL TECHNOLOGY SERVICES"
        sub="Expert installation, maintenance, repair and technical support for your technology."
        crumb="Home"
        crumbs={[{ label: "Services" }]}
        actions={
          <Link to="/services/request" className="btn btn--primary btn--lg">
            <IcWrench size={17} /> Request a Service
          </Link>
        }
      />

      <section className="section">
        <div className="container">
          {error ? (
            <ErrorMessage error={error} onRetry={load} />
          ) : !data ? (
            <div style={{ display: "grid", gap: 22 }}>
              <SkeletonBlock lines={8} height={160} />
              <SkeletonBlock lines={8} height={160} />
            </div>
          ) : (
            <>
              <div className="grid-3" style={{ marginBottom: 54 }}>
                {data
                  .filter((s) => s.key !== "other")
                  .map((s) => {
                    const GroupIcon = GROUP_ICONS[s.key] || IcWrench;
                    return (
                    <article className="service-dir" key={s.key} id={`service-${s.key}`} style={{ scrollMarginTop: 110 }}>
                      <span className="service-card__ic" style={{ marginBottom: 4 }}>
                        <GroupIcon size={22} />
                      </span>
                      <h3>{s.name}</h3>
                      <p className="muted small" style={{ marginBottom: 4 }}>
                        {s.blurb}
                      </p>
                      <ul>
                        {s.items.slice(0, 6).map((it) => (
                          <li key={it.name}>
                            <IcCheck size={15} /> {it.name}
                          </li>
                        ))}
                      </ul>
                      <div className="service-dir__foot flex-between">
                        <span className="count small">{s.items.length} service types</span>
                        <Link to={`/services/request?category=${s.key}`} className="btn btn--soft btn--sm">
                          Request <IcArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                    );
                  })}
              </div>

              {/* full service menu */}
              <h2 className="title-lg" style={{ marginBottom: 26 }}>
                EVERYTHING WE CAN DO FOR YOU
              </h2>
              <div style={{ display: "grid", gap: 22 }}>
                {data.map((group) => (
                  <div className="card" key={group.key} style={{ overflow: "hidden" }}>
                    <div className="split" style={{ gap: 0, gridTemplateColumns: "340px 1fr" }}>
                      <div style={{ position: "relative", minHeight: 200 }}>
                        <ProductImage
                          src={group.image}
                          category={group.key === "other" ? "accessories" : group.key === "computer" ? "computers" : group.key}
                          name={group.name}
                          alt={group.name}
                          className="cover"
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.9))" }} className="hide-mobile" />
                      </div>
                      <div style={{ padding: "26px 30px" }}>
                        <h3 style={{ fontSize: 18 }}>{group.heading}</h3>
                        <p className="muted small" style={{ marginBottom: 14 }}>
                          {group.blurb}
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px 22px" }}>
                          {group.items.map((it) => (
                            <div key={it.name} className="flex-align" style={{ gap: 8, fontSize: 13.5, color: "var(--ink-2)" }}>
                              <IcCheck size={14} style={{ color: "var(--success)", flex: "0 0 auto" }} /> {it.name}
                            </div>
                          ))}
                        </div>
                        <Link to={`/services/request?category=${group.key}`} className="btn btn--outline btn--sm mt-16">
                          Request {group.key === "other" ? "this service" : group.name} <IcArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA banner */}
              <div className="newsletter mt-40" style={{ background: "linear-gradient(120deg,#0c1a40,#16316e)" }}>
                <div className="newsletter__inner">
                  <div>
                    <span className="eyebrow" style={{ color: "#8fb4ff" }}>
                      <IcHeadset size={15} /> Need something else?
                    </span>
                    <h2>CAN'T FIND THE SERVICE YOU NEED?</h2>
                    <p>Talk to our team — if it's technology, we probably support it. Call {`${""}`}us or raise a service request and we'll take it from there.</p>
                  </div>
                  <div className="flex-center wrap" style={{ justifyContent: "flex-start" }}>
                    <Link to="/services/request" className="btn btn--primary btn--lg">
                      Request a Service
                    </Link>
                    <Link to="/support" className="btn btn--outline-dark btn--lg">
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
