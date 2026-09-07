import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { IcCheckCircle, IcAlertCircle, IcInfo, IcX } from "@/components/Icons";

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (message, type = "success", title) => {
      const id = nextId++;
      setToasts((list) => [...list.slice(-3), { id, message, type, title }]);
      timers.current[id] = setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      success: (m, title) => push(m, "success", title),
      error: (m, title) => push(m, "error", title || "Something went wrong"),
      info: (m, title) => push(m, "info", title),
      push,
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastStack({ toasts, onDismiss }) {
  const icon = {
    success: <IcCheckCircle size={20} />,
    error: <IcAlertCircle size={20} />,
    info: <IcInfo size={20} />,
  };
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          {icon[t.type] || icon.info}
          <div>
            {t.title && <b>{t.title}</b>}
            <span className="toast__msg">{t.message}</span>
          </div>
          <button className="toast__x" onClick={() => onDismiss(t.id)} aria-label="Dismiss notification">
            <IcX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
