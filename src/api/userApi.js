/** User profile API. */

import api from "./axios";
import { config } from "@/config";
import { mockBackend } from "./mockBackend";
import { getAccessToken } from "./tokens";

const authHeader = () => ({ Authorization: `Bearer ${getAccessToken()}` });

/** GET /api/profile/ */
export async function getProfile() {
  if (config.useMock) return mockBackend.profile.get(authHeader());
  const { data } = await api.get("/profile/");
  return data;
}

/** PUT /api/profile/ */
export async function updateProfile(payload) {
  if (config.useMock) return mockBackend.profile.update(authHeader(), payload);
  const { data } = await api.put("/profile/", payload);
  return data;
}
