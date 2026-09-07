import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { IcEye, IcEyeOff, IcLogIn, IcAlertCircle, IcLock } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { config } from "@/config";

const demo = [
  { role: "Customer", email: "user@jerry.com", password: "User@123" },
  { role: "Administrator", email: "admin@jerry.com", password: "Admin@123" },
];

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const from = location.state?.from;
  if (from) {
    try {
      sessionStorage.setItem("jc_after_login", from);
    } catch {
      /* noop */
    }
  }

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Enter your password";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const res = await login(form);
      const email = res.email || form.email;
      const payload = { email, purpose: "login" };
      try {
        sessionStorage.setItem("jc_pending_auth", JSON.stringify(payload));
      } catch {
        /* noop */
      }
      toast.info("A 6-digit verification code was sent to your email.", "Check your inbox");
      navigate("/verify-otp", { state: payload });
    } catch (err) {
      toast.error(err?.message || "Login failed. Please try again.", "Unable to log in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout quote={<>Welcome back. <span>Log in</span> to your Jerry Computers account.</>}>
      <div className="auth__card">
        <h1>LOG IN</h1>
        <p className="sub">Access your orders, services and support tickets.</p>

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label className="label" htmlFor="login-email">
              Email <span className="req">*</span>
            </label>
            <div className="input-icon">
              <IcLock size={15} />
              <input id="login-email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            </div>
            {errors.email && <span className="field-error"><IcAlertCircle size={13} /> {errors.email}</span>}
          </div>
          <div className="field">
            <label className="label" htmlFor="login-pass">
              Password <span className="req">*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input id="login-pass" type={show ? "text" : "password"} className="input" style={{ paddingRight: 44 }} placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
              <button type="button" className="icon-btn" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} style={{ position: "absolute", right: 2, top: 2, width: 38, height: 38 }}>
                {show ? <IcEyeOff size={17} /> : <IcEye size={17} />}
              </button>
            </div>
            {errors.password && <span className="field-error"><IcAlertCircle size={13} /> {errors.password}</span>}
          </div>

          <button className="btn btn--primary btn--lg btn--block" disabled={busy} type="submit">
            {busy ? (
              <>
                <span className="spinner" /> Sending verification code…
              </>
            ) : (
              <>
                <IcLogIn size={17} /> Log In
              </>
            )}
          </button>
        </form>

        <p className="auth__foot">
          New to Jerry Computers? <Link to="/register">Create an account</Link>
        </p>

        {config.useMock && (
          <div className="auth__switch">
            <div style={{ flex: 1 }}>
              <b>Demo mode</b> — try a ready account (no real email needed):
              <div className="flex-align wrap mt-8" style={{ gap: 8 }}>
                {demo.map((d) => (
                  <button
                    key={d.role}
                    className="btn btn--soft btn--sm"
                    onClick={() => {
                      setForm({ email: d.email, password: d.password });
                      toast.info(`${d.role} credentials filled — press Log In.`);
                    }}
                  >
                    {d.role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
