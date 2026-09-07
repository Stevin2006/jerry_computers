/**
 * Centralised Axios instance.
 * ------------------------------------------------------------------
 *  • baseURL comes from VITE_API_URL (never hardcoded in pages)
 *  • request interceptor attaches: Authorization: Bearer <access>
 *  • response interceptor refreshes the access token once when it
 *    expires, then retries the original request
 *  • if the refresh itself fails → clears auth and redirects to login
 */

import axios from "axios";
import { config } from "@/config";
import { loadStoredAuth, storeAuth, clearStoredAuth, getAccessToken, getRefreshToken } from "./tokens";

export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((request) => {
  const token = getAccessToken();
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

/* ---------- single-flight refresh ---------- */
let refreshPromise = null;

async function tryRefresh() {
  const refresh = getRefreshToken();
  if (!refresh) {
    const err = new Error("Your session has expired. Please log in again.");
    err.status = 401;
    throw err;
  }
  const { data } = await axios.post(`${config.apiUrl}/auth/token/refresh/`, { refresh });
  const stored = loadStoredAuth() || {};
  storeAuth({ ...stored, access: data.access, refresh: data.refresh || refresh });
  window.dispatchEvent(new CustomEvent("jc:tokens-refreshed", { detail: data }));
  return data.access;
}

function handleSessionExpired() {
  clearStoredAuth();
  window.dispatchEvent(new CustomEvent("jc:auth-expired"));
}

/* Extract a readable message from Django-style error payloads */
function extractError(payload, fallback) {
  if (!payload) return fallback;
  const candidates = ["detail", "message", "non_field_errors", "error"];
  for (const key of candidates) {
    const v = payload[key];
    if (v) return Array.isArray(v) ? v.join(" ") : String(v);
  }
  // field errors like { email: ["Enter a valid email."] }
  for (const key of Object.keys(payload)) {
    const v = payload[key];
    if (Array.isArray(v) && v.length) return `${key}: ${v.join(" ")}`;
  }
  return fallback;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    const payload = error.response?.data;

    if (status === 401 && !original._retried && getRefreshToken()) {
      original._retried = true;
      try {
        refreshPromise = refreshPromise || tryRefresh();
        const access = await refreshPromise;
        refreshPromise = null;
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${access}`;
        return api(original);
      } catch (refreshError) {
        refreshPromise = null;
        handleSessionExpired();
        const err = new Error(
          (refreshError.response?.data && extractError(refreshError.response.data, "Session expired. Please log in again.")) ||
            "Your session has expired. Please log in again."
        );
        err.status = 401;
        throw err;
      }
    }

    if (status === 401) handleSessionExpired();

    const message = error.code === "ECONNABORTED" ? "The request timed out. Please try again." : status === 0 || !error.response
        ? "Cannot reach the server. Please check your connection."
        : extractError(payload, "Something went wrong. Please try again.");
    const err = new Error(message);
    err.status = status || 0;
    throw err;
  }
);

export default api;
