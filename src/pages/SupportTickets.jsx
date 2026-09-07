import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageHead from "@/components/PageHead";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { SkeletonRows } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import { IcMessageCircle, IcPlus, IcPaperclip, IcX, IcArrowRight, IcCheckCircle, IcAlertCircle } from "@/components/Icons";
import { getMyTickets, createTicket } from "@/api/supportApi";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { prettyDate, cx } from "@/lib/utils";

const CATEGORIES = ["General Support", "Product Support", "Order Support", "Printer Support", "CCTV / Security", "Gaming", "Software", "Warranty & Returns", "Service / Technician", "Billing"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const FILTERS = [
  ["all", "All tickets"],
  ["open", "Open"],
  ["waiting", "Waiting for you"],
  ["resolved", "Resolved / Closed"],
];

export default function SupportTickets() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const wantNew = params.get("new") === "1";
  const productHint = params.get("product");
  const orderHint = params.get("order");

  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showNew, setShowNew] = useState(wantNew);

  const load = async () => {
    if (!isAuthenticated) return;
    setError(null);
    try {
      setTickets(await getMyTickets());
    } catch (e) {
      setError(e);
      setTickets([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const visible = useMemo(() => {
    if (!tickets) return [];
    if (filter === "open") return tickets.filter((t) => !["Resolved", "Closed"].includes(t.status));
    if (filter === "waiting") return tickets.filter((t) => t.status === "Waiting for Customer");
    if (filter === "resolved") return tickets.filter((t) => ["Resolved", "Closed"].includes(t.status));
    return tickets;
  }, [tickets, filter]);

  const closeNew = () => {
    setShowNew(false);
    const next = new URLSearchParams(params);
    next.delete("new");
    setParams(next, { replace: true });
  };

  if (!isAuthenticated) {
    return (
      <div className="page--plain">
        <PageHead title="SUPPORT TICKETS" sub="Create, reply and track support tickets with our team." crumb="Home" crumbs={[{ label: "Support", to: "/support" }, { label: "Tickets" }]} />
        <section className="section">
          <div className="container" style={{ maxWidth: 640 }}>
            <EmptyState
              icon={<IcMessageCircle size={32} />}
              title="Log in to open a ticket"
              text="Create an account or log in to raise support tickets, reply to our team and track resolution progress."
              action={
                <Link to="/login" className="btn btn--primary">
                  Log in / Register
                </Link>
              }
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page--plain">
      <PageHead
        title="SUPPORT TICKETS"
        sub="One place to raise issues, reply to our team and track resolution."
        crumb="Home"
        crumbs={[{ label: "Support", to: "/support" }, { label: "Tickets" }]}
        actions={
          <button className="btn btn--primary" onClick={() => setShowNew(true)}>
            <IcPlus size={17} /> New Ticket
          </button>
        }
      />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 980 }}>
          {error ? (
            <ErrorMessage error={error} onRetry={load} />
          ) : tickets === null ? (
            <SkeletonRows rows={4} />
          ) : tickets.length === 0 ? (
            <EmptyState
              icon={<IcMessageCircle size={32} />}
              title="No tickets yet"
              text="Something not working right? Open a ticket and our support team will jump on it."
              action={
                <button className="btn btn--primary" onClick={() => setShowNew(true)}>
                  <IcPlus size={16} /> Open your first ticket
                </button>
              }
            />
          ) : (
            <div className="ticket-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="flex-align wrap" style={{ gap: 8, marginBottom: 16 }}>
                {FILTERS.map(([k, label]) => (
                  <button key={k} className={cx("btn btn--sm", filter === k ? "btn--dark" : "btn--outline")} onClick={() => setFilter(k)}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                {visible.map((t) => (
                  <article className="order-card card card--hover ticket-card" key={t.id}>
                    <Link to={`/support/tickets/${t.id}`} style={{ display: "block", textDecoration: "none", color: "inherit", padding: "18px 22px" }}>
                      <div className="flex-between" style={{ gap: 12, marginBottom: 8 }}>
                        <span className="oid" style={{ color: "var(--primary)" }}>
                          {t.id}
                        </span>
                        <div className="flex-align wrap" style={{ gap: 6 }}>
                          <StatusBadge status={t.status} dot={false} />
                          <StatusBadge status={t.priority} dot={false} />
                        </div>
                      </div>
                      <h3 className="ticket-subject" style={{ margin: "0 0 4px", fontSize: 15.5 }}>
                        {t.subject}
                      </h3>
                      <div className="sub">
                        <span>{t.category}</span>·<span>Last activity {prettyDate(t.updatedAt || t.createdAt)}</span>·<span>{t.messages.length} messages</span>
                      </div>
                    </Link>
                  </article>
                ))}
                {visible.length === 0 && (
                  <EmptyState icon={<IcCheckCircle size={30} />} title="Nothing here" text="No tickets match this filter." />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {showNew && (
        <NewTicketModal
          onClose={closeNew}
          onCreated={(t) => {
            closeNew();
            load();
            toast.success("Ticket created — our team will reply soon.", t.id);
            navigate(`/support/tickets/${t.id}`);
          }}
          productHint={productHint}
          orderHint={orderHint}
        />
      )}
    </div>
  );
}

/* ---------- create ticket modal ---------- */
function NewTicketModal({ onClose, onCreated, productHint, orderHint }) {
  const [form, setForm] = useState({
    subject: "",
    category: productHint ? "Product Support" : orderHint ? "Order Support" : "General Support",
    product: productHint ? decodeURIComponent(productHint) : orderHint ? `Order ${decodeURIComponent(orderHint)}` : "",
    description: "",
    priority: "Medium",
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.subject.trim()) errs.subject = "Give your ticket a short subject";
    if (form.description.trim().length < 20) errs.description = "Please describe the issue (at least 20 characters)";
    setErrors(errs);
    if (Object.keys(errs).length) return toast.error("Please complete the required fields.");
    setBusy(true);
    try {
      const data = await createTicket({ ...form, attachments: files.map((f) => f.name) });
      onCreated(data.ticket);
    } catch (err) {
      toast.error(err?.message || "Could not create the ticket.", "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Open a Support Ticket" labelledBy="new-ticket-title" size="lg">
      <form onSubmit={submit} noValidate id="new-ticket-form">
        <div className="field">
          <label className="label" htmlFor="t-subject">
            Subject <span className="req">*</span>
          </label>
          <input id="t-subject" className="input" value={form.subject} onChange={set("subject")} placeholder="Short summary of the issue" />
          {errors.subject && <span className="field-error">{errors.subject}</span>}
        </div>
        <div className="field-row">
          <div className="field">
            <label className="label" htmlFor="t-cat">
              Category
            </label>
            <select id="t-cat" className="select" value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label" htmlFor="t-priority">
              Priority
            </label>
            <select id="t-priority" className="select" value={form.priority} onChange={set("priority")}>
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="t-product">
            Related product / order
          </label>
          <input id="t-product" className="input" value={form.product} onChange={set("product")} placeholder="e.g. product name or order ID (optional)" />
        </div>
        <div className="field">
          <label className="label" htmlFor="t-desc">
            Description <span className="req">*</span>
          </label>
          <textarea id="t-desc" className="textarea" rows={5} value={form.description} onChange={set("description")} placeholder="What happened, when, and what have you tried?" />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>
        <div className="field">
          <label className="label" htmlFor="t-attach">Attachments</label>
          <label
            htmlFor="t-attach"
            className="input"
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", color: "var(--muted)", fontWeight: 500 }}
          >
            <IcPaperclip size={17} /> {files.length ? files.map((f) => f.name).join(", ") : "Attach screenshots or files (optional)"}
          </label>
          <input
            id="t-attach"
            type="file"
            multiple
            hidden
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
          {files.length > 0 && (
            <button type="button" className="btn btn--ghost btn--sm mt-8" onClick={() => setFiles([])}>
              <IcX size={14} /> Clear attachments
            </button>
          )}
          <p className="hint">Max 5 files. Demo mode stores file names only — uploads are handled by the backend in production.</p>
        </div>
      </form>
      <div className="modal__foot" style={{ padding: "16px 0 0", borderTop: "1px solid var(--line)", display: "flex", gap: 10 }}>
        <button className="btn btn--outline" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" form="new-ticket-form" className="btn btn--primary" disabled={busy}>
          {busy ? <span className="spinner" /> : <IcArrowRight size={16} />} Submit Ticket
        </button>
      </div>
    </Modal>
  );
}
