/**
 * AuthContext — single source of truth for authentication state.
 * ------------------------------------------------------------------
 * Owns: current user, role, access/refresh tokens and helpers:
 *   login(), verifyLoginOTP(), register(), verifyRegistrationOTP(),
 *   resendOtp(), refreshToken(), logout(), updateUser()
 *
 * Django performs all real security work. React only persists the
 * JWT pair Django returns and exposes the current user for UI/nav.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "@/api/authApi";
import { loadStoredAuth, storeAuth, clearStoredAuth, getRefreshToken } from "@/api/tokens";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  /* hydrate session on first load */
  useEffect(() => {
    const stored = loadStoredAuth();
    if (stored?.user) setUser(stored.user);
    setInitializing(false);
  }, []);

  /* session expiry broadcast by the axios interceptor */
  useEffect(() => {
    const onExpired = () => {
      clearStoredAuth();
      setUser(null);
      window.dispatchEvent(new CustomEvent("jc:toast", { detail: { type: "info", message: "Your session expired. Please log in again." } }));
    };
    const onToast = (e) => {
      window.dispatchEvent(e.detail && e.detail.type ? e : new Event("noop"));
    };
    window.addEventListener("jc:auth-expired", onExpired);
    window.addEventListener("jc:toast", onToast);
    return () => {
      window.removeEventListener("jc:auth-expired", onExpired);
      window.removeEventListener("jc:toast", onToast);
    };
  }, []);

  const adoptSession = useCallback((data) => {
    const session = {
      access: data.access,
      refresh: data.refresh,
      user: data.user,
    };
    storeAuth(session);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    // Returns { message, requires_otp, email } — the OTP step follows.
    return authApi.login({ email, password });
  }, []);

  const verifyLoginOTP = useCallback(
    async ({ email, otp }) => {
      const data = await authApi.verifyLoginOtp({ email, otp });
      return adoptSession(data);
    },
    [adoptSession]
  );

  const register = useCallback(async (payload) => {
    return authApi.register(payload);
  }, []);

  const verifyRegistrationOTP = useCallback(
    async ({ email, otp }) => {
      const data = await authApi.verifyRegistrationOtp({ email, otp });
      return adoptSession(data);
    },
    [adoptSession]
  );

  const resendOtp = useCallback((payload) => authApi.resendOtp(payload), []);

  const refreshToken = useCallback(() => authApi.refreshToken(getRefreshToken()), []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const updateUser = useCallback(
    (patch) => {
      setUser((prev) => {
        const next = { ...(prev || {}), ...patch };
        const stored = loadStoredAuth();
        if (stored) storeAuth({ ...stored, user: next });
        return next;
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      role: user?.role || null,
      initializing,
      login,
      verifyLoginOTP,
      register,
      verifyRegistrationOTP,
      resendOtp,
      refreshToken,
      logout,
      updateUser,
    }),
    [user, initializing, login, verifyLoginOTP, register, verifyRegistrationOTP, resendOtp, refreshToken, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
