# JERRY COMPUTERS — Frontend

> **BUY IT. INSTALL IT. SUPPORT IT. KEEP IT RUNNING.**
> Your Complete Technology Partner — products, gaming, security, installation, service and support.

A complete, modern, production-quality **React e-commerce + services + support platform** for
**Jerry Computers** — a technology company that sells products *and* delivers professional
installation, repair, maintenance and technical support.

Built with **Vite + React (JavaScript) + React Router + Axios + Context API**, styled with a
custom design system (no UI framework). It runs fully today against an in-browser mock backend
that mirrors the future **Django REST Framework** API contract, so every flow is testable end to end.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run preview      # preview the production build
```

The app runs in **mock mode by default** (see `.env.example` → copy to `.env`):

```env
VITE_API_URL=http://localhost:8000/api
VITE_USE_MOCK=true        # false → talk to the real Django API
VITE_SHOW_MOCK_OTP=true   # show the generated OTP on screen in demo mode
```

### Demo accounts (mock mode only)

| Role | Email | Password |
| --- | --- | --- |
| Customer | `user@jerry.com` | `User@123` |
| Administrator | `admin@jerry.com` | `Admin@123` |

Login is **email + password → 6-digit OTP → JWT**. In demo mode the OTP appears in a banner on
the verification screen (in production the OTP is emailed by Django via SMTP — the frontend never
generates it).

---

## What's inside

### Storefront
- Visually rich landing page: hero, trust indicators, category cards, featured products,
  gaming zone, business solutions, CCTV & security, services, after-sales BUY→INSTALL→SUPPORT→MAINTAIN
  cycle, "why Jerry", brands, deals, newsletter.
- Catalogue with search, category/brand/price/rating filters, sorting and pagination
  (`/products`, `/products/<category>`).
- Product details with gallery, specs, reviews, wishlist, add-to-cart / buy-now and a
  **products → services → support** connector ("Need help with this product?").
- Cart, wishlist, checkout with address + payment, orders and order tracking.

### Services & support
- Services directory (`/services`), service request form (`/services/request`) with validation
  and success screen, customer service tracking with a visual timeline (`/my-services`),
  completed-service history (`/service-history`).
- Support center (`/support`), tickets with create/reply/threads/attachments (`/support/tickets`,
  `/support/tickets/:id`).

### Accounts
- Register → email OTP → verified account (public registration always creates `role = user`).
- Login → email OTP → JWT → role-based redirect (`/user` for customers, `/admin` for admins).
- Customer dashboard with recommended products, recently viewed, recent orders/services and more.
- Profile editing.

### Admin
- Dashboard (revenue, orders, customers, products, pending services, open tickets, sales chart,
  low-stock, recent queues), products CRUD + stock management, orders management,
  customers list, service-request management (assign technician, schedule, status, notes),
  support-ticket management (priority/status/replies).
- Sidebar navigation with mobile drawer. Access is guarded by `ProtectedRoute requiredRole="admin"`.

---

## Architecture

```
src/
├── api/            # axios instance + interceptors; auth/product/order/service/support/user/admin APIs
│   └── mockBackend.js   # in-browser backend simulating the Django contract (demo only)
├── components/     # reusable UI: Navbar, Footer, ProductCard, OTPInput, Modal, Toast, etc.
├── context/        # AuthContext, CartContext, WishlistContext, ToastContext
├── data/           # mock data, fully separated from components (products, categories, services…)
├── lib/            # money/date formatting + tiny helpers
└── pages/          # home, auth, user, services, support, admin (+ NotFound)
```

**Key principles**

- **API layer is centralized.** Every request goes through `src/api/*` using the `VITE_API_URL`
  base — components never hardcode URLs. Each module exposes the same function signature for mock
  and real mode, so switching `VITE_USE_MOCK=false` is the only change needed to connect Django.
- **JWT handling** lives in one Axios instance: `Authorization: Bearer <access>` is attached
  automatically, an expired access token triggers a single-flight refresh using the refresh token,
  the original request is retried, and a failed refresh clears auth and redirects to `/login`.
- **Auth state** is managed by `AuthContext` (user, role, tokens, login/verify/register/logout/
  refresh) and persists across reloads. `ProtectedRoute`/`GuestOnly` provide role-based navigation
  for UX only — Django remains the authority for authorization.
- **Mock data is separate from components** and mirrors the expected API payloads (product fields,
  statuses, timelines, etc.).
- **Every data view handles loading (skeleton/spinner), success, empty and error states**, with
  toasts for feedback.
- **Client-side validation** on all forms (email, password strength, phone, OTP length, dates) —
  server-side validation still applies in Django.

### Intended Django API contract (see `src/api/` for full list)

```text
POST /api/auth/register/
POST /api/auth/verify-registration-otp/
POST /api/auth/login/
POST /api/auth/verify-login-otp/
POST /api/auth/token/refresh/

GET  /api/products/            GET  /api/products/:id/
GET  /api/categories/

GET  /api/orders/              GET  /api/orders/:id/            POST /api/orders/
GET  /api/services/            POST /api/services/request/
GET  /api/my-services/         GET  /api/service-history/
GET  /api/support/tickets/     POST /api/support/tickets/       POST /api/support/tickets/:id/reply/
GET  /api/profile/             PUT  /api/profile/

GET/POST    /api/admin/products/           PUT/DELETE /api/admin/products/:id/
GET         /api/admin/orders/             PUT        /api/admin/orders/:id/
GET         /api/admin/users/
GET         /api/admin/service-requests/   PUT        /api/admin/service-requests/:id/
GET         /api/admin/support-tickets/    PUT        /api/admin/support-tickets/:id/
```

Response payloads (auth, products, orders, service requests, tickets, dashboard stats) follow the
shapes used by `src/api/mockBackend.js`, so that file doubles as a working API reference.

---

## Security boundaries

This frontend **never** generates OTPs, sends emails, issues JWTs, hashes passwords or enforces
authorization. Those responsibilities belong to Django (OTP + SMTP + JWT + roles). Frontend role
checks exist purely to shape navigation; every protected API call still requires a valid token, and
the backend re-validates roles on each admin endpoint.
