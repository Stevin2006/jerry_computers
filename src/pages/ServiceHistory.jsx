import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHead from "@/components/PageHead";
import StatusBadge from "@/components/StatusBadge";
import ProductImage from "@/components/ProductImage";
import { SkeletonRows } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import { IcClipboardCheck, IcWrench, IcCheckCircle, IcUser, IcCalendar } from "@/components/Icons";
import { getServiceHistory } from "@/api/serviceApi";
import { prettyDate } from "@/lib/utils";

export default function ServiceHistory() {
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      setHistory(await getServiceHistory());
    } catch (e) {
      setError(e);
      setHistory([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page--plain">
      <PageHead
        title="SERVICE HISTORY"
        sub="Completed services performed by Jerry Computers for your devices."
        crumb="Home"
        crumbs={[{ label: "My Services", to: "/my-services" }, { label: "History" }]}
      />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 940 }}>
          {error ? (
            <ErrorMessage error={error} onRetry={load} />
          ) : history === null ? (
            <SkeletonRows rows={3} />
          ) : history.length === 0 ? (
            <EmptyState
              icon={<IcClipboardCheck size={32} />}
              title="No completed services yet"
              text="Once our team completes a service for you, it will show up here with full details."
              action={
                <Link to="/services/request" className="btn btn--primary">
                  Request a Service
                </Link>
              }
            />
          ) : (
            <div style={{ display: "grid", gap: 18 }}>
              {history.map((r) => (
                <article className="card card--hover" key={r.id} style={{ overflow: "hidden" }}>
                  <div className="order-card__head" style={{ background: "var(--success-soft)" }}>
                    <span className="oid" style={{ color: "#166534" }}>
                      {r.id}
                    </span>
                    <span className="when">Completed {prettyDate(r.scheduledDate || r.createdAt)}</span>
                    <StatusBadge status={r.status} />
                    <span className="tag" style={{ marginLeft: "auto", background: "#fff" }}>
                      <IcCheckCircle size={13} style={{ color: "var(--success)" }} /> Service done
                    </span>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div className="flex-between" style={{ gap: 18 }}>
                      <div style={{ minWidth: 0 }}>
                        <div className="small semibold" style={{ color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                          {r.categoryLabel || r.category}
                        </div>
                        <h3 style={{ fontSize: 17, margin: "6px 0 4px" }}>{r.deviceName || r.productType}</h3>
                        <p className="muted small" style={{ marginBottom: 0 }}>
                          {r.description}
                        </p>
                      </div>
                      <div style={{ flex: "0 0 auto", display: "grid", gap: 8 }}>
                        {r.technician && (
                          <span className="tag">
                            <IcUser size={13} /> {r.technician.name}
                          </span>
                        )}
                        <span className="tag">
                          <IcCalendar size={13} /> {prettyDate(r.scheduledDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
