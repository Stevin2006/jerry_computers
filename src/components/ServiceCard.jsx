import { Link } from "react-router-dom";
import { IcArrowRight, IcCpu, IcLaptop, IcPrinter, IcCamera, IcGamepad, IcMonitor, IcWrench } from "./Icons";

const ICONS = {
  computer: IcCpu,
  laptop: IcLaptop,
  printer: IcPrinter,
  cctv: IcCamera,
  gaming: IcGamepad,
  accessories: IcMonitor,
  other: IcWrench,
};

export default function ServiceCard({ service, href }) {
  const Icon = ICONS[service.key] || IcWrench;
  const to = href || (service.key === "other" ? "/services/request" : `/services?type=${service.key}`);
  return (
    <article className="service-card">
      <span className="service-card__ic">
        <Icon size={24} />
      </span>
      <h3>{service.heading || service.name}</h3>
      <p>{service.blurb}</p>
      <div className="service-card__foot">
        <span className="count">{service.items?.length || 0} service types</span>
        <Link to={to} className="btn btn--outline btn--sm">
          Learn More <IcArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
