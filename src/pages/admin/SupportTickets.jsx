import { useEffect, useMemo, useState } from "react";
import { adminGetSupportTickets, adminUpdateSupportTicket } from "@/api/adminApi";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { SkeletonRows } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { IcHeadset, IcSearch, IcSend, IcPaperclip } from "@/components/Icons";
import { prettyDate, initials } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const STATUSES = ["Open", "Assigned", "In Progress", "Waiting for Customer", "Resolved", "Closed"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

export default function SupportTickets() {
  const toast = useToast();
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [manage, setManage] = useState(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setError(null);
    try {
      setList(await adminGetSupportTickets());
    } catch (e) {
      setError(e);
      setList([]);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const open = useMemo(() => (list || []).filter((t) => !["Resolved", "Closed"].includes(t.status)).length, [list]);

  const filtered = useMemo(() => {
    if (!list) return [];
    const ql = q.trim().toLowerCase();
    return list.filter(
      (t) =>
        (!statusFilter || t.status === statusFilter) &&
        (!priorityFilter || t.priority === priorityFilter) &&
        (!ql || t.id.toLowerCase().includes(ql) || t.subject.toLowerCase().includes(ql) || (t.customerName || "").toLowerCase().includes(ql))
    );
  }, [list, q, statusFilter, priorityFilter]);

  const patch = async (t, payload) => {
    setBusy(true);
    try {
      await adminUpdateSupportTicket(t.id, payload);
      toast.success("Ticket updated.", t.id);
      setManage((m) => (m ? { ...m, ...payload, updatedAt: "just now" } : m));
      load();
    } catch (e) {
      toast.error(e?.message || "Could not update the ticket.");
    } finally {
      setBusy(false);
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    await patch(manage, { replyText: reply.trim(), status: manage.status === "Closed" ? "Closed" : "Waiting for Customer" });
    setReply("");
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="admin-h1">Support Tickets</h1>
        <p className="muted small" style={{ margin: 0 }}>
          {open} open · {list?.length || 0} total
        </p>
      </div>

      <div className="flex-align wrap" style={{ gap: 10, marginBottom: 16 }}>
        <div className="input-icon" style={{ width: 300, maxWidth: "100%" }}>
          <IcSearch size={16} />
          <input className="input" placeholder="Search ID, subject, customer…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search tickets" />
        </div>
        <select className="select" style={{ width: 170 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className="select" style={{ width: 140 }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} aria-label="Filter priority">
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      {error ? (
        <ErrorMessage error={error} onRetry={load} />
      ) : !list ? (
        <SkeletonRows rows={6} />
      ) : (
        <div className="table-wrap">
          <table className="table table--hover">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Subject</th>
                <th>Customer</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Last activity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>
                    <b className="cell-title">{t.id}</b>
                    <span className="cell-sub" style={{ display: "block" }}>
                      {prettyDate(t.createdAt)}
                    </span>
                  </td>
                  <td>
                    <span className="cell-title" style={{ display: "block", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13.5 }}>
                      {t.subject}
                    </span>
                    <span className="cell-sub">{t.category}</span>
                  </td>
                  <td className="small">
                    {t.customerName}
                    <span className="cell-sub" style={{ display: "block" }}>
                      {t.customerEmail}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={t.priority} dot={false} />
                  </td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="small muted">{prettyDate(t.updatedAt || t.createdAt)}</td>
                  <td>
                    <button className="icon-mini" onClick={() => { setManage(t); setReply(""); }} aria-label={`Manage ${t.id}`}>
                      <IcHeadset size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty">
                      <IcHeadset size={26} style={{ color: "var(--faint)" }} />
                      <p className="muted">No tickets found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(manage)} onClose={() => setManage(null)} title={manage ? `Manage ${manage.id}` : ""} labelledBy="ticket-manage-title" size="lg">
        {manage && (
          <div style={{ display: "grid", gap: 16 }}>
            <div className="flex-between wrap" style={{ gap: 10 }}>
              <div>
                <b style={{ display: "block", fontSize: 16 }}>{manage.subject}</b>
                <span className="muted small">
                  {manage.customerName} · {manage.customerEmail} · {manage.category}
                </span>
              </div>
              <div className="flex-align wrap" style={{ gap: 8 }}>
                <select className="select" style={{ width: 130 }} value={manage.priority} onChange={(e) => patch(manage, { priority: e.target.value })} aria-label="Priority">
                  {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <select className="select" style={{ width: 170 }} value={manage.status} onChange={(e) => patch(manage, { status: e.target.value })} aria-label="Status">
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {manage.product && (
              <span className="tag">
                <IcPaperclip size={13} /> {manage.product}
              </span>
            )}

            <div className="ticket-thread" style={{ maxHeight: 320, overflowY: "auto", padding: 4 }}>
              {manage.messages?.map((m, i) => (
                <div key={m.id || i} className={`msg ${m.role === "agent" ? "msg--admin" : ""}`}>
                  <span className={`avatar avatar--sm ${m.role === "agent" ? "avatar--violet" : "avatar--teal"}`}>{initials(m.author)}</span>
                  <div className="msg__body">
                    <div className="msg__head">
                      <span className="msg__who">
                        {m.author} <small>{m.role === "agent" ? "· Support" : ""}</small>
                      </span>
                      <span className="msg__when">{prettyDate(m.at)}</span>
                    </div>
                    <p>{m.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {!["Resolved", "Closed"].includes(manage.status) && (
              <div className="flex-align" style={{ gap: 8, alignItems: "flex-end" }}>
                <textarea className="textarea" rows={2} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply to the customer as Support Team…" aria-label="Reply text" style={{ flex: 1 }} />
                <button className="btn btn--primary" disabled={!reply.trim() || busy} onClick={sendReply}>
                  <IcSend size={16} /> Send
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
