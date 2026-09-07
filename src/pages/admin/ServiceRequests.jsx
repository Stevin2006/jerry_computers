import { useEffect, useMemo, useState } from "react";
import { adminGetServiceRequests, adminUpdateServiceRequest } from "@/api/adminApi";
import StatusBadge, { Timeline } from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { SkeletonRows } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { IcSearch, IcWrench, IcUser, IcCalendar, IcNote } from "@/components/Icons";
import { prettyDate } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const STATUSES = ["Requested", "Confirmed", "Technician Assigned", "Scheduled", "In Progress", "Completed", "Cancelled"];
const TECHS = ["Ramesh Kumar", "Arun Prakash", "Deepak Raj", "Suresh Babu", "Kavitha S"];

export default function ServiceRequests() {
  const toast = useToast();
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");
  const [manage, setManage] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setError(null);
    try {
      setList(await adminGetServiceRequests());
    } catch (e) {
      setError(e);
      setList([]);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!list) return [];
    const ql = q.trim().toLowerCase();
    return list.filter(
      (r) =>
        (!filter || r.status === filter) &&
        (!ql ||
          r.id.toLowerCase().includes(ql) ||
          (r.customerName || "").toLowerCase().includes(ql) ||
          (r.deviceName || "").toLowerCase().includes(ql) ||
          (r.categoryLabel || "").toLowerCase().includes(ql))
    );
  }, [list, q, filter]);

  const pendingCount = useMemo(() => (list || []).filter((r) => !["Completed", "Cancelled"].includes(r.status)).length, [list]);

  const patch = async (r, payload) => {
    setBusy(true);
    try {
      const res = await adminUpdateServiceRequest(r.id, payload);
      toast.success(payload.status ? `Status set to "${payload.status}".` : "Request updated.", r.id);
      setManage((m) => (m ? { ...m, ...res.request } : m));
      load();
    } catch (e) {
      toast.error(e?.message || "Could not update the request.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="admin-h1">Service Requests</h1>
        <p className="muted small" style={{ margin: 0 }}>
          {pendingCount} pending · {list?.length || 0} total
        </p>
      </div>

      <div className="flex-align wrap" style={{ gap: 10, marginBottom: 16 }}>
        <div className="input-icon" style={{ width: 300, maxWidth: "100%" }}>
          <IcSearch size={16} />
          <input className="input" placeholder="Search ID, customer, device…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search service requests" />
        </div>
        <select className="select" style={{ width: 190 }} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
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
                <th>Request</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Device</th>
                <th>Scheduled</th>
                <th>Technician</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <b className="cell-title">{r.id}</b>
                    <span className="cell-sub" style={{ display: "block" }}>
                      {prettyDate(r.createdAt)}
                    </span>
                  </td>
                  <td>
                    <b className="cell-title" style={{ fontSize: 13.5 }}>
                      {r.customerName}
                    </b>
                    <span className="cell-sub" style={{ display: "block" }}>
                      {r.phone || r.customerEmail}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge--primary">{r.categoryLabel || r.category}</span>
                  </td>
                  <td>
                    <span className="cell-title" style={{ fontSize: 13, display: "block", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.deviceName || "—"}
                    </span>
                  </td>
                  <td className="small muted">{r.scheduledDate ? prettyDate(r.scheduledDate) : "—"}</td>
                  <td className="small">{r.technician ? r.technician.name : <span className="muted">Unassigned</span>}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>
                    <button className="icon-mini" onClick={() => { setManage(r); setNote(""); }} aria-label={`Manage ${r.id}`}>
                      <IcWrench size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty">
                      <IcWrench size={26} style={{ color: "var(--faint)" }} />
                      <p className="muted">No service requests found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* manage modal */}
      <Modal open={Boolean(manage)} onClose={() => setManage(null)} title={manage ? `Manage ${manage.id}` : ""} labelledBy="srv-manage-title" size="lg">
        {manage && (
          <div style={{ display: "grid", gap: 18 }}>
            <div className="flex-between wrap" style={{ gap: 10 }}>
              <StatusBadge status={manage.status} />
              <span className="muted small">
                Requested {prettyDate(manage.createdAt)} · {manage.categoryLabel}
              </span>
            </div>

            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field" style={{ margin: 0 }}>
                <label className="label" htmlFor={`tech-${manage.id}`}>
                  Assign technician
                </label>
                <div className="flex-align" style={{ gap: 8 }}>
                  <select
                    id={`tech-${manage.id}`}
                    className="select"
                    style={{ flex: 1 }}
                    value={manage.technician?.name || ""}
                    onChange={(e) => patch(manage, { technician: e.target.value })}
                    disabled={busy}
                  >
                    <option value="">— Select technician —</option>
                    {TECHS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <IcUser size={17} style={{ color: "var(--faint)" }} />
                </div>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label className="label" htmlFor={`date-${manage.id}`}>
                  Schedule date
                </label>
                <div className="flex-align" style={{ gap: 8 }}>
                  <input
                    id={`date-${manage.id}`}
                    type="date"
                    className="input"
                    style={{ flex: 1 }}
                    value={manage.scheduledDate || ""}
                    onChange={(e) => patch(manage, { scheduledDate: e.target.value })}
                  />
                  <IcCalendar size={17} style={{ color: "var(--faint)" }} />
                </div>
              </div>
            </div>

            <div>
              <label className="label" htmlFor={`status-${manage.id}`}>
                Update status
              </label>
              <div className="flex-align wrap" style={{ gap: 6 }}>
                {STATUSES.map((s) => (
                  <button key={s} className={manage.status === s ? "btn btn--dark btn--sm" : "btn btn--outline btn--sm"} onClick={() => patch(manage, { status: s })} disabled={busy}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-2" style={{ gap: 22, gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
              <div>
                <h4 style={{ fontSize: 13, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--muted)" }}>Request details</h4>
                <p className="small" style={{ lineHeight: 1.8, margin: 0 }}>
                  <b>Device:</b> {manage.deviceName || manage.productType || "—"}
                  <br />
                  <b>Preferred:</b> {manage.preferredDate || "—"} {manage.preferredTime ? `(${manage.preferredTime})` : ""}
                  <br />
                  <b>Customer:</b> {manage.customerName} · {manage.customerEmail}
                  <br />
                  <b>Phone:</b> {manage.phone || "—"}
                  <br />
                  <b>Address:</b> {manage.address || "—"}
                  <br />
                  <b>Description:</b> {manage.description}
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 13, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--muted)" }}>Progress</h4>
                <Timeline steps={manage.timeline} />
              </div>
            </div>

            <div>
              <label className="label" htmlFor={`note-${manage.id}`}>
                Add an internal note
              </label>
              <div className="flex-align" style={{ gap: 8 }}>
                <input id={`note-${manage.id}`} className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Customer requested morning slot…" style={{ flex: 1 }} />
                <button className="btn btn--primary" disabled={!note.trim() || busy} onClick={() => { patch(manage, { notes: note.trim() }); setNote(""); }}>
                  <IcNote size={15} /> Add
                </button>
              </div>
              {manage.history?.length > 0 && (
                <div className="mt-12" style={{ display: "grid", gap: 6 }}>
                  {manage.history.map((h, i) => (
                    <p className="small muted" style={{ margin: 0 }} key={i}>
                      <IcNote size={12} /> {h.text} — <i>{prettyDate(h.at)}</i>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
