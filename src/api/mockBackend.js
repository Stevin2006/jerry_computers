/* ============================================================
 * MOCK BACKEND (development / demo only)
 * ------------------------------------------------------------
 * Simulates the Django REST API contract the React app expects,
 * including: registration, email OTP, JWT login, products,
 * orders, service requests, support tickets, profile and all
 * admin endpoints. Data persists in localStorage so admin edits,
 * new orders and tickets survive refreshes.
 *
 * When Django is ready, set VITE_USE_MOCK=false — the api modules
 * will call the real endpoints instead. Nothing in this file is
 * used in production.
 * ============================================================ */

import { products as seedProducts } from "@/data/mockProducts";
import { categories } from "@/data/mockCategories";
import { serviceCategories } from "@/data/mockServices";

const DB_KEY = "jerry_db_v1";
const OTP_KEY = "jerry_pending_otp";

/* ---- tiny helpers ------------------------------------------------- */
const delay = (ms = 380) => new Promise((r) => setTimeout(r, ms + Math.random() * 260));

export class ApiError extends Error {
  constructor(message, status = 400, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

const day = 24 * 60 * 60 * 1000;
const dstr = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => dstr(new Date(Date.now() - n * day));
const daysAhead = (n) => dstr(new Date(Date.now() + n * day));

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pad = (n, l = 4) => String(n).padStart(l, "0");

/* ---- JWT-like tokens (demo only — Django issues the real ones) --- */
const b64 = (obj) =>
  typeof Buffer !== "undefined"
    ? Buffer.from(JSON.stringify(obj)).toString("base64")
    : btoa(JSON.stringify(obj));
function makeToken(payload, ttlSeconds) {
  const header = b64({ alg: "HS256", typ: "JWT" });
  const body = b64({ ...payload, iat: Date.now(), exp: Date.now() + ttlSeconds * 1000, iss: "mock-jerry" });
  return `${header}.${body}.mock-signature`;
}
function decodeToken(token) {
  try {
    const body = JSON.parse(atob(token.split(".")[1]));
    return body;
  } catch {
    return null;
  }
}

/* ---- seed data ------------------------------------------------------ */
function hashlessPassword(pw) {
  return pw;
}

function seedDb() {
  const now = new Date();
  const orders = [
    {
      id: "ORD-1001",
      userId: "U-1002",
      items: [
        { productId: seedProducts[0].id, name: seedProducts[0].name, price: seedProducts[0].price, qty: 1, image: seedProducts[0].images[0] },
        { productId: seedProducts[12].id, name: seedProducts[12].name, price: seedProducts[12].price, qty: 1, image: seedProducts[12].images[0] },
      ],
      subtotal: seedProducts[0].price + seedProducts[12].price,
      shipping: 0,
      total: seedProducts[0].price + seedProducts[12].price,
      status: "Delivered",
      paymentStatus: "Paid",
      paymentMethod: "UPI",
      address: { fullName: "Saraniya", phone: "+91 98765 43210", line: "12, Lake View Road, Kotturpuram", city: "Chennai", state: "Tamil Nadu", pincode: "600085" },
      createdAt: daysAgo(21),
      timeline: [
        { label: "Order Placed", at: daysAgo(21), done: true },
        { label: "Order Confirmed", at: daysAgo(20), done: true },
        { label: "Processing", at: daysAgo(19), done: true },
        { label: "Shipped", at: daysAgo(15), done: true },
        { label: "Delivered", at: daysAgo(12), done: true },
      ],
    },
    {
      id: "ORD-1002",
      userId: "U-1002",
      items: [
        { productId: seedProducts[6].id, name: seedProducts[6].name, price: seedProducts[6].price, qty: 1, image: seedProducts[6].images[0] },
      ],
      subtotal: seedProducts[6].price,
      shipping: 0,
      total: seedProducts[6].price,
      status: "Shipped",
      paymentStatus: "Paid",
      paymentMethod: "Card",
      address: { fullName: "Saraniya", phone: "+91 98765 43210", line: "12, Lake View Road, Kotturpuram", city: "Chennai", state: "Tamil Nadu", pincode: "600085" },
      createdAt: daysAgo(3),
      timeline: [
        { label: "Order Placed", at: daysAgo(3), done: true },
        { label: "Order Confirmed", at: daysAgo(2), done: true },
        { label: "Processing", at: daysAgo(1), done: true },
        { label: "Shipped", at: daysAgo(0), done: true },
        { label: "Delivered", at: null, done: false },
      ],
    },
  ];

  const serviceRequests = [
    {
      id: "SRV-1024",
      userId: "U-1002",
      category: "cctv",
      categoryLabel: "CCTV & Security",
      productType: "CCTV Camera",
      deviceName: "4MP Dome CCTV Kit (4 cameras)",
      description: "Need complete installation of the 4-camera kit including DVR setup and remote viewing on mobile.",
      preferredDate: daysAhead(4),
      preferredTime: "10:00 AM – 1:00 PM",
      address: "12, Lake View Road, Kotturpuram, Chennai 600085",
      notes: "Wiring needs to be concealed.",
      status: "Technician Assigned",
      technician: { name: "Ramesh Kumar", phone: "+91 90000 11122" },
      createdAt: daysAgo(2),
      scheduledDate: daysAhead(4),
      timeline: [
        { label: "Requested", at: daysAgo(2), done: true },
        { label: "Confirmed", at: daysAgo(1), done: true },
        { label: "Technician Assigned", at: daysAgo(0), done: true },
        { label: "Scheduled", at: daysAhead(4), done: false },
        { label: "In Progress", at: null, done: false },
        { label: "Completed", at: null, done: false },
      ],
    },
    {
      id: "SRV-1011",
      userId: "U-1002",
      category: "laptop",
      categoryLabel: "Laptop Service",
      productType: "Laptop",
      deviceName: "StudentBook 15",
      description: "Laptop is slow at startup. Requesting SSD upgrade and OS optimisation.",
      preferredDate: daysAgo(12),
      preferredTime: "2:00 PM – 5:00 PM",
      address: "12, Lake View Road, Kotturpuram, Chennai 600085",
      notes: "",
      status: "Completed",
      technician: { name: "Arun Prakash", phone: "+91 90000 33445" },
      createdAt: daysAgo(14),
      scheduledDate: daysAgo(12),
      timeline: [
        { label: "Requested", at: daysAgo(14), done: true },
        { label: "Confirmed", at: daysAgo(13), done: true },
        { label: "Technician Assigned", at: daysAgo(13), done: true },
        { label: "Scheduled", at: daysAgo(12), done: true },
        { label: "In Progress", at: daysAgo(12), done: true },
        { label: "Completed", at: daysAgo(11), done: true },
      ],
    },
  ];

  const tickets = [
    {
      id: "TKT-501",
      userId: "U-1002",
      subject: "Printer keeps going offline on Wi-Fi",
      category: "Printer Support",
      product: "PrintJet Wireless InkTank All-in-One Printer",
      description:
        "The printer disconnects from Wi-Fi every few hours. Reinstalling drivers helped once but the issue returned.",
      priority: "High",
      status: "Waiting for Customer",
      attachments: ["screenshot-print-queue.png"],
      createdAt: daysAgo(1),
      updatedAt: daysAgo(0),
      messages: [
        {
          id: "m1",
          author: "Saraniya",
          role: "customer",
          text: "Hi, my PrintJet printer drops off the Wi-Fi network every couple of hours and I have to re-pair it. Any idea what's wrong?",
          at: daysAgo(1),
        },
        {
          id: "m2",
          author: "Support Team",
          role: "agent",
          text: "Thanks for reaching out, Saraniya. Could you confirm: is the printer close to the router, and does the router broadcast on a 5 GHz network? Printers usually prefer 2.4 GHz. Try locking the printer to the 2.4 GHz band in your router settings and let us know if it stays connected.",
          at: daysAgo(0),
        },
      ],
    },
  ];

  const users = [
    {
      id: "U-1001",
      name: "Jerry Admin",
      email: "admin@jerry.com",
      phone: "+91 90000 00001",
      password: hashlessPassword("Admin@123"),
      role: "admin",
      verified: true,
      status: "Active",
      address: { line: "Jerry Computers HQ, Anna Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600040" },
      createdAt: daysAgo(400),
    },
    {
      id: "U-1002",
      name: "Saraniya",
      email: "user@jerry.com",
      phone: "+91 98765 43210",
      password: hashlessPassword("User@123"),
      role: "user",
      verified: true,
      status: "Active",
      address: { line: "12, Lake View Road, Kotturpuram", city: "Chennai", state: "Tamil Nadu", pincode: "600085" },
      createdAt: daysAgo(120),
    },
  ];

  return {
    users,
    products: seedProducts.map((p) => JSON.parse(JSON.stringify(p))),
    categories,
    serviceCategories,
    orders,
    serviceRequests,
    tickets,
    counters: { order: 1003, service: 1025, ticket: 502 },
    techs: ["Ramesh Kumar", "Arun Prakash", "Deepak Raj", "Suresh Babu", "Kavitha S"],
  };
}

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt storage */
  }
  const db = seedDb();
  persist(db);
  return db;
}
function persist(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* storage may be full — keep in-memory copy instead */
  }
}

/* ---- active session ------------------------------------------------ */
let db = null;
function getDb() {
  if (!db) db = loadDb();
  return db;
}

const SESSION_KEY = "jerry_session";
let pendingOtp = null;

function setPendingOtp(record) {
  pendingOtp = record;
  try {
    localStorage.setItem(OTP_KEY, JSON.stringify(record));
  } catch {
    /* noop */
  }
}
export function getPendingOtp() {
  if (pendingOtp) return pendingOtp;
  try {
    return JSON.parse(localStorage.getItem(OTP_KEY));
  } catch {
    return null;
  }
}
function clearPendingOtp() {
  pendingOtp = null;
  try {
    localStorage.removeItem(OTP_KEY);
  } catch {
    /* noop */
  }
}

function issueOtp(user, purpose) {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  setPendingOtp({ email: user.email, purpose, otp, expiresAt: Date.now() + 5 * 60 * 1000 });
}

function issueTokens(user) {
  const access = makeToken({ sub: user.id, role: user.role, type: "access" }, 15 * 60);
  const refresh = makeToken({ sub: user.id, role: user.role, type: "refresh" }, 7 * day / 1000);
  return { access, refresh, user: publicUser(user) };
}

function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
    address: u.address,
    createdAt: u.createdAt,
  };
}

function requireAuth(headers = {}, role) {
  const auth = headers?.Authorization || headers?.authorization || "";
  const token = String(auth).replace("Bearer ", "");
  const payload = decodeToken(token);
  if (!payload || payload.exp < Date.now()) throw new ApiError("Authentication required. Please log in again.", 401);
  const db = getDb();
  const user = db.users.find((u) => u.id === payload.sub);
  if (!user) throw new ApiError("Account not found.", 401);
  if (role && user.role !== role)
    throw new ApiError("You do not have permission to access this area.", 403);
  return user;
}

function publicProduct(p) {
  return {
    ...p,
    categoryName: (getDb().categories.find((c) => c.key === p.category) || {}).name || p.category,
  };
}

/* ============================================================
 * AUTH
 * ============================================================ */
const auth = {
  async register(payload) {
    const { name, email, phone, password } = payload;
    const d = getDb();
    if (!name || !email || !phone || !password) throw new ApiError("All fields are required.");
    if (d.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase()))
      throw new ApiError("An account with this email already exists. Please log in.", 409);
    const user = {
      id: "U-" + (1002 + d.users.length + Math.floor(Math.random() * 90)),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      password: hashlessPassword(password),
      role: "user", // public registration ALWAYS creates role=user (Django enforces this server-side)
      verified: false,
      status: "Pending",
      address: null,
      createdAt: dstr(new Date()),
    };
    d.users.push(user);
    persist(d);
    issueOtp(user, "register");
    return { message: "Registration successful. A 6-digit verification code has been sent to your email.", requires_otp: true, email: user.email };
  },

  async verifyRegistrationOtp({ email, otp }) {
    const rec = getPendingOtp();
    const d = getDb();
    const user = d.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) throw new ApiError("Account not found. Please register again.", 404);
    if (!rec || rec.email.toLowerCase() !== String(email).toLowerCase() || rec.purpose !== "register")
      throw new ApiError("No pending verification found. Please register again.", 400);
    if (rec.otp !== String(otp)) throw new ApiError("Invalid verification code. Please check and try again.", 400);
    if (rec.expiresAt < Date.now()) throw new ApiError("This verification code has expired. Please request a new one.", 400);
    user.verified = true;
    user.status = "Active";
    persist(d);
    clearPendingOtp();
    return { message: "Account verified successfully.", ...issueTokens(user) };
  },

  async resendOtp({ email, purpose }) {
    const d = getDb();
    const user = d.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) throw new ApiError("No account found with this email.", 404);
    issueOtp(user, purpose || "login");
    return { message: "A new 6-digit verification code has been sent to your email.", requires_otp: true };
  },

  async login({ email, password }) {
    const d = getDb();
    const user = d.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user || user.password !== hashlessPassword(password))
      throw new ApiError("Invalid email or password.", 401);
    if (!user.verified) throw new ApiError("Your account is not verified. Please verify your email first.", 403);
    issueOtp(user, "login");
    return { message: "OTP sent successfully", requires_otp: true, email: user.email };
  },

  async verifyLoginOtp({ email, otp }) {
    const rec = getPendingOtp();
    const d = getDb();
    const user = d.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) throw new ApiError("Account not found.", 404);
    if (!rec || rec.email.toLowerCase() !== String(email).toLowerCase() || rec.purpose !== "login")
      throw new ApiError("No pending login found. Please try logging in again.", 400);
    if (rec.otp !== String(otp)) throw new ApiError("Invalid verification code.", 400);
    if (rec.expiresAt < Date.now()) throw new ApiError("This verification code has expired. Please log in again.", 400);
    clearPendingOtp();
    return { message: "Logged in successfully.", ...issueTokens(user) };
  },

  async refresh(refreshToken) {
    const payload = decodeToken(refreshToken);
    if (!payload || payload.type !== "refresh" || payload.exp < Date.now())
      throw new ApiError("Your session has expired. Please log in again.", 401);
    const d = getDb();
    const user = d.users.find((u) => u.id === payload.sub);
    if (!user) throw new ApiError("Account not found.", 401);
    return issueTokens(user);
  },
};

/* ============================================================
 * CATALOGUE
 * ============================================================ */
const catalogue = {
  async categories() {
    await delay(200);
    return getDb().categories;
  },

  async list({ search = "", category = "", brand = "", maxPrice = 0, minRating = 0, sort = "featured", page = 1, pageSize = 12 } = {}) {
    await delay();
    const q = String(search).trim().toLowerCase();
    let list = getDb().products.slice();
    if (category) list = list.filter((p) => p.category === category);
    if (brand) list = list.filter((p) => p.brand === brand);
    if (q)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
      );
    if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
    if (minRating) list = list.filter((p) => p.rating >= Number(minRating));

    const order = {
      featured: () => 0,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      discount: (a, b) => b.discount - a.discount,
      newest: (a, b) => (b.id > a.id ? 1 : -1),
    };
    const cmp = order[sort] || order.featured;
    list = list.sort((a, b) => {
      if (sort === "featured") {
        const fa = (a.tags?.includes("bestseller") ? 1 : 0) - (a.tags?.includes("deal") ? 1 : 0);
        const fb = (b.tags?.includes("bestseller") ? 1 : 0) - (b.tags?.includes("deal") ? 1 : 0);
        return fa - fb || b.rating - a.rating;
      }
      return cmp(a, b);
    });

    const total = list.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const safe = Math.min(Math.max(1, Number(page) || 1), pageCount);
    const start = (safe - 1) * pageSize;
    return {
      count: total,
      page: safe,
      pageCount,
      pageSize,
      results: list.slice(start, start + pageSize).map(publicProduct),
    };
  },

  async detail(id) {
    await delay(240);
    const p = getDb().products.find((x) => x.id === String(id));
    if (!p) throw new ApiError("Product not found.", 404);
    return publicProduct(JSON.parse(JSON.stringify(p)));
  },

  async brands() {
    await delay(160);
    return [...new Set(getDb().products.map((p) => p.brand))];
  },
};

/* ============================================================
 * ORDERS
 * ============================================================ */
const order = {
  async create(headers, payload) {
    const user = requireAuth(headers);
    const d = getDb();
    const { items, address, paymentMethod } = payload;
    if (!items?.length) throw new ApiError("Your cart is empty.");
    if (!address?.line || !address?.city || !address?.pincode) throw new ApiError("A complete delivery address is required.");

    let subtotal = 0;
    const lineItems = items.map((it) => {
      const p = d.products.find((x) => x.id === String(it.productId));
      if (!p) throw new ApiError("One of the selected products is no longer available.", 404);
      const qty = Math.min(Math.max(1, Number(it.qty) || 1), p.stock || 1);
      subtotal += p.price * qty;
      return { productId: p.id, name: p.name, price: p.price, qty, image: p.images?.[0] || p.img || "" };
    });
    const shipping = subtotal >= 50000 ? 0 : 199;
    const total = subtotal + shipping;
    const id = "ORD-" + d.counters.order++;
    const now = new Date();
    const orderObj = {
      id,
      userId: user.id,
      items: lineItems,
      subtotal,
      shipping,
      total,
      status: "Pending",
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      paymentMethod: paymentMethod || "COD",
      address: { fullName: address.fullName || user.name, phone: address.phone || user.phone, ...address },
      createdAt: dstr(now),
      timeline: [
        { label: "Order Placed", at: dstr(now), done: true },
        { label: "Order Confirmed", at: null, done: false },
        { label: "Processing", at: null, done: false },
        { label: "Shipped", at: null, done: false },
        { label: "Delivered", at: null, done: false },
      ],
    };
    d.orders.unshift(orderObj);
    persist(d);
    return { order: publicOrder(orderObj) };
  },

  async mine(headers) {
    const user = requireAuth(headers);
    await delay();
    return getDb().orders.filter((o) => o.userId === user.id).map(publicOrder);
  },

  async detail(headers, id) {
    const user = requireAuth(headers);
    const o = getDb().orders.find((x) => x.id === String(id) && x.userId === user.id);
    if (!o) throw new ApiError("Order not found.", 404);
    return publicOrder(o);
  },
};

function publicOrder(o) {
  return { ...o, userId: undefined };
}

/* ============================================================
 * SERVICES
 * ============================================================ */
const service = {
  async categories() {
    await delay(180);
    return getDb().serviceCategories;
  },

  async request(headers, payload) {
    let user = null;
    try {
      user = requireAuth(headers);
    } catch {
      user = null; // guests may request a service; their email is stored with the request
    }
    const d = getDb();
    const { fullName, email, phone, category, productType, deviceName, description, preferredDate, preferredTime, address, notes } = payload;
    if (!fullName || !email || !category || !description) throw new ApiError("Please fill in the required fields.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError("Please enter a valid email address.");

    const cat = d.serviceCategories.find((c) => c.key === category);
    const id = "SRV-" + d.counters.service++;
    const req = {
      id,
      userId: user?.id || null,
      customerName: fullName,
      email,
      phone: phone || "",
      category,
      categoryLabel: cat?.name || category,
      productType: productType || "",
      deviceName: deviceName || "",
      description,
      preferredDate: preferredDate || "",
      preferredTime: preferredTime || "",
      address: address || "",
      notes: notes || "",
      status: "Requested",
      technician: null,
      createdAt: dstr(new Date()),
      scheduledDate: null,
      history: [],
      timeline: [
        { label: "Requested", at: dstr(new Date()), done: true },
        { label: "Confirmed", at: null, done: false },
        { label: "Technician Assigned", at: null, done: false },
        { label: "Scheduled", at: null, done: false },
        { label: "In Progress", at: null, done: false },
        { label: "Completed", at: null, done: false },
      ],
    };
    d.serviceRequests.unshift(req);
    persist(d);
    return { message: "Service request submitted successfully. Our support team will contact you shortly.", request: req };
  },

  async mine(headers) {
    const user = requireAuth(headers);
    await delay();
    return getDb()
      .serviceRequests.filter((r) => r.userId === user.id)
      .map((r) => ({ ...r, customerName: user.name, email: user.email }));
  },

  async history(headers) {
    const user = requireAuth(headers);
    await delay();
    return getDb()
      .serviceRequests.filter((r) => r.userId === user.id && r.status === "Completed")
      .map((r) => ({ ...r, customerName: user.name, email: user.email }));
  },
};

/* ============================================================
 * SUPPORT TICKETS
 * ============================================================ */
const support = {
  async mine(headers) {
    const user = requireAuth(headers);
    await delay();
    return getDb()
      .tickets.filter((t) => t.userId === user.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async create(headers, payload) {
    const user = requireAuth(headers);
    const d = getDb();
    const { subject, category, product, description, priority, attachments = [] } = payload;
    if (!subject || !description) throw new ApiError("Subject and description are required.");
    const id = "TKT-" + d.counters.ticket++;
    const now = dstr(new Date());
    const ticket = {
      id,
      userId: user.id,
      subject,
      category: category || "General Support",
      product: product || "",
      description,
      priority,
      status: "Open",
      attachments,
      createdAt: now,
      updatedAt: now,
      messages: [
        { id: "m0", author: user.name, role: "customer", text: description, at: now },
      ],
    };
    d.tickets.unshift(ticket);
    persist(d);
    return { message: "Support ticket created successfully. Our team will get back to you soon.", ticket };
  },

  async detail(headers, id) {
    const user = requireAuth(headers);
    const t = getDb().tickets.find((x) => x.id === String(id) && x.userId === user.id);
    if (!t) throw new ApiError("Ticket not found.", 404);
    return t;
  },

  async reply(headers, id, payload) {
    const user = requireAuth(headers);
    const d = getDb();
    const t = d.tickets.find((x) => x.id === String(id) && x.userId === user.id);
    if (!t) throw new ApiError("Ticket not found.", 404);
    if (["Resolved", "Closed"].includes(t.status)) throw new ApiError("This ticket is closed. Open a new ticket if you need more help.", 400);
    const text = String(payload.text || "").trim();
    if (!text) throw new ApiError("Please write a message before sending.");
    t.messages.push({
      id: "m" + Date.now(),
      author: user.name,
      role: "customer",
      text,
      at: dstr(new Date()),
    });
    t.status = "Open";
    t.updatedAt = dstr(new Date());
    persist(d);
    return { message: "Reply sent.", ticket: t };
  },
};

/* ============================================================
 * PROFILE
 * ============================================================ */
const profile = {
  async get(headers) {
    const user = requireAuth(headers);
    await delay(200);
    return publicUser(user);
  },
  async update(headers, payload) {
    const user = requireAuth(headers);
    const d = getDb();
    const { name, phone, address } = payload;
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (address) user.address = address;
    persist(d);
    return { message: "Profile updated successfully.", user: publicUser(user) };
  },
};

/* ============================================================
 * ADMIN
 * ============================================================ */
const admin = {
  async dashboard(headers) {
    requireAuth(headers, "admin");
    await delay();
    const d = getDb();
    const revenue = d.orders.filter((o) => o.paymentStatus === "Paid").reduce((s, o) => s + o.total, 0);
    const last30 = d.orders.filter((o) => Date.now() - new Date(o.createdAt).getTime() < 30 * day);
    const salesSeries = Array.from({ length: 7 }, (_, i) => {
      const start = new Date(Date.now() - (6 - i) * day);
      const end = new Date(Date.now() - (5 - i) * day);
      const dayOrders = d.orders.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= start.getTime() && t <= end.getTime();
      });
      return {
        label: start.toLocaleDateString("en-IN", { weekday: "short" }),
        sales: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      };
    });

    const orderFlow = d.orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    const recentCustomers = d.users
      .filter((u) => u.role === "user")
      .slice(-5)
      .reverse()
      .map((u) => ({ ...publicUser(u), orders: d.orders.filter((o) => o.userId === u.id).length, spent: d.orders.filter((o) => o.userId === u.id && o.paymentStatus === "Paid").reduce((s, o) => s + o.total, 0) }));

    return {
      revenue,
      orders: d.orders.length,
      customers: d.users.filter((u) => u.role === "user").length,
      products: d.products.length,
      pendingServices: d.serviceRequests.filter((r) => !["Completed", "Cancelled"].includes(r.status)).length,
      openTickets: d.tickets.filter((t) => !["Resolved", "Closed"].includes(t.status)).length,
      orderFlow,
      salesSeries,
      recentOrders: d.orders.slice(0, 6).map((o) => ({
        ...publicOrder(o),
        customerName: (d.users.find((u) => u.id === o.userId) || {}).name || "Guest",
      })),
      lowStock: d.products.filter((p) => p.stock <= 8).map((p) => ({ id: p.id, name: p.name, brand: p.brand, stock: p.stock, price: p.price, image: p.images?.[0] || p.img })),
      recentServices: d.serviceRequests.slice(0, 6).map((r) => ({ ...r, customerName: r.customerName || (d.users.find((u) => u.id === r.userId) || {}).name || "Guest" })),
      recentTickets: d.tickets.slice(0, 6),
      recentCustomers,
    };
  },

  async products(headers) {
    requireAuth(headers, "admin");
    await delay();
    return getDb().products.map(publicProduct);
  },

  async createProduct(headers, payload) {
    requireAuth(headers, "admin");
    const d = getDb();
    const nextId = String(Math.max(...d.products.map((p) => Number(p.id))) + 1);
    const product = {
      id: nextId,
      name: payload.name,
      brand: payload.brand || "Jerry",
      category: payload.category,
      tagline: payload.tagline || "",
      description: payload.description || "",
      price: Number(payload.price),
      mrp: Number(payload.mrp || payload.price),
      discount: payload.discount !== undefined ? Number(payload.discount) : Math.round(((payload.mrp - payload.price) / payload.mrp) * 100) || 0,
      stock: Number(payload.stock) || 0,
      rating: 0,
      reviewCount: 0,
      specs: payload.specs || {},
      tags: payload.tags || [],
      images: payload.images?.length ? payload.images : [payload.image].filter(Boolean),
      gallery: payload.images?.length ? payload.images : [payload.image].filter(Boolean),
    };
    if (!product.name || !product.category) throw new ApiError("Name and category are required.");
    d.products.unshift(product);
    persist(d);
    return { message: "Product created successfully.", product: publicProduct(product) };
  },

  async updateProduct(headers, id, payload) {
    requireAuth(headers, "admin");
    const d = getDb();
    const p = d.products.find((x) => x.id === String(id));
    if (!p) throw new ApiError("Product not found.", 404);
    Object.assign(p, {
      name: payload.name ?? p.name,
      brand: payload.brand ?? p.brand,
      category: payload.category ?? p.category,
      tagline: payload.tagline ?? p.tagline,
      description: payload.description ?? p.description,
      price: payload.price !== undefined ? Number(payload.price) : p.price,
      mrp: payload.mrp !== undefined ? Number(payload.mrp) : p.mrp,
      stock: payload.stock !== undefined ? Number(payload.stock) : p.stock,
      specs: payload.specs ?? p.specs,
    });
    p.discount = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
    p.images = p.gallery = p.gallery || [p.img].filter(Boolean);
    persist(d);
    return { message: "Product updated successfully.", product: publicProduct(p) };
  },

  async deleteProduct(headers, id) {
    requireAuth(headers, "admin");
    const d = getDb();
    const idx = d.products.findIndex((x) => x.id === String(id));
    if (idx === -1) throw new ApiError("Product not found.", 404);
    d.products.splice(idx, 1);
    persist(d);
    return { message: "Product deleted." };
  },

  async orders(headers) {
    requireAuth(headers, "admin");
    await delay();
    const d = getDb();
    return d.orders.map((o) => ({
      ...publicOrder(o),
      customerName: (d.users.find((u) => u.id === o.userId) || {}).name || "Guest",
    }));
  },

  async updateOrder(headers, id, payload) {
    requireAuth(headers, "admin");
    const d = getDb();
    const o = d.orders.find((x) => x.id === String(id));
    if (!o) throw new ApiError("Order not found.", 404);
    const newStatus = payload.status;
    if (newStatus && newStatus !== o.status) {
      o.status = newStatus;
      const mapping = { Pending: "Order Placed", Confirmed: "Order Confirmed", Processing: "Processing", Shipped: "Shipped", Delivered: "Delivered", Cancelled: "Cancelled" };
      o.timeline = o.timeline.map((step) => {
        if (!step.done && step.label === mapping[newStatus]) return { ...step, done: true, at: dstr(new Date()) };
        if (newStatus === "Cancelled") return { ...step, done: false };
        return step;
      });
      if (newStatus === "Delivered") o.timeline = o.timeline.map((s) => ({ ...s, done: true, at: s.at || dstr(new Date()) }));
    }
    if (payload.paymentStatus) o.paymentStatus = payload.paymentStatus;
    persist(d);
    return { message: "Order updated successfully.", order: publicOrder(o) };
  },

  async users(headers) {
    requireAuth(headers, "admin");
    await delay();
    const d = getDb();
    return d.users.map((u) => ({
      ...publicUser(u),
      orders: d.orders.filter((o) => o.userId === u.id).length,
      totalSpent: d.orders.filter((o) => o.userId === u.id && o.paymentStatus === "Paid").reduce((s, o) => s + o.total, 0),
    }));
  },

  async serviceRequests(headers, { status = "" } = {}) {
    requireAuth(headers, "admin");
    await delay();
    const d = getDb();
    return d.serviceRequests
      .filter((r) => (status ? r.status === status : true))
      .map((r) => ({
        ...r,
        customerName: r.customerName || (d.users.find((u) => u.id === r.userId) || {}).name || "Guest",
        customerEmail: r.email || (d.users.find((u) => u.id === r.userId) || {}).email || "",
        phone: r.phone || (d.users.find((u) => u.id === r.userId) || {}).phone || "",
      }));
  },

  async updateServiceRequest(headers, id, payload) {
    requireAuth(headers, "admin");
    const d = getDb();
    const r = d.serviceRequests.find((x) => x.id === String(id));
    if (!r) throw new ApiError("Service request not found.", 404);
    if (payload.status && payload.status !== r.status) {
      r.status = payload.status;
      const stepMap = { Requested: "Requested", Confirmed: "Confirmed", "Technician Assigned": "Technician Assigned", Scheduled: "Scheduled", "In Progress": "In Progress", Completed: "Completed", Cancelled: "Cancelled" };
      r.timeline = r.timeline.map((s) => {
        if (stepMap[s.label] === payload.status) return { ...s, done: true, at: s.at || dstr(new Date()) };
        if (payload.status === "Cancelled") return { ...s, done: false };
        return s;
      });
      if (payload.status === "Completed") r.timeline = r.timeline.map((s) => ({ ...s, done: true, at: s.at || dstr(new Date()) }));
    }
    if (payload.technician) r.technician = { name: payload.technician, phone: "+91 90000 00" + pad(d.techs.indexOf(payload.technician) + 1, 3) };
    if (payload.scheduledDate) r.scheduledDate = payload.scheduledDate;
    if (payload.notes !== undefined) {
      const entry = { label: "Note added", at: dstr(new Date()), text: payload.notes };
      r.history = [...(r.history || []), entry];
    }
    persist(d);
    return { message: "Service request updated successfully.", request: r };
  },

  async supportTickets(headers, { status = "", priority = "" } = {}) {
    requireAuth(headers, "admin");
    await delay();
    const d = getDb();
    return d.tickets
      .filter((t) => (status ? t.status === status : true))
      .filter((t) => (priority ? t.priority === priority : true))
      .map((t) => ({
        ...t,
        customerName: (d.users.find((u) => u.id === t.userId) || {}).name || "Guest",
        customerEmail: (d.users.find((u) => u.id === t.userId) || {}).email || "",
      }));
  },

  async updateSupportTicket(headers, id, payload) {
    requireAuth(headers, "admin");
    const d = getDb();
    const t = d.tickets.find((x) => x.id === String(id));
    if (!t) throw new ApiError("Ticket not found.", 404);
    if (payload.status) t.status = payload.status;
    if (payload.priority) t.priority = payload.priority;
    if (payload.replyText) {
      t.messages.push({
        id: "m" + Date.now(),
        author: "Support Team",
        role: "agent",
        text: payload.replyText,
        at: dstr(new Date()),
      });
      if (!["Resolved", "Closed"].includes(payload.status)) t.status = "Waiting for Customer";
    }
    t.updatedAt = dstr(new Date());
    persist(d);
    return { message: "Ticket updated successfully.", ticket: t };
  },

  async stats(headers) {
    requireAuth(headers, "admin");
    return this.dashboard(headers);
  },
};

/** Generate demo dashboard statistics for a brand-new admin account. */
export const mockBackend = {
  auth,
  catalogue,
  order,
  service,
  support,
  profile,
  admin,
  getDb,
  seed: () => {
    db = null;
    localStorage.removeItem(DB_KEY);
    return loadDb();
  },
};

/* Convenience for the demo login screen */
export const demoAccounts = [
  { email: "admin@jerry.com", password: "Admin@123", role: "admin", name: "Jerry Admin" },
  { email: "user@jerry.com", password: "User@123", role: "user", name: "Saraniya" },
];
