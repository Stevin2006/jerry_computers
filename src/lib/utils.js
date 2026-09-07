export const cx = (...parts) => parts.filter(Boolean).join(" ");

export const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export const prettyDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
};

export const errorMessage = (err) => {
  if (!err) return "Something went wrong.";
  if (typeof err === "string") return err;
  return err.message || "Something went wrong. Please try again.";
};

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
