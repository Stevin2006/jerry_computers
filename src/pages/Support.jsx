import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHead from "@/components/PageHead";
import { IcHeadset, IcWrench, IcPhone, IcMail, IcMapPin, IcClock, IcChevronDown, IcMessageCircle, IcLifeBuoy, IcCheckCircle } from "@/components/Icons";
import { SITE } from "@/data/siteInfo";

const FAQS = [
  {
    q: "How do I track my order?",
    a: "Log in and visit My Orders, or use the order ID from your confirmation email. Every order moves through Pending → Confirmed → Processing → Shipped → Delivered, and the page updates in real time.",
  },
  {
    q: "Do you offer installation with product purchases?",
    a: "Yes. Add a service request when buying, or request it later from any product page under 'Need help with this product?'. Our technicians handle computers, laptops, printers, CCTV and full gaming setups.",
  },
  {
    q: "What is covered under warranty?",
    a: "Every product carries its manufacturer warranty plus Jerry's service warranty. We also offer extended service plans. Keep your invoice handy — it's your warranty document.",
  },
  {
    q: "My printer won't connect to Wi-Fi. Can you help?",
    a: "Absolutely. Open a support ticket or a printer service request and our technicians will remotely or on-site configure your printer, router and devices.",
  },
  {
    q: "What are your business hours?",
    a: "Monday to Saturday 9:30 AM – 8:00 PM and Sunday 10:00 AM – 2:00 PM. Support tickets are answered within 24 hours.",
  },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="card card--pad" style={{ padding: "8px 26px" }}>
      {FAQS.map((f, i) => (
        <div key={f.q} style={{ borderBottom: i < FAQS.length - 1 ? "1px solid var(--line)" : 0 }}>
          <button
            className="flex-between"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            style={{ width: "100%", background: "none", border: 0, padding: "17px 0", cursor: "pointer", textAlign: "left" }}
          >
            <b style={{ fontSize: 15.5 }}>{f.q}</b>
            <IcChevronDown size={17} style={{ color: "var(--muted)", transform: open === i ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
          {open === i && <p className="muted" style={{ margin: "-2px 0 18px", lineHeight: 1.8 }}>{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

export default function Support() {
  const [params] = useSearchParams();
  const productHint = params.get("product");
  const orderHint = params.get("order");
  const hint = productHint ? `product=${encodeURIComponent(productHint)}` : orderHint ? `order=${encodeURIComponent(orderHint)}` : "";

  return (
    <div className="page">
      <PageHead
        dark
        eyebrow="Support center"
        title="HOW CAN WE HELP?"
        sub="Product help, service requests and direct contact with our support team — Jerry Computers stays with you after every sale."
        crumb="Home"
        crumbs={[{ label: "Support" }]}
      />
      <section className="section section--tight">
        <div className="container">
          <div className="support-options">
            <div className="support-card">
              <span className="support-card__ic">
                <IcLifeBuoy size={28} />
              </span>
              <h3>PRODUCT SUPPORT</h3>
              <p>Help with products purchased from Jerry Computers — troubleshooting, setup questions and warranty help.</p>
              <Link to={`/support/tickets${hint ? `?${hint}&new=1` : "?new=1"}`} className="btn btn--primary">
                Open a Support Ticket
              </Link>
              <Link to="/support/tickets" className="btn btn--ghost btn--sm">
                View my tickets
              </Link>
            </div>
            <div className="support-card">
              <span className="support-card__ic">
                <IcWrench size={28} />
              </span>
              <h3>SERVICE REQUEST</h3>
              <p>Installation, repair and maintenance by certified technicians — on-site or at our service centre.</p>
              <Link to="/services/request" className="btn btn--primary">
                Request a Service
              </Link>
              <Link to="/services" className="btn btn--ghost btn--sm">
                See all services
              </Link>
            </div>
            <div className="support-card">
              <span className="support-card__ic">
                <IcHeadset size={28} />
              </span>
              <h3>CONTACT SUPPORT</h3>
              <p>Talk to a real person. Call, email or visit our store — we're here during business hours and beyond.</p>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn btn--primary">
                <IcPhone size={16} /> {SITE.phone}
              </a>
              <Link to={`/support/tickets?${hint}&new=1`} className="btn btn--ghost btn--sm">
                Send us a message
              </Link>
            </div>
          </div>

          {/* FAQ + contact */}
          <div className="split mt-40" style={{ gap: 46, alignItems: "start" }}>
            <div>
              <h2 className="title-lg" style={{ marginBottom: 18 }}>
                FREQUENTLY ASKED QUESTIONS
              </h2>
              <Faq />
              <div className="flex-align mt-16" style={{ gap: 10 }}>
                <IcMessageCircle size={18} style={{ color: "var(--primary)" }} />
                <Link to={`/support/tickets?${hint}&new=1`} className="small semibold">
                  Can't find your answer? Open a ticket →
                </Link>
              </div>
            </div>
            <div>
              <h2 className="title-lg" style={{ marginBottom: 18 }}>
                REACH US DIRECTLY
              </h2>
              <div className="card card--pad" style={{ display: "grid", gap: 16 }}>
                <div className="flex-align" style={{ gap: 13, alignItems: "flex-start" }}>
                  <IcPhone size={19} style={{ color: "var(--primary)", flex: "0 0 auto", marginTop: 2 }} />
                  <div>
                    <b>Call / WhatsApp</b>
                    <p className="muted small" style={{ margin: 0 }}>
                      {SITE.phone} · {SITE.mobile}
                    </p>
                  </div>
                </div>
                <div className="flex-align" style={{ gap: 13, alignItems: "flex-start" }}>
                  <IcMail size={19} style={{ color: "var(--primary)", flex: "0 0 auto", marginTop: 2 }} />
                  <div>
                    <b>Email</b>
                    <p className="muted small" style={{ margin: 0 }}>
                      {SITE.email}
                    </p>
                  </div>
                </div>
                <div className="flex-align" style={{ gap: 13, alignItems: "flex-start" }}>
                  <IcClock size={19} style={{ color: "var(--primary)", flex: "0 0 auto", marginTop: 2 }} />
                  <div>
                    <b>Business hours</b>
                    <p className="muted small" style={{ margin: 0 }}>
                      {SITE.hours.map((h) => (
                        <span key={h.d} style={{ display: "block" }}>
                          {h.d}: {h.h}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                <div className="flex-align" style={{ gap: 13, alignItems: "flex-start" }}>
                  <IcMapPin size={19} style={{ color: "var(--primary)", flex: "0 0 auto", marginTop: 2 }} />
                  <div>
                    <b>Store &amp; service centre</b>
                    <p className="muted small" style={{ margin: 0 }}>
                      {SITE.address}
                    </p>
                  </div>
                </div>
              </div>
              <div className="alert alert--info mt-16">
                <IcCheckCircle size={18} />
                <span>
                  <b>Tip:</b> For fastest help, open a support ticket with your order or service ID.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
