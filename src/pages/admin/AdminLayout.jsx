import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  IcGrid,
  IcBag,
  IcTag,
  IcPackage,
  IcUsers,
  IcWrench,
  IcServer,
  IcHeadset,
  IcLogOut,
  IcMenu,
  IcX,
  IcExternalLink,
  IcHome,
  IcSettings,
} from "@/components/Icons";
import { cx, initials } from "@/lib/utils";

const NAV = [
  { section: "Overview", items: [{ to: "/admin", label: "Dashboard", icon: IcGrid, end: true }] },
  {
    section: "Manage",
    items: [
      { to: "/admin/products", label: "Products", icon: IcBag },
      { to: "/admin/categories", label: "Categories", icon: IcTag, disabled: true },
      { to: "/admin/orders", label: "Orders", icon: IcPackage },
      { to: "/admin/users", label: "Customers", icon: IcUsers },
      { to: "/admin/services", label: "Services", icon: IcServer, disabled: true },
      { to: "/admin/service-requests", label: "Service Requests", icon: IcWrench },
      { to: "/admin/support-tickets", label: "Support Tickets", icon: IcHeadset },
    ],
  },
  {
    section: "Account",
    items: [{ to: "/admin/settings", label: "Settings", icon: IcSettings, disabled: true }],
  },
];

function DisabledNavItem({ item }) {
  return (
    <span style={{ opacity: 0.45, cursor: "not-allowed" }} title="Available soon" aria-disabled="true">
      <item.icon size={17} style={{ margin: "0 12px 0 0" }} />
      {item.label}
    </span>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const doLogout = () => {
    logout();
    toast.info("You have been logged out.", "Signed out");
    navigate("/");
  };

  return (
    <div className="admin">
      <aside className={cx("admin-side", sideOpen && "admin-side--open")}>
        <Logo to="/admin" />
        <nav className="admin-nav" aria-label="Admin">
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="head">{group.section}</div>
              {group.items.map((item) => {
                if (item.disabled) {
                  return <DisabledNavItem key={item.to} item={item} />;
                }
                return (
                  <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? "admin-nav--active" : undefined)} onClick={() => setSideOpen(false)}>
                    <item.icon size={17} /> {item.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
          <div className="sep" />
          <Link to="/" className="admin-nav-item">
            <IcExternalLink size={16} /> View store
          </Link>
          <button onClick={doLogout} className="admin-nav-item" style={{ color: "#fca5a5" }}>
            <IcLogOut size={16} /> Logout
          </button>
        </nav>
        <div className="admin-side__foot" style={{ padding: "10px 8px 0", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div className="flex-align" style={{ gap: 10 }}>
            <span className="avatar avatar--violet">{initials(user?.name)}</span>
            <span style={{ lineHeight: 1.25 }}>
              <b style={{ color: "#fff", fontSize: 13 }}>{user?.name}</b>
              <br />
              <span style={{ fontSize: 11, color: "#7e92bf", textTransform: "uppercase", letterSpacing: ".05em" }}>Administrator</span>
            </span>
          </div>
        </div>
      </aside>

      {sideOpen && <div className="admin-backdrop" onClick={() => setSideOpen(false)} aria-hidden="true" />}

      <div className="admin-main">
        <div className="admin-topbar">
          <button className="icon-btn admin-hamburger" onClick={() => setSideOpen((o) => !o)} aria-label="Toggle admin menu">
            {sideOpen ? <IcX size={20} /> : <IcMenu size={20} />}
          </button>
          <IcHome size={16} style={{ color: "var(--faint)" }} />
          <span className="muted small">Admin /</span>
          <b className="small" style={{ color: "var(--ink)" }}>
            Jerry Computers
          </b>
          <div className="flex-align" style={{ marginLeft: "auto", gap: 10 }}>
            <Link to="/" className="btn btn--outline btn--sm hide-mobile">
              <IcExternalLink size={14} /> View Store
            </Link>
          </div>
        </div>
        <div className="admin-body" onClick={() => sideOpen && setSideOpen(false)}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
