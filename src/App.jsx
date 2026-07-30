import { useState, useRef, useEffect } from "react";

const FIELErr = { email: "", password: "", confirm: "", name: "" };

export default function AuthPage({ onLogin, onSignup, onForgot, onOAuth }) {
  const [view, setView] = useState("login"); // 'login' | 'signup' | 'forgot'
  const [direction, setDirection] = useState("fwd");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState(FIELErr);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const firstFieldRef = useRef(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    setNotice("");
  }, [view]);

  const go = (next) => {
    const order = ["login", "signup", "forgot"];
    setDirection(order.indexOf(next) >= order.indexOf(view) ? "fwd" : "back");
    setErrors(FIELErr);
    setView(next);
  };

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = { ...FIELErr };
    let ok = true;

    if (view !== "forgot" && !validateEmail(form.email)) {
      next.email = "Enter a valid email address";
      ok = false;
    } else if (view === "forgot" && !validateEmail(form.email)) {
      next.email = "Enter a valid email address";
      ok = false;
    }
    if (view !== "forgot" && form.password.length < 6) {
      next.password = "At least 6 characters";
      ok = false;
    }
    if (view === "signup") {
      if (!form.name.trim()) {
        next.name = "Enter your name";
        ok = false;
      }
      if (form.confirm !== form.password) {
        next.confirm = "Passwords don't match";
        ok = false;
      }
    }

    setErrors(next);
    if (!ok) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (view === "login") onLogin?.(form);
      if (view === "signup") onSignup?.(form);
      if (view === "forgot") {
        onForgot?.(form);
        setNotice(`Reset link sent to ${form.email}`);
      }
    }, 700);
  };

  const heading = {
    login: { title: "Welcome back", sub: "Sign in to pick up where you left off." },
    signup: { title: "Create your account", sub: "Takes less than a minute." },
    forgot: { title: "Reset your password", sub: "We'll email you a link to get back in." },
  }[view];

  return (
    <div className="ap-root">
      <style>{CSS}</style>

      <div className="ap-side" aria-hidden="true">
        <div className="ap-side-glow" />
        <div className="ap-side-content">
          <div className="ap-mark">
            <span className="ap-mark-dot" />
            Jeri Computers
          </div>
          <h1>Power Your Digital Life with<br />Jeri Computers.</h1>
          <p>Browse premium laptops, desktops, components, peripherals, and accessories with secure shopping and fast delivery—all from Jeri Computers.</p>
          <div className="ap-side-foot">
            <div className="ap-avatars">
              <span /><span /><span /><span />
            </div>
            <span className="ap-side-foot-text">Thousands of products. One trusted store.</span>
          </div>
        </div>
      </div>

      <div className="ap-panel">
        <div className={`ap-card ap-anim-${direction}`} key={view}>
          <div className="ap-tabs">
            <button
              className={view === "login" ? "active" : ""}
              onClick={() => go("login")}
              type="button"
            >
              Log in
            </button>
            <button
              className={view === "signup" ? "active" : ""}
              onClick={() => go("signup")}
              type="button"
            >
              Sign up
            </button>
            <span className={`ap-tab-indicator ap-tab-${view === "forgot" ? "login" : view}`} />
          </div>

          <h2 className="ap-title">{heading.title}</h2>
          <p className="ap-sub">{heading.sub}</p>

          {view !== "forgot" && (
            <div className="ap-oauth-row">
              <button type="button" className="ap-oauth" onClick={() => onOAuth?.("google")}>
                <GoogleIcon /> Google
              </button>
            </div>
          )}

          {view !== "forgot" && (
            <div className="ap-divider">
              <span />
              <em>or continue with email</em>
              <span />
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {view === "signup" && (
              <Field
                label="Full name"
                error={errors.name}
                inputRef={firstFieldRef}
                value={form.name}
                onChange={update("name")}
                autoComplete="name"
                type="text"
              />
            )}

            <Field
              label="Email"
              error={errors.email}
              inputRef={view !== "signup" ? firstFieldRef : null}
              value={form.email}
              onChange={update("email")}
              autoComplete="email"
              type="email"
            />

            {view !== "forgot" && (
              <Field
                label="Password"
                error={errors.password}
                value={form.password}
                onChange={update("password")}
                autoComplete={view === "signup" ? "new-password" : "current-password"}
                type={showPass ? "text" : "password"}
                trailing={
                  <button
                    type="button"
                    className="ap-eye"
                    onClick={() => setShowPass((s) => !s)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />
            )}

            {view === "signup" && (
              <Field
                label="Confirm password"
                error={errors.confirm}
                value={form.confirm}
                onChange={update("confirm")}
                autoComplete="new-password"
                type={showPass ? "text" : "password"}
              />
            )}

            {view === "login" && (
              <div className="ap-row-between">
                <label className="ap-check">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="ap-link" onClick={() => go("forgot")}>
                  Forgot password?
                </button>
              </div>
            )}

            {notice && <div className="ap-notice">{notice}</div>}

            <button className="ap-submit" type="submit" disabled={loading}>
              {loading ? (
                <span className="ap-spinner" />
              ) : view === "login" ? (
                "Log in"
              ) : view === "signup" ? (
                "Create account"
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <p className="ap-switch">
            {view === "login" && (
              <>Don't have an account? <button type="button" onClick={() => go("signup")}>Sign up</button></>
            )}
            {view === "signup" && (
              <>Already have an account? <button type="button" onClick={() => go("login")}>Log in</button></>
            )}
            {view === "forgot" && (
              <>Remembered it? <button type="button" onClick={() => go("login")}>Back to log in</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, value, onChange, type, autoComplete, trailing, inputRef }) {
  return (
    <div className="ap-field">
      <label>{label}</label>
      <div className={`ap-input-wrap ${error ? "err" : ""}`}>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
        />
        {trailing}
      </div>
      <span className="ap-error">{error || "\u00A0"}</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 009 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.9A9 9 0 000 9c0 1.45.35 2.83.9 4.03l3.05-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.6 21.6 0 015.06-6.06M9.9 4.24A10.4 10.4 0 0112 4c7 0 11 7 11 7a21.7 21.7 0 01-3.22 4.24M14.12 14.12a3 3 0 11-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

.ap-root {
  --bg: #0a0b0f;
  --panel: #ffffff;
  --surface: #14161d;
  --surface-2: #1b1e27;
  --border: #262933;
  --text: #eef0f3;
  --text-dim: #171a20;
  --muted: #8a8f98;
  --accent: #7c5cfc;
  --accent-2: #33d6b0;
  --error: #ff6b6b;

  display: grid;
  grid-template-columns: 1.05fr 1fr;
  min-height: 100vh;
  background: var(--panel);
  font-family: 'Inter', -apple-system, sans-serif;
  color: var(--text-dim);
}

@media (max-width: 860px) {
  .ap-root { grid-template-columns: 1fr; }
  .ap-side { display: none; }
}

/* Left showcase panel */
.ap-side {
  position: relative;
  background: var(--bg);
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 56px;
}
.ap-side-glow {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(38% 45% at 20% 20%, rgba(124,92,252,0.35), transparent 60%),
    radial-gradient(45% 50% at 85% 75%, rgba(51,214,176,0.22), transparent 60%);
  filter: blur(40px);
  animation: apDrift 18s ease-in-out infinite alternate;
}
@keyframes apDrift {
  0% { transform: translate3d(0,0,0) scale(1); }
  100% { transform: translate3d(2%, -3%, 0) scale(1.06); }
}
.ap-side-content { position: relative; z-index: 1; color: #f5f4ff; max-width: 440px; }
.ap-mark {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px;
  color: #cfd0ff; letter-spacing: 0.02em; margin-bottom: 48px;
}
.ap-mark-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-2); box-shadow: 0 0 12px var(--accent-2); }
.ap-side-content h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 42px; line-height: 1.12; font-weight: 700;
  margin: 0 0 18px; letter-spacing: -0.01em;
}
.ap-side-content p { font-size: 16px; line-height: 1.6; color: #b8b9d6; margin: 0 0 40px; }
.ap-side-foot { display: flex; align-items: center; gap: 14px; }
.ap-avatars { display: flex; }
.ap-avatars span {
  width: 30px; height: 30px; border-radius: 50%; margin-left: -8px;
  border: 2px solid var(--bg);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}
.ap-avatars span:first-child { margin-left: 0; }
.ap-side-foot-text { font-size: 13px; color: #8b8db3; }

/* Right auth panel */
.ap-panel {
  display: flex; align-items: center; justify-content: center;
  padding: 32px; background: var(--panel);
}
.ap-card { width: 100%; max-width: 380px; }

.ap-anim-fwd { animation: apInFwd 0.36s cubic-bezier(.2,.8,.2,1); }
.ap-anim-back { animation: apInBack 0.36s cubic-bezier(.2,.8,.2,1); }
@keyframes apInFwd { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }
@keyframes apInBack { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: translateX(0); } }

.ap-tabs {
  position: relative;
  display: flex; gap: 4px;
  background: #f1f1f5; border-radius: 12px; padding: 4px;
  margin-bottom: 28px;
}
.ap-tabs button {
  flex: 1; z-index: 1;
  background: transparent; border: none; cursor: pointer;
  padding: 9px 0; font-size: 14px; font-weight: 600;
  font-family: 'Inter', sans-serif; color: var(--muted);
  border-radius: 9px; transition: color 0.2s ease;
}
.ap-tabs button.active { color: #14161d; }
.ap-tab-indicator {
  position: absolute; top: 4px; bottom: 4px; left: 4px;
  width: calc(50% - 4px);
  background: #fff; border-radius: 9px;
  box-shadow: 0 1px 3px rgba(20,22,29,0.12);
  transition: transform 0.28s cubic-bezier(.2,.8,.2,1);
}
.ap-tab-signup { transform: translateX(100%); }

.ap-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 26px; font-weight: 700; margin: 0 0 6px; letter-spacing: -0.01em;
}
.ap-sub { font-size: 14.5px; color: var(--muted); margin: 0 0 24px; }

.ap-oauth-row { display: flex; gap: 10px; margin-bottom: 18px; }
.ap-oauth {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 0; border: 1px solid #e4e4ea; border-radius: 10px;
  background: #fff; font-size: 14px; font-weight: 500; color: #14161d;
  cursor: pointer; transition: border-color 0.15s ease, transform 0.15s ease;
}
.ap-oauth:hover { border-color: #c9c9d6; transform: translateY(-1px); }
.ap-oauth:active { transform: translateY(0); }

.ap-divider { display: flex; align-items: center; gap: 10px; margin: 4px 0 20px; }
.ap-divider span { flex: 1; height: 1px; background: #e7e7ee; }
.ap-divider em { font-style: normal; font-size: 12px; color: var(--muted); white-space: nowrap; }

.ap-field { margin-bottom: 15px; }
.ap-field label {
  display: block; font-size: 13px; font-weight: 600; color: #4b4d57; margin-bottom: 6px;
}
.ap-input-wrap {
  display: flex; align-items: center;
  border: 1.5px solid #e4e4ea; border-radius: 10px; background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.ap-input-wrap:focus-within { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(124,92,252,0.13); }
.ap-input-wrap.err { border-color: var(--error); }
.ap-input-wrap input {
  flex: 1; border: none; outline: none; background: transparent;
  padding: 11px 14px; font-size: 14.5px; font-family: 'Inter', sans-serif; color: #14161d;
}
.ap-eye { background: none; border: none; padding: 0 12px; color: var(--muted); cursor: pointer; display: flex; }
.ap-eye:hover { color: #14161d; }
.ap-error { display: block; font-size: 12px; color: var(--error); margin-top: 4px; min-height: 16px; }

.ap-row-between { display: flex; align-items: center; justify-content: space-between; margin: 2px 0 20px; }
.ap-check { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #4b4d57; cursor: pointer; }
.ap-link {
  background: none; border: none; padding: 0; font-size: 13px; font-weight: 600;
  color: var(--accent); cursor: pointer;
}
.ap-link:hover { text-decoration: underline; }

.ap-notice {
  background: rgba(51,214,176,0.12); color: #12876c;
  border: 1px solid rgba(51,214,176,0.3); border-radius: 10px;
  padding: 10px 12px; font-size: 13px; margin-bottom: 16px;
}

.ap-submit {
  width: 100%; border: none; border-radius: 10px; cursor: pointer;
  padding: 12px 0; font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
  color: #fff; background: linear-gradient(135deg, var(--accent), #6947f0);
  box-shadow: 0 8px 20px -8px rgba(124,92,252,0.6);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  display: flex; align-items: center; justify-content: center; min-height: 46px;
}
.ap-submit:hover { transform: translateY(-1px); box-shadow: 0 10px 24px -8px rgba(124,92,252,0.7); }
.ap-submit:active { transform: translateY(0); }
.ap-submit:disabled { opacity: 0.75; cursor: default; transform: none; }

.ap-spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.35); border-top-color: #fff;
  animation: apSpin 0.7s linear infinite;
}
@keyframes apSpin { to { transform: rotate(360deg); } }

.ap-switch { text-align: center; font-size: 13.5px; color: var(--muted); margin-top: 22px; }
.ap-switch button {
  background: none; border: none; padding: 0; font-weight: 600;
  color: #14161d; cursor: pointer;
}
.ap-switch button:hover { color: var(--accent); }

@media (prefers-reduced-motion: reduce) {
  .ap-anim-fwd, .ap-anim-back, .ap-side-glow, .ap-spinner { animation: none; }
}
`;
