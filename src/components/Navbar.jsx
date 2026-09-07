import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import {
  IcMenu,
  IcX,
  IcSearch,
  IcHeart,
  IcCart,
  IcUser,
  IcLogOut,
  IcChevronDown,
  IcGrid,
  IcPackage,
  IcWrench,
  IcHeadset,
  IcClipboard,
  IcBag,
  IcHome,
  IcSettings,
  IcLogIn,
} from "./Icons";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { NAV_ITEMS } from "@/data/siteInfo";
import SearchOverlay from "./SearchOverlay";
import { cx } from "@/lib/utils";
import { initials } from "@/lib/utils";

const ICONS = {
  dashboard: IcGrid,
  orders: IcPackage,
  services: IcWrench,
  support: IcHeadset,
  history: IcClipboard,
  profile: IcSettings,
  home: IcHome,
  bag: IcBag,
};

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  /* close menus when route changes */
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.info("You have been logged out.", "Signed out");
    navigate("/");
  };

  const dashPath = isAdmin ? "/admin" : "/user";

  const userLinks = isAdmin
    ? [
        { to: "/admin", label: "Dashboard", icon: "dashboard" },
        { to: "/admin/products", label: "Products", icon: "bag" },
        { to: "/admin/orders", label: "Orders", icon: "orders" },
        { to: "/admin/service-requests", label: "Services", icon: "services" },
        { to: "/admin/support-tickets", label: "Support", icon: "support" },
      ]
    : [
        { to: "/user", label: "My Dashboard", icon: "home" },
        { to: "/orders", label: "My Orders", icon: "orders" },
        { to: "/my-services", label: "My Service Requests", icon: "services" },
        { to: "/service-history", label: "Service History", icon: "history" },
        { to: "/support/tickets", label: "Support Tickets", icon: "support" },
        { to: "/profile", label: "Profile", icon: "profile" },
      ];

  return (
    <>
      <header className={cx("navbar", scrolled && "navbar--scrolled")}>
        <div className="container navbar__inner">
          <Logo to="/" tagline={false} />
          <nav className="nav-links" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => cx("nav-link", isActive && "nav-link--active")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search products" title="Search">
              <IcSearch size={20} />
            </button>
            <Link className="icon-btn hide-mobile" to="/wishlist" aria-label={`Wishlist (${wishCount} items)`} title="Wishlist">
              <IcHeart size={20} />
              {wishCount > 0 && <span className="count-bubble">{wishCount > 9 ? "9+" : wishCount}</span>}
            </Link>
            <Link className="icon-btn" to="/cart" aria-label={`Cart (${count} items)`} title="Cart">
              <IcCart size={21} />
              {count > 0 && <span className="count-bubble">{count > 9 ? "9+" : count}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="dropdown" ref={userMenuRef}>
                <button className="dropdown__btn" onClick={() => setUserMenuOpen((o) => !o)} aria-haspopup="menu" aria-expanded={userMenuOpen}>
                  <span className="avatar">{initials(user?.name)}</span>
                  <span className="dropdown__who">
                    <span className="dropdown__name">{user?.name}</span>
                    <br />
                    <span className="dropdown__role">{isAdmin ? "Administrator" : "Customer"}</span>
                  </span>
                  <IcChevronDown size={15} style={{ color: "var(--muted)" }} />
                </button>
                {userMenuOpen && (
                  <div className="dropdown__menu" role="menu">
                    <div className="dropdown__head">
                      <div className="name">{user?.name}</div>
                      <div className="email">{user?.email}</div>
                    </div>
                    {userLinks.map((l) => {
                      const Icon = ICONS[l.icon] || IcUser;
                      return (
                        <Link key={l.to} to={l.to} className="dropdown__item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                          <Icon size={17} /> {l.label}
                        </Link>
                      );
                    })}
                    <div className="dropdown__item" style={{ padding: "6px 0" }} aria-hidden="true" />
                    <button className="dropdown__item dropdown__item--danger" onClick={handleLogout} role="menuitem">
                      <IcLogOut size={17} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn--primary btn--sm navbar__cta">
                <IcLogIn size={16} /> Login
              </Link>
            )}

            <button className="icon-btn mobile-toggle" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
              {menuOpen ? <IcX size={22} /> : <IcMenu size={23} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu__group-label">Shop</div>
          {NAV_ITEMS.filter((i) => i.label !== "Home").map((item) => (
            <Link key={item.to} to={item.to} className="mobile-link">
              {item.label}
            </Link>
          ))}
          <div className="mobile-menu__group-label">Account</div>
          {isAuthenticated ? (
            <>
              <Link to={dashPath} className="mobile-link">
                <IcHome size={18} /> Dashboard
              </Link>
              {!isAdmin && (
                <>
                  <Link to="/orders" className="mobile-link">
                    <IcPackage size={18} /> My Orders
                  </Link>
                  <Link to="/wishlist" className="mobile-link">
                    <IcHeart size={18} /> Wishlist
                  </Link>
                </>
              )}
              <button className="mobile-link" onClick={handleLogout} style={{ border: 0, background: "none", width: "100%", textAlign: "left", color: "var(--danger)" }}>
                <IcLogOut size={18} /> Logout ({user?.name})
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link">
                <IcLogIn size={18} /> Login / Register
              </Link>
            </>
          )}
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
