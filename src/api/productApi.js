/** Product / catalogue API. */

import api from "./axios";
import { config } from "@/config";
import { mockBackend } from "./mockBackend";

/**
 * GET /api/products/
 * params: { search, category, brand, maxPrice, minRating, sort, page, pageSize }
 */
export async function getProducts(params = {}) {
  if (config.useMock) return mockBackend.catalogue.list(params);
  const { data } = await api.get("/products/", { params });
  return data;
}

/** GET /api/products/:id/ */
export async function getProduct(id) {
  if (config.useMock) return mockBackend.catalogue.detail(id);
  const { data } = await api.get(`/products/${id}/`);
  return data;
}

/** GET /api/categories/ */
export async function getCategories() {
  if (config.useMock) return mockBackend.catalogue.categories();
  const { data } = await api.get("/categories/");
  return data;
}

/** Distinct product brands (for filters). */
export async function getBrands() {
  if (config.useMock) return mockBackend.catalogue.brands();
  const { data } = await api.get("/brands/");
  return data;
}
