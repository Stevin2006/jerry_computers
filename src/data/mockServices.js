/**
 * Mock services catalogue.
 * --------------------------------------------------------------
 * `key` values are used by the service-request form and the API.
 * Each group carries the list of supported job types that appear
 * on the Services page and in the request form's product-type
 * selector ("productType").
 */

export const serviceCategories = [
  {
    key: "computer",
    name: "Computer Service",
    heading: "Computer Services",
    blurb:
      "Assembly, installation, upgrades and repairs for desktop computers — handled by certified Jerry technicians.",
    icon: "cpu",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1100&q=70",
    items: [
      { name: "Desktop assembly", desc: "Professional assembly of new desktop builds." },
      { name: "PC installation", desc: "Setting up your new PC, drivers and peripherals." },
      { name: "OS installation", desc: "Windows/Linux installation and activation help." },
      { name: "Software installation", desc: "Office, drivers, apps and security software." },
      { name: "Hardware upgrades", desc: "GPU, CPU, motherboard and case upgrades." },
      { name: "RAM upgrades", desc: "Memory installation with compatibility advice." },
      { name: "SSD upgrades", desc: "Faster storage with free data cloning." },
      { name: "Diagnostics", desc: "Full hardware and software health diagnosis." },
      { name: "Troubleshooting", desc: "Fixing crashes, slowness, noise and errors." },
      { name: "Maintenance", desc: "Cleaning, thermal paste and preventive care." },
      { name: "Performance optimization", desc: "Speed tuning for boot, apps and gaming." },
    ],
  },
  {
    key: "laptop",
    name: "Laptop Service",
    heading: "Laptop Services",
    blurb:
      "Laptop repairs, upgrades and tune-ups with fast turnaround and genuine parts.",
    icon: "laptop",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1100&q=70",
    items: [
      { name: "Laptop diagnostics", desc: "Complete health check of hardware and OS." },
      { name: "OS installation", desc: "Clean Windows/Linux install with driver setup." },
      { name: "Software installation", desc: "Apps, Office and productivity suites." },
      { name: "RAM upgrades", desc: "Faster multitasking with more memory." },
      { name: "SSD upgrades", desc: "Replace HDD with SSD — keep your files." },
      { name: "Troubleshooting", desc: "Overheating, battery, charging and boot issues." },
      { name: "Maintenance", desc: "Cleaning, repaste and performance care." },
      { name: "Performance optimization", desc: "Make your laptop feel brand new." },
    ],
  },
  {
    key: "printer",
    name: "Printer Service",
    heading: "Printer Services",
    blurb:
      "Installation, configuration, troubleshooting and repair for all printer brands.",
    icon: "printer",
    image:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1100&q=70",
    items: [
      { name: "Printer installation", desc: "Unboxing, setup and first print." },
      { name: "Printer configuration", desc: "Drivers, settings and print-quality tuning." },
      { name: "Wi-Fi printer setup", desc: "Connect your printer to Wi-Fi and devices." },
      { name: "Network printer setup", desc: "Share one printer across your office." },
      { name: "Troubleshooting", desc: "Paper jams, errors, connectivity and quality." },
      { name: "Maintenance", desc: "Cleaning, alignment and head care." },
      { name: "Repair", desc: "Genuine-part repairs with warranty." },
      { name: "Business printer setup", desc: "Multi-user print and scan workflows." },
    ],
  },
  {
    key: "cctv",
    name: "CCTV & Security",
    heading: "CCTV & Security Services",
    blurb:
      "Consultation, installation and maintenance for homes, offices and businesses.",
    icon: "camera",
    image:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1100&q=70",
    items: [
      { name: "CCTV consultation", desc: "Free advice on the right cameras for your space." },
      { name: "Camera installation", desc: "Wired/wireless camera fitting done right." },
      { name: "DVR/NVR installation", desc: "Recorder setup with HDD configuration." },
      { name: "Camera configuration", desc: "Angles, zones, motion and recording modes." },
      { name: "Network configuration", desc: "Router/POE setup for your camera system." },
      { name: "Remote viewing setup", desc: "Watch your cameras from your phone anywhere." },
      { name: "CCTV maintenance", desc: "Cleaning, firmware updates and health checks." },
      { name: "Troubleshooting", desc: "No signal, offline cameras, storage issues." },
      { name: "Security upgrades", desc: "HD to 4K, more storage, smart alerts." },
    ],
  },
  {
    key: "gaming",
    name: "Gaming Service",
    heading: "Gaming Services",
    blurb:
      "Custom gaming builds, PS5 setup and performance tuning for serious players.",
    icon: "gamepad",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1100&q=70",
    items: [
      { name: "Gaming PC assembly", desc: "Custom water- or air-cooled rig assembly." },
      { name: "Custom PC configuration", desc: "We spec the perfect machine for your budget." },
      { name: "Gaming setup", desc: "Full battlestation wiring and ergonomics." },
      { name: "Component installation", desc: "GPU, AIO coolers, RGB and storage." },
      { name: "Gaming peripheral setup", desc: "Keyboards, mice, wheels and hotas." },
      { name: "Performance optimization", desc: "FPS tuning, undervolting and benchmarks." },
      { name: "PS5 setup", desc: "Console setup, account and game installs." },
      { name: "Gaming troubleshooting", desc: "Drops, stutters, crashes and latency." },
    ],
  },
  {
    key: "accessories",
    name: "Accessories / Peripheral",
    heading: "Accessory & Peripheral Services",
    blurb:
      "Monitors, keyboards, webcams, headsets and everything around your desk.",
    icon: "monitor",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1100&q=70",
    items: [
      { name: "Monitor setup", desc: "Colour calibration, arm mounting, cabling." },
      { name: "Keyboard / mouse setup", desc: "Pairing, macros and ergonomics." },
      { name: "Webcam setup", desc: "Lighting, framing and software." },
      { name: "Headset setup", desc: "Audio tuning and mic configuration." },
      { name: "Speaker setup", desc: "Placement and sound calibration." },
      { name: "Networking accessory config", desc: "Routers, repeaters, dongles and docks." },
      { name: "Peripheral troubleshooting", desc: "Anything not working — we fix it." },
    ],
  },
  {
    key: "other",
    name: "Other",
    heading: "Other / General Technical Help",
    blurb:
      "Not sure which category fits? Tell us what you need and we'll route you to the right specialist.",
    icon: "wrench",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1100&q=70",
    items: [{ name: "General technical help", desc: "Anything technology — ask us." }],
  },
];

export const serviceCategoryByKey = (key) =>
  serviceCategories.find((c) => c.key === key) || null;

/** All individual job types flattened (used by request form product-type chips). */
export const productTypeOptions = serviceCategories.map((c) => ({
  key: c.key,
  label: c.name,
}));

export const serviceStatuses = [
  "Requested",
  "Confirmed",
  "Technician Assigned",
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
];

export const ticketStatuses = ["Open", "Assigned", "In Progress", "Waiting for Customer", "Resolved", "Closed"];
export const ticketPriorities = ["Low", "Medium", "High", "Urgent"];
export const orderStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
