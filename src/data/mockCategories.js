/**
 * Mock category catalogue for JERRY COMPUTERS.
 * Category `key` values are the source of truth used across the app
 * (routing slugs, product.category, admin selects, API params).
 */

export const categories = [
  {
    key: "computers",
    name: "Computers",
    tagline: "Desktop computers & custom PC solutions",
    description:
      "Pre-built desktops, tower PCs and fully customised builds engineered for work, creativity and play.",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=70",
    accent: "blue",
  },
  {
    key: "laptops",
    name: "Laptops",
    tagline: "For students, professionals & creators",
    description:
      "Ultrabooks, business laptops and power machines for students, professionals and creators on the move.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=70",
    accent: "indigo",
  },
  {
    key: "printers",
    name: "Printers",
    tagline: "Home & business printing solutions",
    description:
      "Inkjet, laser and all-in-one printers with installation and network setup available for home and office.",
    image:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=70",
    accent: "teal",
  },
  {
    key: "cctv",
    name: "CCTV & Security",
    tagline: "Cameras & complete security solutions",
    description:
      "HD cameras, DVR/NVR recorders and complete surveillance solutions with professional installation.",
    image:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=70",
    accent: "cyan",
  },
  {
    key: "gaming",
    name: "Gaming",
    tagline: "Gaming PCs, PS5 & equipment",
    description:
      "Gaming PCs, next-gen consoles, monitors and premium peripherals for the ultimate gaming setup.",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=70",
    accent: "violet",
  },
  {
    key: "accessories",
    name: "Accessories",
    tagline: "For laptops, desktops & printers",
    description:
      "Keyboards, mice, monitors, storage, memory and every accessory that completes your technology.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=70",
    accent: "amber",
  },
];

export const categoryByKey = (key) =>
  categories.find((c) => c.key === key) || null;

export const categorySlugs = ["computers", "laptops", "printers", "cctv", "gaming", "accessories"];
