import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageHead from "@/components/PageHead";
import { IcWrench, IcCheckCircle, IcHeadset, IcClock, IcShield, IcArrowRight } from "@/components/Icons";
import { requestService } from "@/api/serviceApi";
import { getServiceCategories } from "@/api/serviceApi";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cx } from "@/lib/utils";

const TIME_SLOTS = ["9:00 AM – 12:00 PM", "12:00 PM – 3:00 PM", "3:00 PM – 6:00 PM", "6:00 PM – 8:00 PM"];

export default function ServiceRequest() {
  const [params] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    category: params.get("category") || "computer",
    productType: "",
    deviceName: params.get("product") ? decodeURIComponent(params.get("product")) : "",
    description: "",
    preferredDate: "",
    preferredTime: "9:00 AM – 12:00 PM",
    address: user?.address ? `${user.address.line}, ${user.address.city}, ${user.address.state} — ${user.address.pincode}` : "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getServiceCategories()
      .then((res) => setCategories(res && res.length ? res : []))
      .catch(() => setCategories([]));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.phone || !/^[+]?[\d\s-]{10,15}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.category) e.category = "Select a service category";
    if (!form.description.trim() || form.description.trim().length < 20) e.description = "Describe the issue in at least 20 characters";
    if (!form.preferredDate) e.preferredDate = "Pick a preferred date";
    else if (new Date(form.preferredDate) < new Date(new Date().toDateString())) e.preferredDate = "Date cannot be in the past";
    if (!form.address.trim()) e.address = "We need an address for the visit";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.", "Check your details");
      return;
    }
    setBusy(true);
    try {
      const data = await requestService(form);
      const id = (data && data.request && data.request.id) || "SRV-0000";
      try {
        localStorage.setItem("jc_last_service", id);
      } catch {
        /* noop */
      }
      toast.success("Your service request has been submitted.", "Service Request Received");
      navigate("/services/request/success", { state: { id } });
    } catch (err) {
      toast.error(err?.message || "Could not submit your request.", "Submission failed");
    } finally {
      setBusy(false);
    }
  };

  const steps = [
    { title: "Tell us the problem", text: "Describe your device and what's wrong." },
    { title: "Choose a time", text: "Pick a preferred date and time slot." },
    { title: "We confirm & schedule", text: "Our team calls to confirm and assign a technician." },
    { title: "We fix it", text: "Technician completes the job and follows up." },
  ];

  const selectedCategory = categories.find((c) => c.key === form.category);

  return (
    <div className="page">
      <PageHead
        dark
        eyebrow="Book a technician"
        title="REQUEST A SERVICE"
        sub="Installation, repair, maintenance or support — tell us what you need and our team will take care of it."
        crumb="Home"
        crumbs={[{ label: "Services", to: "/services" }, { label: "Request" }]}
      />
      <section className="section section--tight">
        <div className="container">
          <form className="req-layout" onSubmit={submit} noValidate>
            <div className="card card--pad" style={{ display: "grid", gap: 0 }}>
              <h3 style={{ fontSize: 18, marginTop: 0 }} className="flex-align">
                <IcWrench size={19} style={{ color: "var(--primary)" }} /> Service details
              </h3>

              <div className="field-row">
                <div className="field">
                  <label className="label" htmlFor="sr-name">
                    Full Name <span className="req">*</span>
                  </label>
                  <input id="sr-name" className="input" value={form.fullName} onChange={set("fullName")} placeholder="Your full name" />
                  {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                </div>
                <div className="field">
                  <label className="label" htmlFor="sr-email">
                    Email <span className="req">*</span>
                  </label>
                  <input id="sr-email" type="email" className="input" value={form.email} onChange={set("email")} placeholder="you@example.com" />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label className="label" htmlFor="sr-phone">
                    Phone <span className="req">*</span>
                  </label>
                  <input id="sr-phone" className="input" value={form.phone} onChange={set("phone")} placeholder="+91 …" />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="field">
                  <label className="label" htmlFor="sr-cat">
                    Service Category <span className="req">*</span>
                  </label>
                  <select id="sr-cat" className="select" value={form.category} onChange={set("category")}>
                    {(categories.length ? categories : []).map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="field-error">{errors.category}</span>}
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="sr-ptype">
                  Product Type
                </label>
                <input id="sr-ptype" className="input" value={form.productType} onChange={set("productType")} placeholder="e.g. Desktop, Laptop, Printer, CCTV camera, PS5…" list="product-types" />
                {selectedCategory?.items && (
                  <datalist id="product-types">
                    {selectedCategory.items.map((it) => (
                      <option key={it.name} value={it.name} />
                    ))}
                  </datalist>
                )}
              </div>

              <div className="field">
                <label className="label" htmlFor="sr-device">
                  Product / Device Name <span className="req">*</span>
                </label>
                <input id="sr-device" className="input" value={form.deviceName} onChange={set("deviceName")} placeholder="e.g. Dell Inspiron 15, PrintJet ink tank printer…" />
              </div>

              <div className="field">
                <label className="label" htmlFor="sr-desc">
                  Problem Description <span className="req">*</span>
                </label>
                <textarea id="sr-desc" className="textarea" value={form.description} onChange={set("description")} placeholder="What's happening? Since when? Any error messages?" rows={4} />
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="label" htmlFor="sr-date">
                    Preferred Date <span className="req">*</span>
                  </label>
                  <input id="sr-date" type="date" className="input" value={form.preferredDate} min={new Date().toISOString().slice(0, 10)} onChange={set("preferredDate")} />
                  {errors.preferredDate && <span className="field-error">{errors.preferredDate}</span>}
                </div>
                <div className="field">
                  <label className="label" htmlFor="sr-time">
                    Preferred Time
                  </label>
                  <select id="sr-time" className="select" value={form.preferredTime} onChange={set("preferredTime")}>
                    {TIME_SLOTS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="sr-addr">
                  Address <span className="req">*</span>
                </label>
                <textarea id="sr-addr" className="textarea" rows={2} value={form.address} onChange={set("address")} placeholder="House / office address for the visit" />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>

              <div className="field">
                <label className="label" htmlFor="sr-notes">
                  Additional Notes
                </label>
                <textarea id="sr-notes" className="textarea" rows={2} value={form.notes} onChange={set("notes")} placeholder="Anything else we should know? (optional)" />
              </div>

              <div className="flex-between">
                <span className="muted small">
                  <IcShield size={14} /> Technician visit charges are confirmed before scheduling.
                </span>
                <button className="btn btn--primary btn--lg" disabled={busy} type="submit">
                  {busy ? (
                    <>
                      <span className="spinner" /> Submitting…
                    </>
                  ) : (
                    <>
                      SUBMIT SERVICE REQUEST <IcArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
              {!isAuthenticated && (
                <p className="muted tiny mt-12" style={{ marginBottom: 0 }}>
                  Submitting as guest — you'll receive updates by email.{" "}
                  <Link to={`/login?next=${encodeURIComponent("/my-services")}`}>Log in</Link> to track requests online.
                </p>
              )}
            </div>

            {/* sidebar */}
            <aside className="req-steps">
              <div className="card card--pad" style={{ position: "sticky", top: "calc(var(--header-h) + 18px)" }}>
                <h3 style={{ fontSize: 16, marginTop: 0 }}>What happens next</h3>
                {steps.map((s, i) => (
                  <div className={cx("req-step", i === 0 && "req-step--active")} key={s.title}>
                    <span className="req-step__dot">{i + 1}</span>
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.text}</p>
                    </div>
                  </div>
                ))}
                <hr className="divider" />
                <div className="flex-align" style={{ gap: 10, alignItems: "flex-start" }}>
                  <IcHeadset size={20} style={{ color: "var(--primary)", flex: "0 0 auto" }} />
                  <p className="small" style={{ color: "var(--ink-2)", margin: 0 }}>
                    Prefer to talk? Call us at <b>+91 44 4266 9000</b> (Mon–Sat, 9:30 AM – 8 PM).
                  </p>
                </div>
                <div className="flex-align mt-12" style={{ gap: 10, alignItems: "flex-start" }}>
                  <IcClock size={20} style={{ color: "var(--primary)", flex: "0 0 auto" }} />
                  <p className="small" style={{ color: "var(--ink-2)", margin: 0 }}>
                    Most requests are confirmed within <b>2 business hours</b>.
                  </p>
                </div>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </div>
  );
}
