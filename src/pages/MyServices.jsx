import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHead from "@/components/PageHead";
import StatusBadge, { Timeline } from "@/components/StatusBadge";
import { SkeletonRows } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import ProductImage from "@/components/ProductImage";
import { IcWrench, IcPhone, IcCalendar, IcUser, IcArrowRight } from "@/components/Icons";
import { getMyServices } from "@/api/serviceApi";
import { useAuth } from "@/context/AuthContext";
import { prettyDate } from "@/lib/utils";

export default function MyServices() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      setRequests(await getMyServices());
    } catch (e) {
      setError(e);
      setRequests([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = {
    active: (requests || []).filter((r) => !["Completed", "Cancelled"].includes(r.status)).length,
    completed: (requests || []).filter((r) => r.status === "Completed").length,
  };

  return (
    <div className="page--plain">
      <PageHead
        title="MY SERVICE REQUESTS"
        sub={`Track every service request for ${user?.name || "your account"}.`}
        crumb="Home"
        crumbs={[{ label: "Services", to: "/services" }, { label: "My Requests" }]}
        actions={
          <Link to="/services/request" className="btn btn--primary">
            <IcWrench size={16} /> New Request
          </Link>
        }
      />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 1000 }}>
          {error ? (
            <ErrorMessage error={error} onRetry={load} />
          ) : requests === null ? (
            <SkeletonRows rows={3} />
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<IcWrench size={32} />}
              title="No service requests yet"
              text="Need installation, repair or maintenance? Request a service and track it here."
              action={
                <Link to="/services/request" className="btn btn--primary">
                  Request a Service
                </Link>
              }
            />
          ) : (
            <>
              <div className="dash-mini-stats" style={{ marginBottom: 26 }}>
                <div className="stat-card">
                  <div className="stat-card__head">
                    <span className="stat-card__value">{requests.length}</span>
                  </div>
                  <div className="stat-card__label">Total requests</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__head">
                    <span className="stat-card__value">{counts.active}</span>
                  </div>
                  <div className="stat-card__label">Active / upcoming</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__head">
                    <span className="stat-card__value">{counts.completed}</span>
                  </div>
                  <div className="stat-card__label">Completed</div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 20 }}>
                {requests.map((r) => (
                  <article className="order-card card" key={r.id}>
                    <div className="order-card__head">
                      <span className="oid">{r.id}</span>
                      <span className="when">
                        Requested {prettyDate(r.createdAt)}
                        {r.scheduledDate ? ` · Scheduled ${prettyDate(r.scheduledDate)}` : ""}
                      </span>
                      <StatusBadge status={r.status} />
                    </div>
                    <div style={{ padding: 22, display: "grid", gridTemplateColumns: "1fr 300px", gap: 26 }}>
                      <div>
                        <div className="small semibold" style={{ color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                          {r.categoryLabel || r.category}
                        </div>
                        <h3 style={{ fontSize: 18, margin: "6px 0 4px" }}>{r.deviceName || r.productType || "Device"}</h3>
                        <p className="muted small" style={{ marginBottom: 14 }}>
                          {r.description}
                        </p>
                        <div className="flex-align wrap" style={{ gap: 8 }}>
                          {r.technician ? (
                            <span className="tag">
                              <IcUser size={13} /> {r.technician.name}
                            </span>
                          ) : (
                            <span className="tag">Technician to be assigned</span>
                          )}
                          <span className="tag">
                            <IcCalendar size={13} /> {r.preferredTime || "Time TBD"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontSize: 14, marginBottom: 12 }} className="small">
                          PROGRESS
                        </h4>
                        <Timeline steps={r.timeline} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
