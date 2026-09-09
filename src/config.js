/**
 * Central environment configuration.
 * All endpoints live in src/api/ — components never touch URLs.
 */
const env = import.meta.env;

export const config = {
  /** Base URL of the Django REST API, e.g. http://localhost:8000/api */
  apiUrl: env.VITE_API_URL || "http://127.0.0.1:8000/api",

  /**
   * true  → the app runs against the in-browser mock backend (no Django
   *         needed) so every flow can be experienced today.
   * false → all calls go to the real Django REST API.
   */
  useMock: String(env.VITE_USE_MOCK ?? "true").toLowerCase() === "true",

  /** In mock mode, show the generated OTP in a demo banner on the UI. */
  showMockOtp: String(env.VITE_SHOW_MOCK_OTP ?? "true").toLowerCase() === "true",

  isDev: env.DEV === true,
};

export const currency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const formatMoney = currency;
