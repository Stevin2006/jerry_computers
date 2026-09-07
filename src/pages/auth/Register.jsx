import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { IcEye, IcEyeOff, IcAlertCircle, IcCheckCircle, IcUserPlus } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const strength = () => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 3) errs.name = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!/^[+]?[\d\s-]{10,15}$/.test(form.phone.trim())) errs.phone = "Enter a valid phone number";
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/\d/.test(form.password))
      errs.password = "Use 8+ characters with upper & lower case and a number";
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix the highlighted fields.", "Check your details");
      return;
    }
    setBusy(true);
    try {
      const res = await register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password });
      const payload = { email: (res.email || form.email).trim().toLowerCase(), purpose: "register" };
      try {
        sessionStorage.setItem("jc_pending_auth", JSON.stringify(payload));
      } catch {
        /* noop */
      }
      toast.info("We've sent a 6-digit code to your email. Verify to activate your account.", "Check your inbox");
      navigate("/verify-otp", { state: payload });
    } catch (err) {
      toast.error(err?.message || "Registration failed. Please try again.", "Unable to register");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout quote={<>Create an account — <span>track orders, services and support</span> in one place.</>}>
      <div className="auth__card">
        <h1>CREATE YOUR ACCOUNT</h1>
        <p className="sub">Join Jerry Computers and manage everything in one place.</p>

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label className="label" htmlFor="reg-name">
              Full Name <span className="req">*</span>
            </label>
            <input id="reg-name" className="input" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            {errors.name && <span className="field-error"><IcAlertCircle size={13} /> {errors.name}</span>}
          </div>
          <div className="field">
            <label className="label" htmlFor="reg-email">
              Email <span className="req">*</span>
            </label>
            <input id="reg-email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            {errors.email && <span className="field-error"><IcAlertCircle size={13} /> {errors.email}</span>}
          </div>
          <div className="field">
            <label className="label" htmlFor="reg-phone">
              Phone <span className="req">*</span>
            </label>
            <input id="reg-phone" type="tel" className="input" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
            {errors.phone && <span className="field-error"><IcAlertCircle size={13} /> {errors.phone}</span>}
          </div>
          <div className="field-row">
            <div className="field">
              <label className="label" htmlFor="reg-pass">
                Password <span className="req">*</span>
              </label>
              <input id="reg-pass" type={show ? "text" : "password"} className="input" placeholder="Min 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
              {errors.password ? (
                <span className="field-error"><IcAlertCircle size={13} /> {errors.password}</span>
              ) : (
                form.password && (
                  <div className="hint flex-align" style={{ gap: 8, marginTop: 8 }}>
                    <div className="pct-bar" style={{ flex: 1, maxWidth: 140 }}>
                      <span style={{ width: `${(strength() / 4) * 100}%`, background: ["var(--danger)", "#f59e0b", "#eab308", "var(--success)"][strength() - 1] || "var(--line)" }} />
                    </div>
                    {strength() >= 3 ? <IcCheckCircle size={15} style={{ color: "var(--success)" }} /> : <span className="tiny">Strength: {["Weak", "Fair", "Good", "Strong"][Math.max(0, strength() - 1)]}</span>}
                  </div>
                )
              )}
            </div>
            <div className="field">
              <label className="label" htmlFor="reg-confirm">
                Confirm Password <span className="req">*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input id="reg-confirm" type={show ? "text" : "password"} className="input" style={{ paddingRight: 44 }} placeholder="Repeat password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} autoComplete="new-password" />
                <button type="button" className="icon-btn" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide passwords" : "Show passwords"} style={{ position: "absolute", right: 2, top: 2, width: 38, height: 38 }}>
                  {show ? <IcEyeOff size={17} /> : <IcEye size={17} />}
                </button>
              </div>
              {errors.confirm && <span className="field-error"><IcAlertCircle size={13} /> {errors.confirm}</span>}
            </div>
          </div>

          <button className="btn btn--primary btn--lg btn--block" disabled={busy} type="submit">
            {busy ? (
              <>
                <span className="spinner" /> Creating account…
              </>
            ) : (
              <>
                <IcUserPlus size={17} /> Create Account
              </>
            )}
          </button>
        </form>

        <p className="auth__foot">
          Already registered? <Link to="/login">Log in</Link>
        </p>
        <p className="hint text-center" style={{ maxWidth: 360, margin: "0 auto" }}>
          By registering you agree to Jerry Computers' terms. All accounts are created with the <b>Customer</b> role — no
          role selection is available or needed.
        </p>
      </div>
    </AuthLayout>
  );
}
