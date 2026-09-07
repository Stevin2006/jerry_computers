import { Link } from "react-router-dom";
import { IcHome, IcPackage, IcWrench } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="page">
      <div className="notfound">
        <span className="notfound__ghost">
          <IcWrench size={54} />
        </span>
        <div className="notfound__code" aria-hidden="true">
          404
        </div>
        <h1>Looks like this page went offline.</h1>
        <p>
          The page you're looking for couldn't be found. Our technicians suggest heading back — everything's still running
          on our side.
        </p>
        <div className="actions">
          <Link to="/" className="btn btn--primary btn--lg">
            <IcHome size={17} /> Back Home
          </Link>
          <Link to="/products" className="btn btn--outline btn--lg">
            <IcPackage size={17} /> Explore Products
          </Link>
          <Link to="/support" className="btn btn--ghost btn--lg">
            Get Support
          </Link>
        </div>
      </div>
    </div>
  );
}
