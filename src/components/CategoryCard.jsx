import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import { IcArrowRight, IcMonitor, IcLaptop, IcPrinter, IcCamera, IcGamepad, IcBox } from "./Icons";

const CATEGORY_ICON = {
  computers: IcMonitor,
  laptops: IcLaptop,
  printers: IcPrinter,
  cctv: IcCamera,
  gaming: IcGamepad,
  accessories: IcBox,
};

export default function CategoryCard({ category }) {
  const Icon = CATEGORY_ICON[category.key] || IcBox;
  return (
    <Link to={`/products/${category.key}`} className="cat-card" aria-label={`${category.name} — ${category.description}`}>
      <ProductImage src={category.image} category={category.key} name={category.name} alt={category.name} />
      <span className="cat-card__top">
        <Icon size={20} />
      </span>
      <span className="cat-card__body">
        <h3>{category.name}</h3>
        <p>{category.tagline}</p>
        <span className="cat-card__link">
          Explore <IcArrowRight size={15} />
        </span>
      </span>
    </Link>
  );
}
