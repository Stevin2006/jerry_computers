import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHead from "@/components/PageHead";
import StatusBadge from "@/components/StatusBadge";
import { SkeletonBlock } from "@/components/Loading";
import EmptyState from "@/components/EmptyState";
import { IcMessageCircle, IcSend, IcPaperclip, IcChevronLeft, IcPaperclip as IcAttach, IcClock } from "@/components/Icons";
import { getTicket, replyTicket } from "@/api/supportApi";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { initials, prettyDate } from "@/lib/utils";

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    setError(null);
    try {
      setTicket(await getTicket(id));
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const data = await replyTicket(id, { text });
      setTicket(data.ticket);
      setText("");
      toast.success("Reply sent to our support team.", "Message sent");
    } catch (err) {
      toast.error(err?.message || "Could not send your reply.");
    } finally {
      setSending(false);
    }
  };

  if (error) {
    return (
      <div className="page--plain">
        <div className="container" style={{ maxWidth: 860 }}>
          <EmptyState
            icon={<IcMessageCircle size={32} />}
            title="Ticket not found"
            text="We couldn't find this ticket for your account."
            action={
              <Link to="/support/tickets" className="btn btn--primary">
                Back to tickets
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page--plain">
        <div className="container" style={{ maxWidth: 900 }}>
          <SkeletonBlock lines={6} height={200} />
        </div>
      </div>
    );
  }

  const closed = ["Resolved", "Closed"].includes(ticket.status);

  return (
    <div className="page--plain">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb" style={{ marginTop: 26 }}>
          <Link to="/support">Support</Link>
          <IcChevronLeft size={12} className="sep" />
          <Link to="/support/tickets">Tickets</Link>
          <IcChevronLeft size={12} className="sep" />
          <span>{ticket.id}</span>
        </nav>

        <div className="card card--pad" style={{ marginTop: 4 }}>
          <div className="flex-between wrap" style={{ gap: 14 }}>
            <div>
              <span className="oid" style={{ color: "var(--primary)", fontWeight: 800 }}>
                {ticket.id}
              </span>
              <h1 style={{ fontSize: 24, margin: "6px 0 4px" }}>{ticket.subject}</h1>
              <div className="flex-align wrap" style={{ gap: 8 }}>
                <StatusBadge status={ticket.status} />
                <StatusBadge status={ticket.priority} />
                <span className="tag">{ticket.category}</span>
              </div>
            </div>
            {closed ? (
              <div className="alert alert--success" style={{ background: "transparent", padding: 0 }}>
                <b>This ticket is {ticket.status.toLowerCase()}.</b> Need more help? Open a new ticket.
              </div>
            ) : (
              <Link to="/support/tickets?new=1" className="btn btn--soft btn--sm">
                Related: open new ticket
              </Link>
            )}
          </div>

          {ticket.product && (
            <div className="pd-meta mt-16" style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <IcPaperclip size={16} /> Related: {ticket.product}
              </div>
            </div>
          )}

          {ticket.status === "Waiting for Customer" && (
            <div className="alert alert--warning mt-16" role="status">
              <IcClock size={18} />
              <span>
                <b>Waiting for your reply.</b> Our team asked you something — reply below to keep things moving.
              </span>
            </div>
          )}
        </div>

        <div className="ticket-grid mt-24" style={{ alignItems: "start" }}>
          <div className="ticket-thread">
            {ticket.messages.map((m, i) => (
              <div key={m.id || i} className={`msg ${m.role === "agent" ? "msg--admin" : ""}`}>
                <span className={`avatar ${m.role === "agent" ? "avatar--violet" : "avatar--teal"}`}>{initials(m.author)}</span>
                <div className="msg__body">
                  <div className="msg__head">
                    <span className="msg__who">
                      {m.author} <small>{m.role === "agent" ? "· Jerry Support Team" : ""}</small>
                    </span>
                    <span className="msg__when">{prettyDate(m.at)}</span>
                  </div>
                  <p>{m.text}</p>
                  {i === 0 && ticket.attachments?.length > 0 && (
                    <span className="attachment-chip">
                      <IcAttach size={15} /> {ticket.attachments.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <aside className="card card--pad" style={{ position: "sticky", top: "calc(var(--header-h) + 18px)" }}>
            {closed ? (
              <div className="empty" style={{ padding: 12 }}>
                <IcMessageCircle size={26} style={{ color: "var(--faint)" }} />
                <p className="muted small" style={{ margin: 0 }}>
                  This ticket is {ticket.status.toLowerCase()}. Please open a new ticket if you need further help.
                </p>
                <Link to="/support/tickets?new=1" className="btn btn--soft btn--sm">
                  Open new ticket
                </Link>
              </div>
            ) : (
              <form onSubmit={send}>
                <h3 style={{ fontSize: 16, margin: "0 0 8px" }}>Reply as {user?.name}</h3>
                <textarea
                  className="textarea"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your reply to the support team…"
                  aria-label="Your reply"
                />
                <button className="btn btn--primary btn--block mt-8" disabled={sending || !text.trim()}>
                  {sending ? <span className="spinner" /> : <IcSend size={16} />} Send Reply
                </button>
                <p className="hint">Average first response: under 4 business hours.</p>
              </form>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
