import { cx } from "@/lib/utils";

/**
 * Maps workflow statuses to visual tones. Status is never conveyed by
 * colour alone: the badge always includes the status text itself.
 */
const TONE_MAP = {
  /* orders */
  Pending: "warning",
  Confirmed: "info",
  Processing: "primary",
  Shipped: "primary",
  Delivered: "success",
  Cancelled: "danger",
  /* service requests */
  Requested: "info",
  "Technician Assigned": "violet",
  Scheduled: "warning",
  "In Progress": "primary",
  Completed: "success",
  /* tickets */
  Open: "primary",
  Assigned: "violet",
  "Waiting for Customer": "warning",
  Resolved: "success",
  Closed: "neutral",
  /* payment */
  Paid: "success",
  Failed: "danger",
  Refunded: "neutral",
  /* users */
  Active: "success",
  Blocked: "danger",
  /* priority */
  Low: "neutral",
  Medium: "info",
  High: "warning",
  Urgent: "danger",
  /* generic */
  Yes: "success",
  No: "danger",
  true: "success",
  false: "neutral",
};

export default function StatusBadge({ status, tone, dot = true, className }) {
  const text = status ?? "—";
  const t = tone || TONE_MAP[String(text)] || "neutral";
  return (
    <span className={cx("badge", dot && "badge--dot", className)} data-tone={t} role="status">
      {text}
    </span>
  );
}

/** Progress timeline for service requests (vertical). */
export function Timeline({ steps = [] }) {
  const firstOpen = steps.findIndex((s) => !s.done);
  return (
    <ol className="tl">
      {steps.map((s, i) => {
        const isCurrent = i === firstOpen;
        const cancelled = steps.some((x) => x.label === "Cancelled" && x.done);
        let cls = "tl__item";
        if (s.done && !cancelled) cls += " tl__item--done";
        if (isCurrent && !cancelled) cls += " tl__item--current";
        if (cancelled && s.done && s.label === "Cancelled") cls += " tl__item--cancelled";
        return (
          <li key={s.label + i} className={cls}>
            <div className="tl__date">{s.at ? new Date(s.at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Pending"}</div>
            <div className="tl__title">{s.label}</div>
            {s.text && <div className="tl__text">{s.text}</div>}
          </li>
        );
      })}
    </ol>
  );
}

/** Horizontal stepper used for orders. */
export function Stepper({ steps = [] }) {
  const firstOpen = steps.findIndex((s) => !s.done);
  return (
    <div className="stepper" aria-label="Order progress">
      {steps.map((s, i) => {
        const cls = s.done ? "stepper__step stepper__step--done" : i === firstOpen ? "stepper__step stepper__step--current" : "stepper__step";
        return (
          <div key={s.label + i} className={cls}>
            <span className="stepper__dot">{s.done ? "✓" : i + 1}</span>
            <span className="label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
