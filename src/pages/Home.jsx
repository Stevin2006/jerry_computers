import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "@/data/mockCategories";
import { serviceCategories } from "@/data/mockServices";
import { getProducts } from "@/api/productApi";
import { getServiceCategories } from "@/api/serviceApi";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import ServiceCard from "@/components/ServiceCard";
import ProductImage from "@/components/ProductImage";
import { SkeletonGrid } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import {
  IcShield,
  IcHeadset,
  IcBox,
  IcTruck,
  IcCheck,
  IcMonitor,
  IcLaptop,
  IcPrinter,
  IcCamera,
  IcGamepad,
  IcWrench,
  IcArrowRight,
  IcCpu,
  IcUsers,
  IcTag,
  IcZap,
  IcBuilding,
  IcLifeBuoy,
  IcSettings,
  IcMail,
  IcSparkles,
  IcClipboardCheck,
  IcHome,
  IcPackage,
  IcCheckCircle,
  IcBag,
} from "@/components/Icons";

/* ---------------- section heading helper ---------------- */
function SectionHead({ eyebrow, title, sub, center, action }) {
  return (
    <div className={`section-head${center ? " section-head--center" : ""}`}>
      <span className={`eyebrow${center ? " eyebrow--center" : ""}`}>{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
      {action}
    </div>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">
            <IcZap size={15} /> Your Complete Technology Partner
          </span>
          <h1 className="hero__headline">
            POWER YOUR <span className="accent">WORLD</span> WITH TECHNOLOGY
          </h1>
          <p className="hero__sub">
            Computers, laptops, gaming, printing, security and accessories — plus professional installation, service and
            support. Everything you need, under one roof.
          </p>
          <div className="hero__cta">
            <Link to="/products" className="btn btn--primary btn--lg">
              Shop Now <IcArrowRight size={18} />
            </Link>
            <Link to="/services" className="btn btn--outline-dark btn--lg">
              Explore Services
            </Link>
          </div>
          <div className="hero__proof">
            <div className="hero__proof-item">
              <b>25,000+</b>
              <span>Happy customers served</span>
            </div>
            <div className="hero__proof-item">
              <b>8,000+</b>
              <span>Installations &amp; repairs</span>
            </div>
            <div className="hero__proof-item">
              <b>12+ yrs</b>
              <span>Trusted since 2014</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="float-ring" />
          <div className="hero-visual__grid">
          <Link className="float-device float-device--1" to="/products/1" tabIndex={-1} aria-hidden="true">
            <ProductImage src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=70" category="computers" alt="Gaming desktop" />
            <span className="float-device__label">
              <span>
                <b>Gaming Desktop</b>
                <br />
                RTX 4070 · Ryzen 7
              </span>
              <IcZap size={14} style={{ color: "#a78bfa" }} />
            </span>
          </Link>
          <Link className="float-device float-device--2" to="/products/4" tabIndex={-1} aria-hidden="true">
            <ProductImage src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=70" category="laptops" alt="Ultrabook laptop" />
            <span className="float-device__label">
              <span>
                <b>Ultrabook Pro</b>
                <br />
                2.8K OLED · 13 hrs
              </span>
            </span>
          </Link>
          <Link className="float-device float-device--3" to="/products/11" tabIndex={-1} aria-hidden="true">
            <ProductImage src="https://images.unsplash.com/photo-1606813901341-1f010828f0d0?auto=format&fit=crop&w=600&q=70" category="gaming" alt="PlayStation 5" />
            <span className="float-device__label">
              <span>
                <b>PlayStation 5</b>
                <br />
                Next-gen gaming
              </span>
            </span>
          </Link>
          <Link className="float-device float-device--4" to="/products/9" tabIndex={-1} aria-hidden="true">
            <ProductImage src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=70" category="cctv" alt="CCTV security camera" />
            <span className="float-device__label">
              <b>CCTV 4MP Kit</b>
            </span>
          </Link>
          </div>
          <span className="float-chip float-chip--a">
            <IcPrinter size={14} /> Printer + Setup
          </span>
          <span className="float-chip float-chip--b">
            <IcWrench size={14} /> Expert Installation
          </span>
          <span className="float-chip float-chip--c">
            <IcHeadset size={14} /> 24×7 Support
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- trust indicators ---------------- */
const TRUST = [
  { icon: IcShield, title: "Quality Products", text: "Genuine, warranty-backed technology products from trusted brands." },
  { icon: IcHeadset, title: "Expert Support", text: "Professional technical assistance from certified specialists." },
  { icon: IcBox, title: "Complete Solutions", text: "Products, installation and support — one partner, one roof." },
  { icon: IcTruck, title: "Fast & Reliable Service", text: "On-time delivery and professional after-sales service." },
];

function TrustIndicators() {
  return (
    <section className="trust-strip">
      <div className="container">
        <div className="trust-grid">
          {TRUST.map((t) => (
            <div className="trust-item" key={t.title}>
              <span className="trust-item__ic">
                <t.icon size={21} />
              </span>
              <div>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- categories ---------------- */
function Categories() {
  return (
    <section className="section section--white">
      <div className="container">
        <SectionHead
          eyebrow="Browse by category"
          title="EXPLORE OUR TECHNOLOGY"
          sub="Everything you need for work, entertainment, security and everyday computing."
          center
        />
        <div className="cat-grid">
          {categories.map((c) => (
            <CategoryCard key={c.key} category={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- featured products ---------------- */
function FeaturedProducts({ products, loading, error, retry }) {
  return (
    <section className="section">
      <div className="container">
        <div className="flex-between" style={{ marginBottom: 34 }}>
          <div>
            <span className="eyebrow">Hand-picked for you</span>
            <h2 className="section-title" style={{ marginBottom: 6 }}>
              TOP PICKS FOR YOU
            </h2>
            <p className="section-sub">Discover technology built for performance.</p>
          </div>
          <Link to="/products" className="btn btn--outline hide-mobile">
            View All Products <IcArrowRight size={15} />
          </Link>
        </div>
        {error ? (
          <ErrorMessage error={error} onRetry={retry} />
        ) : loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <>
            <div className="grid-products">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="flex-center mt-24">
              <Link to="/products" className="btn btn--outline show-mobile">
                View All Products <IcArrowRight size={15} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ---------------- gaming promo ---------------- */
function GamingPromo({ products }) {
  const gaming = products.filter((p) => p.category === "gaming").slice(0, 4);
  return (
    <section className="section--violet" style={{ padding: "92px 0" }}>
      <div className="container">
        <div className="promo promo--gaming">
          <div className="promo__content">
            <span className="eyebrow" style={{ color: "#c084fc" }}>
              <IcGamepad size={15} /> Gaming zone
            </span>
            <h2>LEVEL UP YOUR GAMING</h2>
            <p>
              Powerful gaming PCs, next-generation consoles and premium gaming accessories for your ultimate setup — built,
              installed and optimised by gamers who get it.
            </p>
            <div className="promo__features">
              {["Custom gaming PC builds", "PS5 consoles & accessories", "170 Hz+ gaming monitors", "Keyboards, mice & headsets", "Performance optimisation service"].map((f) => (
                <div className="promo__feature" key={f}>
                  <IcCheck size={17} /> {f}
                </div>
              ))}
            </div>
            <Link to="/products/gaming" className="btn btn--violet btn--lg" style={{ alignSelf: "flex-start" }}>
              ENTER GAMING ZONE <IcArrowRight size={17} />
            </Link>
          </div>
          <div className="promo__visual">
            <ProductImage
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=70"
              category="gaming"
              alt="Premium RGB gaming setup"
              className="cover"
            />
          </div>
        </div>
        {gaming.length > 0 && (
          <div className="grid-products" style={{ marginTop: 26, gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
            {gaming.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- business solutions ---------------- */
function BusinessSolutions() {
  return (
    <section className="section" style={{ paddingBottom: 40 }}>
      <div className="container">
        <div className="promo promo--business">
          <div className="promo__content">
            <span className="eyebrow" style={{ color: "#6fa8ff" }}>
              <IcBuilding size={15} /> For business
            </span>
            <h2>TECHNOLOGY FOR YOUR BUSINESS</h2>
            <p>
              Equip your business with reliable computers, laptops, printers, networking and security solutions — supplied,
              installed and maintained so you can focus on running your company.
            </p>
            <div className="promo__features">
              {["Business desktops & laptops", "Printers with network setup", "CCTV & access security", "IT solutions & maintenance", "On-site support contracts"].map((f) => (
                <div className="promo__feature" key={f}>
                  <IcCheck size={17} /> {f}
                </div>
              ))}
            </div>
            <Link to="/services/request" className="btn btn--white btn--lg" style={{ alignSelf: "flex-start" }}>
              EXPLORE BUSINESS SOLUTIONS <IcArrowRight size={17} />
            </Link>
          </div>
          <div className="promo__visual">
            <ProductImage
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=70"
              category="computers"
              alt="Modern corporate office with computers"
              className="cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CCTV ---------------- */
function SecuritySection() {
  return (
    <section className="section section--navy" style={{ padding: "92px 0" }}>
      <div className="container">
        <div className="split">
          <div>
            <span className="eyebrow" style={{ color: "#35e0c4" }}>
              <IcCamera size={15} /> Surveillance solutions
            </span>
            <h2 className="title-xl" style={{ marginBottom: 14 }}>
              SECURE WHAT MATTERS
            </h2>
            <p className="lead" style={{ color: "#b9c6e6" }}>
              Professional CCTV and security solutions for homes, offices and businesses — with cameras, DVR/NVR recorders,
              remote viewing and ongoing maintenance from our certified security team.
            </p>
            <div className="promo__features" style={{ marginTop: 24 }}>
              {["HD & 4K CCTV cameras", "DVR / NVR recorders", "Professional installation", "Mobile remote viewing setup", "Maintenance & upgrades"].map((f) => (
                <div className="promo__feature" style={{ color: "#cfe6ff" }} key={f}>
                  <IcCheck size={17} /> {f}
                </div>
              ))}
            </div>
            <Link to="/products/cctv" className="btn btn--primary btn--lg mt-24" style={{ background: "#0d9488", boxShadow: "0 10px 26px -10px rgba(13,148,136,.6)" }}>
              EXPLORE SECURITY SOLUTIONS <IcArrowRight size={17} />
            </Link>
          </div>
          <div className="promo promo--cctv" style={{ minHeight: 460 }}>
            <div className="promo__visual">
              <ProductImage
                src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1100&q=70"
                category="cctv"
                alt="CCTV camera monitoring a building"
                className="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- services & support ---------------- */
function ServicesSection({ serviceData }) {
  return (
    <section className="section section--tint">
      <div className="container">
        <SectionHead
          eyebrow="Services & support"
          title="MORE THAN JUST TECHNOLOGY. WE KEEP IT RUNNING."
          sub="From installation and configuration to maintenance, repairs and technical support, Jerry Computers is with you long after your purchase."
          center
        />
        <div className="grid-cards">
          {serviceData
            .filter((s) => s.key !== "other")
            .map((s) => (
              <ServiceCard key={s.key} service={s} />
            ))}
        </div>
        <div className="flex-center mt-32">
          <Link to="/services" className="btn btn--dark">
            View All Services &amp; Request One <IcArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- after-sales cycle ---------------- */
const CYCLE = [
  { icon: IcBag, step: "BUY", text: "Pick genuine technology from a partner you can trust." },
  { icon: IcWrench, step: "INSTALL", text: "We install, configure and set everything up for you." },
  { icon: IcHeadset, step: "SUPPORT", text: "Real humans help whenever your technology misbehaves." },
  { icon: IcSettings, step: "MAINTAIN", text: "Preventive care keeps your systems running for years." },
];

function AfterSales() {
  return (
    <section className="section section--navy">
      <div className="container">
        <SectionHead
          eyebrow="After-sales promise"
          title="WE DON'T DISAPPEAR AFTER THE SALE."
          sub="Your relationship with Jerry Computers doesn't end when your order arrives. Our team provides installation, technical support, maintenance and troubleshooting to help keep your technology running smoothly."
          center
        />
        <div className="cycle">
          <div className="cycle__steps">
            {CYCLE.map((c) => (
              <div className="cycle-step" key={c.step}>
                <span className="cycle-step__num">
                  <c.icon size={30} />
                </span>
                <h3>{c.step}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-center mt-40" style={{ gap: 12 }}>
          <Link to="/services/request" className="btn btn--primary btn--lg">
            Request a Service
          </Link>
          <Link to="/support" className="btn btn--outline-dark btn--lg">
            Get Support
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- why jerry ---------------- */
const WHY = [
  { icon: IcShield, title: "Genuine & Warranty-Backed", text: "Every product is genuine, invoiced and covered by manufacturer + Jerry service warranty." },
  { icon: IcUsers, title: "Certified Technicians", text: "Trained, background-verified technicians handle every installation and repair." },
  { icon: IcLifeBuoy, title: "One Partner for Everything", text: "Store, service centre and support desk — buy, install and maintain in one place." },
  { icon: IcTag, title: "Honest Pricing", text: "Clear pricing on products and services. No hidden charges, ever." },
  { icon: IcZap, title: "Fast Turnaround", text: "Most repairs completed same-day or within 48 hours with genuine parts." },
  { icon: IcMail, title: "We Follow Up", text: "After every job we check in — your technology staying healthy is our business." },
];

function WhyJerry() {
  return (
    <section className="section section--white">
      <div className="container">
        <SectionHead
          eyebrow="The Jerry difference"
          title="WHY JERRY COMPUTERS?"
          sub="We're not just a shop. We're the technology partner your home and business can rely on."
          center
        />
        <div className="grid-3">
          {WHY.map((w) => (
            <div className="service-card" key={w.title} style={{ padding: 24 }}>
              <span className="service-card__ic" style={{ background: "var(--primary-050)", color: "var(--primary)", width: 46, height: 46 }}>
                <w.icon size={21} />
              </span>
              <h3 style={{ fontSize: 16 }}>{w.title}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- brands ---------------- */
function Brands() {
  return (
    <section className="section section--tint" style={{ padding: "64px 0" }}>
      <div className="container">
        <SectionHead eyebrow="Brands we carry" title="TRUSTED BRANDS, ONE ROOF" center />
        <div className="brands-strip">
          {["HP", "DELL", "Lenovo", "ASUS", "Acer", "Canon", "EPSON", "Logitech", "SAMSUNG", "TP-LINK", "HIKVISION", "Dahua", "Sony"].map((b) => (
            <span className="brand-logo" key={b}>
              <IcSparkles size={13} /> {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- deals ---------------- */
function Deals({ products }) {
  const deals = products.filter((p) => p.tags?.includes("deal")).slice(0, 4);
  return (
    <section className="section" style={{ paddingTop: 20 }}>
      <div className="container">
        <div className="flex-between">
          <div>
            <span className="eyebrow">Limited-time offers</span>
            <h2 className="section-title" style={{ marginBottom: 6 }}>
              TODAY'S TECHNOLOGY DEALS
            </h2>
            <p className="section-sub">Real discounts on real technology — while stock lasts.</p>
          </div>
          <Link to="/products?deals=1" className="btn btn--outline hide-mobile">
            All Deals <IcArrowRight size={15} />
          </Link>
        </div>
        <div className="grid-products mt-24">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} className="deal-card" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- newsletter ---------------- */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr("");
    setDone(true);
  };
  return (
    <section className="section section--tint" style={{ paddingTop: 30 }}>
      <div className="container">
        <div className="newsletter">
          <div className="newsletter__inner">
            <div>
              <span className="eyebrow" style={{ color: "#8fb4ff" }}>
                <IcMail size={15} /> Newsletter
              </span>
              <h2>STAY AHEAD OF TECHNOLOGY</h2>
              <p>Get product updates, exclusive deals and technology news from Jerry Computers.</p>
              <div className="newsletter__perks">
                <span>
                  <IcCheck size={14} /> Exclusive member deals
                </span>
                <span>
                  <IcCheck size={14} /> New arrivals first
                </span>
                <span>
                  <IcCheck size={14} /> No spam, ever
                </span>
              </div>
            </div>
            <div>
              {done ? (
                <div className="alert alert--success" role="status" style={{ background: "rgba(22,163,74,.14)", color: "#bdf3d2", border: "1px solid rgba(74,222,128,.4)" }}>
                  <IcCheckCircle size={19} />
                  <span>
                    <b>You're subscribed!</b> Thanks for joining the Jerry Computers tech newsletter.
                  </span>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <div className="newsletter__form">
                    <div style={{ flex: 1 }}>
                      <label htmlFor="newsletter-email" className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                        Email address
                      </label>
                      <input id="newsletter-email" className="input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(err)} />
                    </div>
                    <button className="btn btn--primary btn--lg" type="submit">
                      Subscribe
                    </button>
                  </div>
                  {err && <p style={{ color: "#fda4af", fontSize: 13, margin: "8px 0 0" }}>{err}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOME
   ============================================================ */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceData, setServiceData] = useState(serviceCategories);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, svc] = await Promise.all([getProducts({ pageSize: 30 }), getServiceCategories()]);
      setProducts(p.results || []);
      setServiceData(svc && svc.length ? svc : serviceCategories);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featured = products.length
    ? [...products].sort((a, b) => (b.tags?.includes("bestseller") ? 1 : 0) - (a.tags?.includes("bestseller") ? 1 : 0) || b.rating - a.rating)
    : [];
  const homeProducts = products.length ? products : [];

  return (
    <>
      <Hero />
      <TrustIndicators />
      <Categories />
      <FeaturedProducts products={featured} loading={loading} error={error} retry={load} />
      <GamingPromo products={homeProducts} />
      <BusinessSolutions />
      <SecuritySection />
      <ServicesSection serviceData={serviceData} />
      <AfterSales />
      <WhyJerry />
      <Brands />
      <Deals products={homeProducts} />
      <Newsletter />
    </>
  );
}
