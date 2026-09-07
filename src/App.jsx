import { Suspense, lazy } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute, { GuestOnly } from "@/components/ProtectedRoute";
import { PageLoader } from "@/components/Loading";
import CatalogRoute from "@/pages/CatalogRoute";
import NotFound from "@/pages/NotFound";

/* lazy-load pages to keep the first paint fast */
const Home = lazy(() => import("@/pages/Home"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Cart = lazy(() => import("@/pages/Cart"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Orders = lazy(() => import("@/pages/Orders"));
const OrderDetails = lazy(() => import("@/pages/OrderDetails"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceRequest = lazy(() => import("@/pages/ServiceRequest"));
const ServiceSuccess = lazy(() => import("@/pages/ServiceSuccess"));
const Support = lazy(() => import("@/pages/Support"));
const SupportTickets = lazy(() => import("@/pages/SupportTickets"));
const TicketDetail = lazy(() => import("@/pages/TicketDetail"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const VerifyOTP = lazy(() => import("@/pages/auth/VerifyOTP"));
const UserHome = lazy(() => import("@/pages/UserHome"));
const Profile = lazy(() => import("@/pages/Profile"));
const MyServices = lazy(() => import("@/pages/MyServices"));
const ServiceHistory = lazy(() => import("@/pages/ServiceHistory"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const ProductsManagement = lazy(() => import("@/pages/admin/ProductsManagement"));
const OrdersManagement = lazy(() => import("@/pages/admin/OrdersManagement"));
const UsersManagement = lazy(() => import("@/pages/admin/UsersManagement"));
const ServiceRequestsAdmin = lazy(() => import("@/pages/admin/ServiceRequests"));
const SupportTicketsAdmin = lazy(() => import("@/pages/admin/SupportTickets"));

function PublicShell() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function UserShell() {
  /* All user dashboards keep the public chrome (nav + footer). */
  return (
    <>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function AuthShell() {
  /* Login / register / OTP screens have their own focused layout. */
  return (
    <main id="main">
      <Outlet />
    </main>
  );
}

function SuspenseFallback() {
  return (
    <div style={{ minHeight: "60vh", paddingTop: "18vh" }}>
      <PageLoader label="Loading…" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          {/* ---- public storefront ---- */}
          <Route element={<PublicShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            {/* categories and product details share this segment */}
            <Route path="/products/:segment" element={<CatalogRoute />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/request" element={<ServiceRequest />} />
            <Route path="/services/request/success" element={<ServiceSuccess />} />
            <Route path="/support" element={<Support />} />
            <Route path="/support/tickets" element={<SupportTickets />} />
            <Route path="/support/tickets/:id" element={<TicketDetail />} />
          </Route>

          {/* ---- auth (no navbar) ---- */}
          <Route element={<AuthShell />}>
            <Route
              path="/login"
              element={
                <GuestOnly>
                  <Login />
                </GuestOnly>
              }
            />
            <Route
              path="/register"
              element={
                <GuestOnly>
                  <Register />
                </GuestOnly>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <GuestOnly>
                  <VerifyOTP />
                </GuestOnly>
              }
            />
          </Route>

          {/* ---- customer area ---- */}
          <Route element={<UserShell />}>
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute requiredRole="user">
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute requiredRole="user">
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute requiredRole="user">
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRole="user">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-services"
              element={
                <ProtectedRoute requiredRole="user">
                  <MyServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/service-history"
              element={
                <ProtectedRoute requiredRole="user">
                  <ServiceHistory />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ---- admin area ---- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="service-requests" element={<ServiceRequestsAdmin />} />
            <Route path="support-tickets" element={<SupportTicketsAdmin />} />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
