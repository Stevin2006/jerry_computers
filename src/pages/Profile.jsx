import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHead from "@/components/PageHead";
import { SkeletonBlock } from "@/components/Loading";
import { IcUser, IcMail, IcPhone, IcMapPin, IcAlertCircle, IcCheckCircle } from "@/components/Icons";
import { getProfile, updateProfile } from "@/api/userApi";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { initials, prettyDate } from "@/lib/utils";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: { line: "", city: "", state: "", pincode: "" },
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setError(null);
    try {
      const p = await getProfile();
      setProfile(p);
      setForm({
        name: p.name || "",
        phone: p.phone || "",
        address: p.address || { line: "", city: "", state: "", pincode: "" },
      });
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setAddr = (k) => (e) => setForm((f) => ({ ...f, address: { ...f.address, [k]: e.target.value } }));

  const save = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 3) errs.name = "Enter your full name";
    if (!/^[+]?[\d\s-]{10,15}$/.test(form.phone.trim())) errs.phone = "Enter a valid phone number";
    const addr = form.address;
    if (!addr.line.trim() || !addr.city.trim() || !addr.pincode.trim()) errs.address = "Complete address is required";
    if (addr.pincode && !/^\d{6}$/.test(addr.pincode)) errs.pincode = "6-digit PIN code";
    setErrors(errs);
    if (Object.keys(errs).length) return toast.error("Please fix the highlighted fields.", "Check your details");
    setBusy(true);
    try {
      const res = await updateProfile({ name: form.name.trim(), phone: form.phone.trim(), address: form.address });
      updateUser(res.user);
      setProfile(res.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2600);
      toast.success("Your profile has been updated.", "Profile saved");
    } catch (err) {
      toast.error(err?.message || "Could not save your profile.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page--plain">
      <PageHead title="MY PROFILE" sub="Keep your details up to date so we can serve you faster." crumb="Home" crumbs={[{ label: "Profile" }]} />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 900 }}>
          {error ? (
            <div className="alert alert--error">
              <IcAlertCircle size={18} />
              <span>Couldn't load your profile. <button className="btn btn--danger-soft btn--sm" onClick={load}>Retry</button></span>
            </div>
          ) : !profile ? (
            <SkeletonBlock lines={8} height={180} />
          ) : (
            <div className="profile-grid">
              {/* identity card */}
              <div className="card card--pad">
                <div className="flex-align" style={{ gap: 16 }}>
                  <span className="avatar avatar--lg">{initials(profile.name)}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 20 }}>{profile.name}</h3>
                    <span className="badge badge--primary mt-8">{profile.role === "admin" ? "Administrator" : "Customer"}</span>
                  </div>
                </div>
                <hr className="divider" />
                <div style={{ display: "grid", gap: 14 }}>
                  <div className="flex-align">
                    <IcMail size={18} style={{ color: "var(--primary)" }} />
                    <span className="profile-val small">{profile.email}</span>
                  </div>
                  <div className="flex-align">
                    <IcPhone size={18} style={{ color: "var(--primary)" }} />
                    <span className="profile-val small">{profile.phone || "—"}</span>
                  </div>
                  <div className="flex-align" style={{ alignItems: "flex-start" }}>
                    <IcMapPin size={18} style={{ color: "var(--primary)", marginTop: 2 }} />
                    <span className="profile-val small">
                      {profile.address ? `${profile.address.line}, ${profile.address.city}, ${profile.address.state} — ${profile.address.pincode}` : "No address saved yet"}
                    </span>
                  </div>
                </div>
                <p className="hint mt-16">Member since {prettyDate(profile.createdAt)}</p>
              </div>

              {/* edit form */}
              <form className="card card--pad" onSubmit={save} noValidate>
                <h3 style={{ fontSize: 17, marginTop: 0 }}>Edit profile</h3>
                <div className="field">
                  <label className="label" htmlFor="pf-name">Full Name</label>
                  <input id="pf-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="field">
                  <label className="label" htmlFor="pf-phone">Phone</label>
                  <input id="pf-phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="field">
                  <label className="label" htmlFor="pf-line">Address</label>
                  <input id="pf-line" className="input" value={form.address.line} onChange={setAddr("line")} placeholder="House no, street, area" />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>
                <div className="field-row field-row--3">
                  <div className="field">
                    <label className="label" htmlFor="pf-city">City</label>
                    <input id="pf-city" className="input" value={form.address.city} onChange={setAddr("city")} />
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="pf-state">State</label>
                    <input id="pf-state" className="input" value={form.address.state} onChange={setAddr("state")} />
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="pf-pin">PIN</label>
                    <input id="pf-pin" className="input" value={form.address.pincode} onChange={setAddr("pincode")} inputMode="numeric" />
                    {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                  </div>
                </div>
                <button className="btn btn--primary btn--block" disabled={busy} type="submit">
                  {busy ? (
                    <>
                      <span className="spinner" /> Saving…
                    </>
                  ) : (
                    <>
                      <IcCheckCircle size={16} /> Save Changes
                    </>
                  )}
                </button>
                {saved && <p className="hint" style={{ color: "var(--success)", textAlign: "center", fontWeight: 600 }}>Profile updated ✓</p>}
                <div className="text-center mt-16">
                  <Link to={user?.role === "admin" ? "/admin" : "/user"} className="small">
                    ← Back to dashboard
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
