/** Order API (customer side). */

import api from "./axios";
import { config } from "@/config";
import { mockBackend } from "./mockBackend";
import { getAccessToken } from "./tokens";

const authHeader = () => ({ Authorization: `Bearer ${getAccessToken()}` });

/** GET /api/orders/ */
export async function getMyOrders() {
  if (config.useMock) return mockBackend.order.mine(authHeader());
  const { data } = await api.get("/orders/");
  return data;
}

/** GET /api/orders/:id/ */
export async function getOrder(id) {
  if (config.useMock) return mockBackend.order.detail(authHeader(), id);
  const { data } = await api.get(`/orders/${id}/`);
  return data;
}

/** POST /api/orders/  { items: [{productId, qty}], address, paymentMethod } */
export async function createOrder(payload) {
  if (config.useMock) return mockBackend.order.create(authHeader(), payload);
  const { data } = await api.post("/orders/", payload);
  return data;
}
