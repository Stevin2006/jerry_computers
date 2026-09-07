import { IcAlertCircle, IcRefresh } from "./Icons";
import { errorMessage } from "@/lib/utils";

export default function ErrorMessage({ error, onRetry, title = "Something went wrong" }) {
  if (!error) return null;
  return (
    <div className="alert alert--error" role="alert">
      <IcAlertCircle size={19} />
      <div style={{ flex: 1 }}>
        <b style={{ display: "block" }}>{title}</b>
        <span style={{ opacity: 0.9 }}>{errorMessage(error)}</span>
      </div>
      {onRetry && (
        <button className="btn btn--danger-soft btn--sm" onClick={onRetry}>
          <IcRefresh size={14} /> Retry
        </button>
      )}
    </div>
  );
}
