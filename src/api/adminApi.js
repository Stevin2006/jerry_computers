/** Admin endpoints (role-gated — Django enforces authorization). */

import api from "./axios";
import { config } from "@/config";
import { mockBackend } from "./mockBackend";
import { getAccessToken } from "./tokens";

const authHeader = () => ({ Authorization: `Bearer ${getAccessToken()}` });

/* ---------- dashboard ---------- */
export async function getDashboard() {
  if (config.useMock) return mockBackend.admin.dashboard(authHeader());
  const { data } = await api.get("/admin/dashboard/");
  return data;
}

/* ---------- products ---------- */
export async function adminGetProducts() {
  if (config.useMock) return mockBackend.admin.products(authHeader());
  const { data } = await api.get("/admin/products/");
  return data;
}
export async function adminCreateProduct(payload) {
  if (config.useMock) return mockBackend.admin.createProduct(authHeader(), payload);
  const { data } = await api.post("/admin/products/", payload);
  return data;
}
export async function adminUpdateProduct(id, payload) {
  if (config.useMock) return mockBackend.admin.updateProduct(authHeader(), id, payload);
  const { data } = await api.put(`/admin/products/${id}/`, payload);
  return data;
}
export async function adminDeleteProduct(id) {
  if (config.useMock) return mockBackend.admin.deleteProduct(authHeader(), id);
  const { data } = await api.delete(`/admin/products/${id}/`);
  return data;
}

/* ---------- orders ---------- */
export async function adminGetOrders() {
  if (config.useMock) return mockBackend.admin.orders(authHeader());
  const { data } = await api.get("/admin/orders/");
  return data;
}
export async function adminUpdateOrder(id, payload) {
  if (config.useMock) return mockBackend.admin.updateOrder(authHeader(), id, payload);
  const { data } = await api.put(`/admin/orders/${id}/`, payload);
  return data;
}

/* ---------- users ---------- */
export async function adminGetUsers() {
  if (config.useMock) return mockBackend.admin.users(authHeader());
  const { data } = await api.get("/admin/users/");
  return data;
}

/* ---------- service requests ---------- */
export async function adminGetServiceRequests(filters = {}) {
  if (config.useMock) return mockBackend.admin.serviceRequests(authHeader(), filters);
  const { data } = await api.get("/admin/service-requests/", { params: filters });
  return data;
}
export async function adminUpdateServiceRequest(id, payload) {
  if (config.useMock) return mockBackend.admin.updateServiceRequest(authHeader(), id, payload);
  const { data } = await api.put(`/admin/service-requests/${id}/`, payload);
  return data;
}

/* ---------- support tickets ---------- */
export async function adminGetSupportTickets(filters = {}) {
  if (config.useMock) return mockBackend.admin.supportTickets(authHeader(), filters);
  const { data } = await api.get("/admin/support-tickets/", { params: filters });
  return data;
}
export async function adminUpdateSupportTicket(id, payload) {
  if (config.useMock) return mockBackend.admin.updateSupportTicket(authHeader(), id, payload);
  const { data } = await api.put(`/admin/support-tickets/${id}/`, payload);
  return data;
}
