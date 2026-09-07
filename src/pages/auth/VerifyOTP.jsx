import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import OTPInput from "@/components/OTPInput";
import { IcShieldCheck, IcAlertCircle, IcArrowRight, IcMail, IcRefresh } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getDemoOtp } from "@/api/authApi";
import { config } from "@/config";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyLoginOTP, verifyRegistrationOTP, resendOtp } = useAuth();
  const toast = useToast();

  const stored = useRef(null);
  try {
    stored.current = sessionStorage.getItem("jc_pending_auth");
  } catch {
    /* noop */
  }
  const pending = location.state || (stored.current ? JSON.parse(stored.current) : null);
  const purpose = pending?.purpose === "register" ? "register" : "login";
  const email = pending?.email || "";

  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(45);
  const [resending, setResending] = useState(false);
  const [demoOtp, setDemoOtp] = useState(null);

  const fetchDemo = useCallback(async () => {
    if (!config.useMock || !config.showMockOtp) return;
    try {
      const d = await getDemoOtp();
      if (d && d.email === email) setDemoOtp(d.otp);
    } catch {
      /* noop */
    }
  }, [email]);

  useEffect(() => {
    if (!email && purpose !== "register") {
      toast.error("We don't know which email to verify. Please start again.", "Missing email");
      navigate("/login");
    }
    fetchDemo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  /* countdown for resend */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const redirectAfterAuth = (user) => {
    let next = null;
    try {
      next = sessionStorage.getItem("jc_after_login");
      sessionStorage.removeItem("jc_after_login");
      sessionStorage.removeItem("jc_pending_auth");
    } catch {
      /* noop */
    }
    if (next && !next.startsWith("/login")) return navigate(next, { replace: true });
    return navigate(user.role === "admin" ? "/admin" : "/user", { replace: true });
  };

  const verify = async (code = otp) => {
    if (!/^\d{6}$/.test(code)) {
      setInvalid(true);
      setErrorMsg("Enter the complete 6-digit code.");
      return;
    }
    setBusy(true);
    setInvalid(false);
    setErrorMsg("");
    try {
      const user =
        purpose === "register"
          ? await verifyRegistrationOTP({ email, otp: code })
          : await verifyLoginOTP({ email, otp: code });
      toast.success(purpose === "register" ? "Account verified — welcome to Jerry Computers!" : "Logged in successfully.", `Welcome, ${user.name}!`);
      redirectAfterAuth(user);
    } catch (err) {
      const msg = err?.message || "Verification failed. Please try again.";
      setInvalid(true);
      setErrorMsg(msg);
      const expired = /expired/i.test(msg);
      toast.error(msg, expired ? "Code expired" : "Verification failed");
      if (expired) setCountdown(0);
      fetchDemo();
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setResending(true);
    setOtp("");
    setInvalid(false);
    setErrorMsg("");
    try {
      await resendOtp({ email, purpose });
      setCountdown(45);
      toast.info("A fresh verification code is on its way to your email.", "Code resent");
      setOtp("");
      await fetchDemo();
    } catch (err) {
      toast.error(err?.message || "Could not resend the code.", "Resend failed");
    } finally {
      setResending(false);
    }
  };

  if (!email && purpose === "register") {
    /* register always passes email via state/session */
    return null;
  }

  return (
    <AuthLayout
      quote={
        purpose === "register" ? (
          <>
            One last step — <span>verify your email</span> to activate your account.
          </>
        ) : (
          <>
            Two-step login keeps your account <span>secure</span>.
          </>
        )
      }
    >
      <div className="auth__card">
        <div className="empty__art" style={{ marginBottom: 18, background: "linear-gradient(160deg,#e0ecff,#e9f5f0)" }}>
          <IcShieldCheck size={30} />
        </div>
        <h1>VERIFY YOUR EMAIL</h1>
        <p className="sub">
          We've sent a 6-digit verification code to
          <br />
          <b className="nowrap" style={{ color: "var(--ink)" }}>
            <IcMail size={14} /> {email}
          </b>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            verify();
          }}
          noValidate
        >
          <OTPInput
            value={otp}
            onChange={(v) => {
              setOtp(v);
              setInvalid(false);
              setErrorMsg("");
            }}
            onComplete={(code) => verify(code)}
            error={invalid}
            disabled={busy}
          />

          {errorMsg && (
            <p className="field-error" style={{ justifyContent: "center", marginTop: 12 }}>
              <IcAlertCircle size={14} /> {errorMsg}
            </p>
          )}

          <button className="btn btn--primary btn--lg btn--block mt-20" disabled={busy || otp.length !== 6} type="submit">
            {busy ? (
              <>
                <span className="spinner" /> Verifying…
              </>
            ) : (
              <>
                Verify &amp; Continue <IcArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="resend-line mt-20">
          {countdown > 0 ? (
            <span>
              Resend code in <b>{countdown}s</b>
            </span>
          ) : (
            <button className="btn btn--soft btn--sm" onClick={resend} disabled={resending}>
              {resending ? <span className="spinner" /> : <IcRefresh size={14} />} Resend OTP
            </button>
          )}
        </div>

        {demoOtp && (
          <div className="demo-otp" role="status">
            <IcShieldCheck size={18} />
            <span>
              <b>Demo mode:</b> your verification code is <b>{demoOtp}</b>
            </span>
          </div>
        )}

        <p className="auth__foot" style={{ fontSize: 13 }}>
          Didn't get the email? Check spam, or{" "}
          <Link to={purpose === "register" ? "/register" : "/login"}>restart</Link>.
        </p>
      </div>
    </AuthLayout>
  );
}
