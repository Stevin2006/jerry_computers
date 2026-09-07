import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IcX, IcAlertCircle } from "./Icons";
import { cx } from "@/lib/utils";

export default function Modal({ open, onClose, title, children, footer, size, labelledBy }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div
        className={cx("modal", size === "lg" && "modal--lg")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <div className="modal__head">
          <h3 className="modal__title" id={labelledBy}>
            {title}
          </h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <IcX size={19} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export function ConfirmDialog({ open, title = "Are you sure?", message, confirmLabel = "Delete", onConfirm, onClose, busy }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      labelledBy="confirm-title"
      footer={
        <>
          <button className="btn btn--outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={onConfirm} disabled={busy}>
            {busy && <span className="spinner" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="alert alert--warning" style={{ background: "transparent", border: "0", padding: 0 }}>
        <IcAlertCircle size={19} />
        <span>{message}</span>
      </div>
    </Modal>
  );
}
