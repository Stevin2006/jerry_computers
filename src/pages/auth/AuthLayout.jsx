import Logo from "@/components/Logo";
import { IcShield, IcHeadset, IcBox, IcWrench } from "@/components/Icons";

const POINTS = [
  { icon: IcBox, text: "Products · Gaming · Security · Accessories" },
  { icon: IcShield, text: "Genuine, warranty-backed technology" },
  { icon: IcWrench, text: "Installation, service & maintenance" },
  { icon: IcHeadset, text: "Support long after your purchase" },
];

export default function AuthLayout({ children, quote }) {
  return (
    <div className="auth">
      <aside className="auth__panel">
        <Logo dark />
        <div>
          <p className="quote">
            {quote || (
              <>
                “Your Complete <span>Technology Partner</span> — buy, install, support and keep it running.”
              </>
            )}
          </p>
          <ul className="points">
            {POINTS.map((p) => (
              <li key={p.text}>
                <p.icon size={17} /> {p.text}
              </li>
            ))}
          </ul>
        </div>
        <span className="footer__motto">BUY IT · INSTALL IT · SUPPORT IT · KEEP IT RUNNING</span>
      </aside>
      <div className="auth__side">{children}</div>
    </div>
  );
}
