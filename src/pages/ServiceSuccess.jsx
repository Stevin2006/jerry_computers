import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IcCheckCircle, IcHeadset, IcPhone, IcArrowRight, IcPackage, IcWrench } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";

export default function ServiceSuccess() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [id] = useState(location.state?.id || localStorage.getItem("jc_last_service") || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page--plain">
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="card card--pad text-center" style={{ padding: 46 }}>
            <span className="empty__art" style={{ margin: "0 auto 20px", width: 92, height: 92 }}>
              <IcCheckCircle size={44} />
            </span>
            <h1 className="title-lg">SERVICE REQUEST RECEIVED</h1>
            <p className="lead muted" style={{ fontSize: 16, marginBottom: 4 }}>
              Your service request has been submitted successfully.
              <br />
              Our support team will contact you shortly.
            </p>
            {id && (
              <div className="card" style={{ background: "var(--bg)", padding: 16, margin: "20px auto", maxWidth: 380 }}>
                <span className="tiny muted" style={{ display: "block" }}>
                  Your request reference
                </span>
                <b style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--primary)" }}>{id}</b>
              </div>
            )}
            <p className="muted small" style={{ maxWidth: 460, margin: "0 auto 22px" }}>
              Keep this reference handy. Our support team will call you within 2 business hours to confirm the visit details
              and technician.
            </p>
            <div className="flex-center wrap">
              {isAuthenticated ? (
                <Link to="/my-services" className="btn btn--primary">
                  <IcPackage size={16} /> Track My Service Requests
                </Link>
              ) : (
                <Link to="/register" className="btn btn--primary">
                  Create an account to track requests <IcArrowRight size={15} />
                </Link>
              )}
              <Link to="/" className="btn btn--outline">
                Back to Home
              </Link>
            </div>
          </div>

          <div className="grid-3 mt-24" style={{ gap: 16 }}>
            {[
              { ic: IcWrench, t: "Certified technicians", d: "Trained professionals handle every request." },
              { ic: IcHeadset, t: "Dedicated support", d: "One contact for all your follow-ups." },
              { ic: IcPhone, t: "Questions?", d: "Call +91 44 4266 9000, Mon–Sat 9:30–8." },
            ].map((x) => (
              <div className="card card--pad-sm text-center" key={x.t}>
                <x.ic size={22} style={{ color: "var(--primary)", margin: "0 auto 6px", display: "block" }} />
                <b className="small">{x.t}</b>
                <p className="tiny muted" style={{ margin: "4px 0 0" }}>
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
