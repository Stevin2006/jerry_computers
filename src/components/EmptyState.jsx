import { cx } from "@/lib/utils";

export default function EmptyState({ icon, title = "Nothing here yet", text, action, className }) {
  return (
    <div className={cx("empty", className)}>
      {icon && <div className="empty__art">{icon}</div>}
      <h3 className="empty__title" style={{ fontSize: 19 }}>
        {title}
      </h3>
      {text && <p className="empty__text">{text}</p>}
      {action}
    </div>
  );
}
