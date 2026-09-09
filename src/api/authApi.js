/**
 * Authentication API.
 * Django owns OTP generation, SMTP delivery, password hashing and
 * JWT issuance. The React app only exchanges credentials / codes.
 */

import api from "./axios";
import { config } from "@/config";
import { mockBackend, getPendingOtp as mockOtp } from "./mockBackend";

/** 1) Register — creates a pending account, Django emails the OTP. */
export async function register(payload) {
  if (config.useMock) return mockBackend.auth.register(payload);
  const { data } = await api.post("http://127.0.0.1:8000/api/auth/register/", payload);
  return data;
}

/** 2) Verify the registration OTP — returns access/refresh/user. */
export async function verifyRegistrationOtp(payload) {
  if (config.useMock) return mockBackend.auth.verifyRegistrationOtp(payload);
  const { data } = await api.post("/auth/verify-registration-otp/", payload);
  return data;
}

/** 1) Login — Django validates credentials and emails an OTP. */
export async function login(payload) {
  if (config.useMock) return mockBackend.auth.login(payload);
  const { data } = await api.post("/auth/login/", payload);
  return data;
}

/** 2) Verify the login OTP — returns access/refresh/user. */
export async function verifyLoginOtp(payload) {
  if (config.useMock) return mockBackend.auth.verifyLoginOtp(payload);
  const { data } = await api.post("/auth/verify-login-otp/", payload);
  return data;
}

/** Resend OTP (mock-aware). */
export async function resendOtp(payload) {
  if (config.useMock) return mockBackend.auth.resendOtp(payload);
  const { data } = await api.post("/auth/resend-otp/", payload);
  return data;
}

/** Exchange a refresh token for a new access token. */
export async function refreshToken(refresh) {
  if (config.useMock) return mockBackend.auth.refresh(refresh);
  const { data } = await api.post("/auth/token/refresh/", { refresh });
  return data;
}

/**
 * DEMO ONLY: in mock mode the OTP is displayed in a banner so the
 * flow can be tested without email. Never called in production mode.
 */
export async function getDemoOtp() {
  if (!config.useMock || !config.showMockOtp) return null;
  const rec = mockOtp();
  return rec ? { otp: rec.otp, email: rec.email, purpose: rec.purpose } : null;
}

