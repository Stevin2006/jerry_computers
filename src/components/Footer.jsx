import { Link } from "react-router-dom";
import Logo from "./Logo";
import { IcPhone, IcMail, IcMapPin, IcClock, IcFacebook, IcInstagram, IcYoutube, IcLinkedin, IcWhatsapp } from "./Icons";
import { SITE } from "@/data/siteInfo";

const SOCIALS = { facebook: IcFacebook, instagram: IcInstagram, youtube: IcYoutube, linkedin: IcLinkedin, whatsapp: IcWhatsapp };

const GROUPS = [
  {
    title: "Shop",
    links: [
      { label: "Computers", to: "/products/computers" },
      { label: "Laptops", to: "/products/laptops" },
      { label: "Printers", to: "/products/printers" },
      { label: "Gaming", to: "/products/gaming" },
      { label: "CCTV & Security", to: "/products/cctv" },
      { label: "Accessories", to: "/products/accessories" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "All Services", to: "/services" },
      { label: "Computer Services", to: "/services?type=computer" },
      { label: "Laptop Services", to: "/services?type=laptop" },
      { label: "Printer Services", to: "/services?type=printer" },
      { label: "CCTV Installation", to: "/services?type=cctv" },
      { label: "Request a Service", to: "/services/request" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Support Center", to: "/support" },
      { label: "Support Tickets", to: "/support/tickets" },
      { label: "Track an Order", to: "/orders" },
      { label: "Track a Service", to: "/my-services" },
      { label: "Contact Us", to: "/support" },
      { label: "FAQs", to: "/support" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo dark />
            <p>
              {SITE.brand} is your complete technology partner — computers, laptops, gaming, printers, CCTV &amp; security,
              accessories and professional installation, repair and support services, all under one roof.
            </p>
            <span className="footer__motto">BUY IT · INSTALL IT · SUPPORT IT · KEEP IT RUNNING</span>
            <div className="footer__social">
              {SITE.socials.map((s) => {
                const Icon = SOCIALS[s.icon];
                return (
                  <a key={s.name} href={s.href} aria-label={s.name} onClick={(e) => e.preventDefault()}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {GROUPS.map((g) => (
            <div key={g.title}>
              <h4 className="footer__head">{g.title}</h4>
              <ul className="footer__links">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="footer__head">Contact</h4>
            <ul className="footer__contact">
              <li>
                <IcPhone size={17} />
                <span>
                  <b>{SITE.phone}</b>
                  <br />
                  <span style={{ opacity: 0.85 }}>{SITE.mobile}</span>
                </span>
              </li>
              <li>
                <IcMail size={17} />
                <span>
                  <b>{SITE.email}</b>
                  <br />
                  <span style={{ opacity: 0.85 }}>{SITE.salesEmail}</span>
                </span>
              </li>
              <li>
                <IcMapPin size={17} />
                <span>{SITE.address}</span>
              </li>
              <li>
                <IcClock size={17} />
                <span>
                  {SITE.hours.map((h) => (
                    <span key={h.d} style={{ display: "block" }}>
                      <b>{h.d}:</b> {h.h}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Jerry Computers. All rights reserved.</span>
          <span>
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms &amp; Conditions</Link>
            <Link to="/products">Shop</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
