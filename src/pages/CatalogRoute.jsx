import { useParams } from "react-router-dom";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import { categoryByKey } from "@/data/mockCategories";

/**
 * /products/:segment is either a category slug (computers, laptops,
 * printers, cctv, gaming, accessories) or a product id.
 */
export default function CatalogRoute() {
  const { segment } = useParams();
  const category = categoryByKey(segment);
  if (category) {
    return <Products key={category.key} initialCategory={category.key} />;
  }
  return <ProductDetails key={segment} id={segment} />;
}
