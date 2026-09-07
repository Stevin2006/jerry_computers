/** Service request API (customer side). */

import api from "./axios";
import { config } from "@/config";
import { mockBackend } from "./mockBackend";
import { getAccessToken } from "./tokens";

const authHeader = () => ({ Authorization: `Bearer ${getAccessToken()}` });

/** GET /api/services/ — service categories offered. */
export async function getServiceCategories() {
  if (config.useMock) return mockBackend.service.categories();
  const { data } = await api.get("/services/");
  return data;
}

/** POST /api/services/request/ — submit a service request. */
export async function requestService(payload) {
  if (config.useMock) return mockBackend.service.request(authHeader(), payload);
  const { data } = await api.post("/services/request/", payload);
  return data;
}

/** GET /api/my-services/ — the customer's service requests. */
export async function getMyServices() {
  if (config.useMock) return mockBackend.service.mine(authHeader());
  const { data } = await api.get("/my-services/");
  return data;
}

/** GET /api/service-history/ — completed services. */
export async function getServiceHistory() {
  if (config.useMock) return mockBackend.service.history(authHeader());
  const { data } = await api.get("/service-history/");
  return data;
}
