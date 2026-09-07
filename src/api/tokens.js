/**
 * Token storage helpers. The AuthContext and the axios interceptor
 * both read/write through here so refresh flows stay in sync.
 * JWT secrets never appear in this codebase — tokens are only stored
 * after Django issues them.
 */

const KEY = "jc_auth";

export function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeAuth(auth) {
  try {
    localStorage.setItem(KEY, JSON.stringify(auth));
  } catch {
    /* noop */
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

export function getAccessToken() {
  return loadStoredAuth()?.access || null;
}

export function getRefreshToken() {
  return loadStoredAuth()?.refresh || null;
}
