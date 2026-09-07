/** Support ticket API (customer side). */

import api from "./axios";
import { config } from "@/config";
import { mockBackend } from "./mockBackend";
import { getAccessToken } from "./tokens";

const authHeader = () => ({ Authorization: `Bearer ${getAccessToken()}` });

/** GET /api/support/tickets/ */
export async function getMyTickets() {
  if (config.useMock) return mockBackend.support.mine(authHeader());
  const { data } = await api.get("/support/tickets/");
  return data;
}

/** GET /api/support/tickets/:id/ */
export async function getTicket(id) {
  if (config.useMock) return mockBackend.support.detail(authHeader(), id);
  const { data } = await api.get(`/support/tickets/${id}/`);
  return data;
}

/** POST /api/support/tickets/ */
export async function createTicket(payload) {
  if (config.useMock) return mockBackend.support.create(authHeader(), payload);
  const { data } = await api.post("/support/tickets/", payload);
  return data;
}

/** POST /api/support/tickets/:id/reply/ */
export async function replyTicket(id, payload) {
  if (config.useMock) return mockBackend.support.reply(authHeader(), id, payload);
  const { data } = await api.post(`/support/tickets/${id}/reply/`, payload);
  return data;
}
