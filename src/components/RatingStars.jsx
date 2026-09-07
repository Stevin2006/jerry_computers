import { IcStar } from "./Icons";
import { cx } from "@/lib/utils";

export default function RatingStars({ rating, count, className, size = 13 }) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className={cx("rating-row", className)}>
      <span className="stars" aria-label={`Rated ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <IcStar
            key={i}
            size={size}
            style={{
              color: i <= Math.floor(rounded) ? "#f59e0b" : i - 0.5 === rounded ? "#f59e0b" : "#d7deea",
              opacity: i - 0.5 === rounded ? 0.5 : 1,
            }}
          />
        ))}
      </span>
      {rating > 0 && <b>{Number(rating).toFixed(1)}</b>}
      {count !== undefined && count > 0 && <span>({count} reviews)</span>}
    </span>
  );
}
