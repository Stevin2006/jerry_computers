import { useState } from "react";
import { cx } from "@/lib/utils";

/**
 * <img> that gracefully falls back to a themed SVG placeholder when a
 * remote photo cannot load (demo imagery / offline situations).
 */

const PALETTE = {
  computers: ["#1e3a8a", "#2563eb"],
  laptops: ["#4338ca", "#6366f1"],
  printers: ["#0f766e", "#14b8a6"],
  cctv: ["#155e75", "#06b6d4"],
  gaming: ["#6d28d9", "#a855f7"],
  accessories: ["#92400e", "#f59e0b"],
  default: ["#1e3a8a", "#3b82f6"],
};

function fallbackSvg(category, name, seed = "") {
  const [c1, c2] = PALETTE[category] || PALETTE.default;
  const letters = (name || category || "JC")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
    <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
  </linearGradient></defs>
  <rect width='640' height='640' fill='url(#g)'/>
  <circle cx='480' cy='120' r='170' fill='rgba(255,255,255,0.08)'/>
  <circle cx='80' cy='560' r='220' fill='rgba(0,0,0,0.12)'/>
  <text x='320' y='330' font-family='Arial, sans-serif' font-size='150' font-weight='700' fill='rgba(255,255,255,0.92)' text-anchor='middle'>${letters}</text>
  <text x='320' y='410' font-family='Arial, sans-serif' font-size='30' letter-spacing='6' fill='rgba(255,255,255,0.75)' text-anchor='middle'>JERRY COMPUTERS</text>
  <text x='320' y='500' font-family='Arial, sans-serif' font-size='22' fill='rgba(255,255,255,0.55)' text-anchor='middle' opacity='${seed ? 1 : 0}'>${String(seed).slice(0, 22)}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function ProductImage({ src, alt = "", category = "", name = "", className, style, ...rest }) {
  const [broken, setBroken] = useState(false);
  const fallback = fallbackSvg(category, name, alt);
  const actual = src && !broken ? src : fallback;
  return (
    <img
      src={actual}
      alt={alt || name || "Product image"}
      loading="lazy"
      className={cx("product-img", className)}
      style={style}
      onError={() => {
        if (!broken) setBroken(true);
      }}
      {...rest}
    />
  );
}
