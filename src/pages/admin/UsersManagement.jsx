import { useEffect, useMemo, useState } from "react";
import { adminGetUsers } from "@/api/adminApi";
import StatusBadge from "@/components/StatusBadge";
import { SkeletonRows } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { IcSearch, IcUsers } from "@/components/Icons";
import { money, prettyDate, initials } from "@/lib/utils";

export default function UsersManagement() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");

  const load = async () => {
    setError(null);
    try {
      setUsers(await adminGetUsers());
    } catch (e) {
      setError(e);
      setUsers([]);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const ql = q.trim().toLowerCase();
    return users.filter(
      (u) => !ql || u.name.toLowerCase().includes(ql) || u.email.toLowerCase().includes(ql) || u.id.toLowerCase().includes(ql)
    );
  }, [users, q]);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="admin-h1">Customers</h1>
        <p className="muted small" style={{ margin: 0 }}>
          {users?.length || 0} registered accounts
        </p>
      </div>

      <div className="input-icon" style={{ width: 340, maxWidth: "100%", marginBottom: 16 }}>
        <IcSearch size={16} />
        <input className="input" placeholder="Search name, email or ID…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search customers" />
      </div>

      {error ? (
        <ErrorMessage error={error} onRetry={load} />
      ) : !users ? (
        <SkeletonRows rows={6} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Total spent</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="cell-main">
                      <span className={`avatar avatar--sm ${u.role === "admin" ? "avatar--amber" : ""}`}>{initials(u.name)}</span>
                      <span>
                        <span className="cell-title" style={{ display: "block" }}>
                          {u.name}
                        </span>
                        <span className="cell-sub">{u.id}</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="cell-sub">{u.email}</span>
                    <span className="cell-sub" style={{ display: "block" }}>
                      {u.phone || "—"}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={u.role === "admin" ? "Administrator" : "Customer"} tone={u.role === "admin" ? "violet" : "primary"} dot={false} />
                  </td>
                  <td>
                    <StatusBadge status={u.status} />
                  </td>
                  <td>{u.orders}</td>
                  <td>
                    <b>{money(u.totalSpent || 0)}</b>
                  </td>
                  <td className="small muted">{prettyDate(u.createdAt)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty">
                      <IcUsers size={26} style={{ color: "var(--faint)" }} />
                      <p className="muted">No customers found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <p className="hint mt-12">Sensitive data is never displayed. Authorization is enforced by the backend.</p>
    </div>
  );
}
