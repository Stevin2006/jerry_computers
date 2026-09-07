/**
 * Mock product catalogue.
 * ------------------------------------------------------------------
 * Shape mirrors what the Django API is expected to return for
 * GET /api/products/  (fields flattened for convenience).
 *
 * Images are remote demo photos. Every <img> in the app falls back to
 * a themed placeholder automatically if a photo cannot load.
 */

const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const px = (value, mrp, stock = 12, extra = {}) => ({
  price: value,
  mrp,
  discount: Math.round(((mrp - value) / mrp) * 100),
  stock,
  rating: 4.5,
  reviewCount: 40,
  ...extra,
});

const P = {};

export const products = [
  {
    id: 1,
    name: "Jerry Performance Gaming Desktop — Ryzen 7 + RTX 4070",
    brand: "Jerry",
    category: "computers",
    tagline: "Custom RGB gaming tower ready for 1440p high-refresh gaming.",
    description:
      "A hand-assembled performance desktop built by our technicians: 8-core Ryzen 7 processor, RTX 4070 graphics, 32 GB DDR5 RAM and a 1 TB NVMe SSD. Comes with Jerry's professional assembly, stress testing, OS installation and a 3-year service plan.",
    gallery: [
      img("photo-1591488320449-011701bb6704"),
      img("photo-1587202372775-e229f172b9d7"),
      img("photo-1550745165-9bc0b252726f"),
    ],
    specs: {
      Processor: "AMD Ryzen 7 7700X (8 Cores, 5.4 GHz)",
      Graphics: "NVIDIA RTX 4070 12 GB",
      Memory: "32 GB DDR5 5600 MHz",
      Storage: "1 TB NVMe Gen4 SSD",
      Cooling: "240 mm AIO Liquid Cooler",
      Power: "750W 80+ Gold PSU",
      OS: "Windows 11 Home (Installed)",
      Warranty: "3 years parts & service",
    },
    tags: ["bestseller", "gaming"],
    ...px(119999, 142000, 6, {
      rating: 4.8,
      reviewCount: 124,
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 2,
    name: "Jerry Creator Desktop — i7 + RTX 4060, 64 GB RAM",
    brand: "Jerry",
    category: "computers",
    tagline: "A quiet, powerful tower for video editing and rendering.",
    description:
      "Built for creators: Intel Core i7, RTX 4060, 64 GB RAM and dual-drive storage with an ultra-quiet chassis. Professional assembly, cable management and a burn-in test certificate included.",
    gallery: [
      img("photo-1593640408182-31c70c8268f5"),
      img("photo-1498050108023-c5249f4df085"),
      img("photo-1547081649-963acb90dda2"),
    ],
    specs: {
      Processor: "Intel Core i7-13700 (16 Cores)",
      Graphics: "NVIDIA RTX 4060 8 GB",
      Memory: "64 GB DDR5 4800 MHz",
      Storage: "1 TB NVMe SSD + 2 TB HDD",
      Connectivity: "Wi-Fi 6E + 2.5G LAN",
      OS: "Windows 11 Pro (Installed)",
      Warranty: "3 years parts & service",
    },
    tags: ["creator"],
    ...px(89999, 104000, 4, {
      rating: 4.7,
      reviewCount: 58,
      img: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 3,
    name: "Jerry Office Desktop — i5 / 16 GB / 512 GB SSD",
    brand: "Jerry",
    category: "computers",
    tagline: "Reliable everyday desktop for business and home.",
    description:
      "A dependable, energy-efficient desktop for offices and homes. Pre-loaded productivity software available on request, plus Jerry's on-site setup and support.",
    gallery: [
      img("photo-1517336714731-489689fd1ca8"),
      img("photo-1496181133206-80ce9b88a853"),
      img("photo-1519389950473-47ba0277781c"),
    ],
    specs: {
      Processor: "Intel Core i5-13400 (10 Cores)",
      Memory: "16 GB DDR4 3200 MHz",
      Storage: "512 GB NVMe SSD",
      Graphics: "Intel UHD 730",
      Connectivity: "Wi-Fi 6 + Gigabit LAN",
      OS: "Windows 11 Home",
      Warranty: "2 years parts & service",
    },
    tags: ["business"],
    ...px(45999, 52000, 14, {
      rating: 4.6,
      reviewCount: 87,
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 4,
    name: "UltraBook Pro 14 — Intel Core Ultra 7, 32 GB, 1 TB",
    brand: "AeroTech",
    category: "laptops",
    tagline: "A feather-light business ultrabook with all-day battery.",
    description:
      "13-hour battery, a brilliant 14-inch 2.8K display and an aluminium body under 1.2 kg. Ideal for professionals who live in meetings and on the move.",
    gallery: [
      img("photo-1496181133206-80ce9b88a853"),
      img("photo-1517336714731-489689fd1ca8"),
      img("photo-1531297484001-80022131f5a1"),
    ],
    specs: {
      Display: '14" 2.8K OLED (2880 × 1800)',
      Processor: "Intel Core Ultra 7 155H",
      Memory: "32 GB LPDDR5x",
      Storage: "1 TB NVMe SSD",
      Battery: "75 Wh — up to 13 hours",
      Weight: "1.19 kg",
      Warranty: "3 years on-site warranty",
    },
    tags: ["business", "new"],
    ...px(109999, 125000, 9, {
      rating: 4.7,
      reviewCount: 66,
      img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 5,
    name: "StudentBook 15 — Core i5, 16 GB RAM, 512 GB SSD",
    brand: "AeroTech",
    category: "laptops",
    tagline: "The best value laptop for studies and everyday work.",
    description:
      "A 15.6-inch workhorse for students and home users: fast SSD storage, a comfortable keyboard and strong build quality. Free Microsoft Office trial setup included.",
    gallery: [
      img("photo-1517336714731-489689fd1ca8"),
      img("photo-1531297484001-80022131f5a1"),
      img("photo-1541807084-5c52b6b3adef"),
    ],
    specs: {
      Display: '15.6" FHD (1920 × 1080)',
      Processor: "Intel Core i5-12450H",
      Memory: "16 GB DDR4",
      Storage: "512 GB NVMe SSD",
      Battery: "Up to 8 hours",
      Weight: "1.76 kg",
      Warranty: "2 years on-site warranty",
    },
    tags: ["student"],
    ...px(52999, 59900, 22, {
      rating: 4.5,
      reviewCount: 210,
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 6,
    name: 'CreatorBook 16 — RTX 4060, 32 GB, 4K OLED',
    brand: "AeroTech",
    category: "laptops",
    tagline: "Serious power for creators who need to move.",
    description:
      "A 16-inch 4K OLED creator laptop with RTX 4060 graphics — colour-accurate, powerful and thin enough to travel. Ships with a calibrated display report.",
    gallery: [
      img("photo-1517694712202-14dd9538aa97"),
      img("photo-1498050108023-c5249f4df085"),
      img("photo-1496181133206-80ce9b88a853"),
    ],
    specs: {
      Display: '16" 4K OLED, 100% DCI-P3',
      Processor: "Intel Core i9-13900H",
      Graphics: "NVIDIA RTX 4060 8 GB",
      Memory: "32 GB DDR5",
      Storage: "2 TB NVMe SSD",
      Weight: "2.1 kg",
      Warranty: "3 years on-site warranty",
    },
    tags: ["creator", "premium"],
    ...px(179999, 199000, 5, {
      rating: 4.8,
      reviewCount: 41,
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 7,
    name: "PrintJet Wireless InkTank All-in-One Printer",
    brand: "PrintMaster",
    category: "printers",
    tagline: "Ultra-low-cost printing for home and small office.",
    description:
      "InkTank all-in-one with print, scan and copy. Enjoy thousands of pages per ink refill. Includes free Wi-Fi setup by Jerry's technicians and a demo print.",
    gallery: [
      img("photo-1612817159949-195b6eb9e31a"),
      img("photo-1585241645927-c7a8e5840c42"),
      img("photo-1606761568499-6d2451f23d5e"),
    ],
    specs: {
      Type: "InkTank All-in-One",
      Functions: "Print, Scan, Copy",
      Connectivity: "Wi-Fi, Wi-Fi Direct, USB",
      "Print Speed": "Up to 28 ppm (mono)",
      Paper: "Up to A4, 60 sheets input",
      Mobile: "App + AirPrint",
      Warranty: "2 years (on-site)",
    },
    tags: ["bestseller", "deal"],
    ...px(13999, 17500, 18, {
      rating: 4.4,
      reviewCount: 148,
      img: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 8,
    name: "LaserJet Mono Laser Printer — Business Grade",
    brand: "PrintMaster",
    category: "printers",
    tagline: "Fast, dependable mono laser for busy offices.",
    description:
      "High-volume mono laser printer with duplex printing and 35 ppm speed. Jerry Computers includes network setup, driver installation and a business support plan.",
    gallery: [
      img("photo-1612815154858-60aa4c59e4d6"),
      img("photo-1612817159949-195b6eb9e31a"),
      img("photo-1585241645927-c7a8e5840c42"),
    ],
    specs: {
      Type: "Mono Laser",
      Functions: "Print",
      Connectivity: "Ethernet, Wi-Fi, USB",
      "Print Speed": "Up to 35 ppm",
      "Duty Cycle": "Up to 2,500 pages/month",
      Paper: "A4, A5, Letter",
      Warranty: "3 years on-site",
    },
    tags: ["business"],
    ...px(18999, 22000, 11, {
      rating: 4.6,
      reviewCount: 74,
      img: "https://images.unsplash.com/photo-1612815154858-60aa4c59e4d6?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 9,
    name: "4MP Dome CCTV Camera Kit — 4 Cameras + 1 TB DVR",
    brand: "SecureView",
    category: "cctv",
    tagline: "Complete 4-camera security kit for home or office.",
    description:
      "Everything you need: four 4MP dome cameras with night vision, a 1 TB DVR and cables. Jerry Computers provides professional installation, configuration and phone remote-viewing setup.",
    gallery: [
      img("photo-1557597774-9d273605dfa9"),
      img("photo-1544717305-2782549b5136"),
      img("photo-1563013544-824ae1b704d3"),
    ],
    specs: {
      Resolution: "4MP (2560 × 1440)",
      "Night Vision": "Up to 30 m IR",
      Recorder: "8-channel DVR, 1 TB HDD",
      "Remote View": "Phone app (iOS/Android)",
      Storage: "Up to 6 TB supported",
      Warranty: "2 years + free demo",
    },
    tags: ["bestseller", "deal"],
    ...px(15499, 18900, 8, {
      rating: 4.6,
      reviewCount: 132,
      img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 10,
    name: "8MP Bullet CCTV Camera — 4K Ultra HD",
    brand: "SecureView",
    category: "cctv",
    tagline: "Crystal-clear 4K outdoor surveillance.",
    description:
      "Weatherproof 4K bullet camera with smart motion alerts and colour night vision. Add to any DVR/NVR or bundle with our installation service.",
    gallery: [
      img("photo-1563013544-824ae1b704d3"),
      img("photo-1557597774-9d273605dfa9"),
      img("photo-1544717305-2782549b5136"),
    ],
    specs: {
      Resolution: "8MP 4K (3840 × 2160)",
      "Night Vision": "Colour night vision",
      Protection: "IP67 weatherproof",
      Audio: "Built-in mic",
      Detection: "Smart human/vehicle alerts",
      Warranty: "2 years",
    },
    tags: ["new"],
    ...px(4299, 5500, 26, {
      rating: 4.5,
      reviewCount: 63,
      img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 11,
    name: "Sony PlayStation 5 Console — Disc Edition + Extra Controller",
    brand: "Sony",
    category: "gaming",
    tagline: "The next generation of gaming, bundle with a bonus DualSense.",
    description:
      "The PS5 console with ultra-high-speed SSD and haptic DualSense controller — plus a bonus second controller in this Jerry bundle. Console setup, account help and game installation available as a service.",
    gallery: [
      img("photo-1606813901341-1f010828f0d0"),
      img("photo-1607853202273-797f1c22a38e"),
      img("photo-1598550476439-6847785fcea6"),
    ],
    specs: {
      Storage: "825 GB ultra-fast SSD",
      Resolution: "Up to 4K / 120 fps",
      Controller: "DualSense (×2 included)",
      Media: "4K UHD Blu-ray disc drive",
      "Backward Compatible": "Yes",
      Warranty: "1 year + Jerry service plan",
    },
    tags: ["bestseller", "gaming", "deal"],
    ...px(54990, 60000, 7, {
      rating: 4.9,
      reviewCount: 256,
      img: "https://images.unsplash.com/photo-1606813901341-1f010828f0d0?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 12,
    name: '27" 170Hz QHD Gaming Monitor',
    brand: "VisionX",
    category: "gaming",
    tagline: "Fast, colourful and immersive esports display.",
    description:
      "27-inch QHD 170Hz 1ms gaming monitor with HDR400 and ultra-thin bezels. Height-adjustable stand; Jerry can calibrate it and set up your full battlestation.",
    gallery: [
      img("photo-1527443224154-c4a3942d3acf"),
      img("photo-1593640408182-31c70c8268f5"),
      img("photo-1550745165-9bc0b252726f"),
    ],
    specs: {
      Panel: '27" IPS QHD (2560 × 1440)',
      Refresh: "170 Hz",
      Response: "1 ms (MPRT)",
      HDR: "HDR400",
      Ports: "2× HDMI 2.0, 1× DP 1.4",
      Stand: "Height / tilt / swivel",
      Warranty: "3 years zero-dead-pixel",
    },
    tags: ["gaming"],
    ...px(21999, 26000, 13, {
      rating: 4.7,
      reviewCount: 98,
      img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 13,
    name: "RGB Mechanical Gaming Keyboard — Hot-Swappable",
    brand: "Jerry",
    category: "gaming",
    tagline: "Tactile linear switches with per-key RGB.",
    description:
      "Full-size hot-swappable mechanical keyboard with linear red switches, per-key RGB and a detachable USB-C cable. Durability rated at 50 million keystrokes.",
    gallery: [
      img("photo-1587829741301-dc798b83add3"),
      img("photo-1587202372775-e229f172b9d7"),
      img("photo-1618384887929-16ec33fab9ef"),
    ],
    specs: {
      Layout: "Full size (104 keys)",
      Switches: "Linear red (hot-swap)",
      Lighting: "Per-key RGB",
      Cable: "Detachable USB-C",
      Durability: "50M keystrokes",
      Warranty: "2 years",
    },
    tags: ["gaming", "deal"],
    ...px(5499, 7499, 30, {
      rating: 4.6,
      reviewCount: 340,
      img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 14,
    name: "Wireless Gaming Mouse — 26K DPI, RGB",
    brand: "Jerry",
    category: "gaming",
    tagline: "Ultra-light esports mouse with long battery life.",
    description:
      "58 g ultra-light wireless mouse with a 26,000 DPI optical sensor, 1000 Hz polling and up to 90 hours of battery. Includes charging dock.",
    gallery: [
      img("photo-1527814050087-3793815479db"),
      img("photo-1587829741301-dc798b83add3"),
      img("photo-1605773527852-c546a8584ea3"),
    ],
    specs: {
      Sensor: "26,000 DPI optical",
      Weight: "58 g",
      Wireless: "2.4 GHz + Bluetooth",
      Battery: "Up to 90 hours",
      Polling: "1000 Hz",
      Warranty: "2 years",
    },
    tags: ["gaming"],
    ...px(2999, 3999, 40, {
      rating: 4.5,
      reviewCount: 265,
      img: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 15,
    name: "1 TB NVMe Gen4 SSD — 7000 MB/s",
    brand: "SwiftStore",
    category: "accessories",
    tagline: "Blazing-fast storage for laptops, desktops and PS5.",
    description:
      "Upgrade to a 1 TB Gen4 NVMe SSD with 7000 MB/s reads. Perfect for laptops, desktops and PS5 expansion. Jerry offers free cloning and installation with every upgrade.",
    gallery: [
      img("photo-1605647540924-852290f6b0d5"),
      img("photo-1591405351990-4726e331f141"),
      img("photo-1531492746076-161ca9bcad58"),
    ],
    specs: {
      Capacity: "1 TB",
      Interface: "PCIe Gen4 NVMe",
      Read: "Up to 7000 MB/s",
      Write: "Up to 6000 MB/s",
      "Form Factor": "M.2 2280",
      Warranty: "5 years",
    },
    tags: ["deal", "upgrade"],
    ...px(7999, 10999, 25, {
      rating: 4.8,
      reviewCount: 412,
      img: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 16,
    name: "32 GB DDR5 Desktop RAM — 5600 MHz",
    brand: "SwiftStore",
    category: "accessories",
    tagline: "Dual-channel kit for your next-gen build.",
    description:
      "16 GB × 2 DDR5 5600 MHz memory kit with XMP/EXPO profiles. Our technicians will install and stability-test it for you free with purchase.",
    gallery: [
      img("photo-1592663527359-cf6642f54cff"),
      img("photo-1605647540924-852290f6b0d5"),
      img("photo-1555617981-dac3880eacb6"),
    ],
    specs: {
      Capacity: "32 GB (2 × 16 GB)",
      Type: "DDR5",
      Speed: "5600 MHz",
      Profile: "XMP 3.0 / EXPO",
      Warranty: "Lifetime",
    },
    tags: ["upgrade"],
    ...px(9499, 12000, 17, {
      rating: 4.7,
      reviewCount: 156,
      img: "https://images.unsplash.com/photo-1592663527359-cf6642f54cff?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 17,
    name: "HP OfficeJet Pro 7730 Wireless All-in-One Printer",
    brand: "PrintMaster",
    category: "printers",
    tagline: "Business-grade A3 printing with fax.",
    description:
      "A3 colour inkjet all-in-one for small businesses — print, scan, copy, fax. Jerry includes network printer setup for Windows and Mac, and a dedicated support contact.",
    gallery: [
      img("photo-1612815154858-60aa4c59e4d6"),
      img("photo-1612817159949-195b6eb9e31a"),
      img("photo-1585241645927-c7a8e5840c42"),
    ],
    specs: {
      Type: "A3 Colour Inkjet AIO",
      Functions: "Print, Scan, Copy, Fax",
      Connectivity: "Wi-Fi, Ethernet, USB, Fax",
      "Print Speed": "Up to 22 ppm (mono)",
      Mobile: "HP Smart App",
      Warranty: "2 years on-site",
    },
    tags: ["business", "new"],
    ...px(28999, 34000, 9, {
      rating: 4.4,
      reviewCount: 52,
      img: "https://images.unsplash.com/photo-1612815154858-60aa4c59e4d6?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 18,
    name: "1080p Wi-Fi Smart Security Camera — Indoor",
    brand: "SecureView",
    category: "cctv",
    tagline: "Smart indoor camera with app alerts.",
    description:
      "Pan-tilt smart camera with 1080p video, two-way audio, motion zones and cloud/local storage. Quick to set up — or let Jerry configure it and link it to your phone.",
    gallery: [
      img("photo-1585771724684-38269d6639fd"),
      img("photo-1563013544-824ae1b704d3"),
      img("photo-1557597774-9d273605dfa9"),
    ],
    specs: {
      Resolution: "1080p Full HD",
      View: "360° pan / 90° tilt",
      Audio: "Two-way talk",
      Storage: "MicroSD + cloud",
      "Smart Alerts": "Motion + sound",
      Warranty: "1 year",
    },
    tags: ["new", "smart-home"],
    ...px(2499, 3200, 35, {
      rating: 4.3,
      reviewCount: 190,
      img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 19,
    name: "Dell Inspiron 15 Business Laptop — Core i5, 8 GB, 256 GB SSD",
    brand: "Dell",
    category: "laptops",
    tagline: "Dependable business laptop with pro setup included.",
    description:
      "A no-nonsense business laptop from Dell with fingerprint login and a spill-resistant keyboard. Free migration of your data, Office setup and security hardening by Jerry.",
    gallery: [
      img("photo-1531297484001-80022131f5a1"),
      img("photo-1517336714731-489689fd1ca8"),
      img("photo-1541807084-5c52b6b3adef"),
    ],
    specs: {
      Display: '15.6" FHD anti-glare',
      Processor: "Intel Core i5-1235U",
      Memory: "8 GB DDR4 (expandable)",
      Storage: "256 GB NVMe SSD",
      Battery: "Up to 10 hours",
      Security: "Fingerprint reader",
      Warranty: "3 years on-site",
    },
    tags: ["business"],
    ...px(53999, 60999, 10, {
      rating: 4.5,
      reviewCount: 88,
      img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=70",
    }),
  },
  {
    id: 20,
    name: "ASUS TUF Gaming Laptop — RTX 4050, 144Hz",
    brand: "ASUS",
    category: "gaming",
    tagline: "A rugged 15.6-inch gaming laptop that travels.",
    description:
      "Military-grade durable gaming laptop with a 144Hz display and RTX 4050. Jerry sets up game libraries, optimises Windows and configures cooling profiles.",
    gallery: [
      img("photo-1541807084-5c52b6b3adef"),
      img("photo-1517336714731-489689fd1ca8"),
      img("photo-1587202372775-e229f172b9d7"),
    ],
    specs: {
      Display: '15.6" FHD 144Hz',
      Processor: "AMD Ryzen 7 7735HS",
      Graphics: "NVIDIA RTX 4050 6 GB",
      Memory: "16 GB DDR5",
      Storage: "512 GB NVMe SSD",
      Battery: "90 Wh",
      Warranty: "2 years + accidental",
    },
    tags: ["gaming", "bestseller"],
    ...px(96999, 112000, 7, {
      rating: 4.7,
      reviewCount: 143,
      img: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=70",
    }),
  },
];

// Normalise: every product exposes `images` (used by <ProductImage/>) and a string id.
products.forEach((p) => {
  p.images = p.gallery || [];
  p.id = String(p.id);
});

P.byId = (id) => products.find((p) => p.id === String(id)) || null;
P.featured = () => products.filter((p) => p.tags?.includes("bestseller") || p.id <= 4).slice(0, 8);
P.deals = () => products.filter((p) => p.tags?.includes("deal") && p.discount >= 10);
P.recommendedFor = (productId, limit = 4) => {
  const p = P.byId(productId);
  if (!p) return [];
  return products
    .filter((x) => x.id !== p.id && (x.category === p.category || x.tags?.some((t) => p.tags?.includes(t))))
    .concat(products.filter((x) => x.id !== p.id && x.category !== p.category))
    .slice(0, limit);
};

export const brands = [...new Set(products.map((p) => p.brand))];
