/**
 * Lightweight inline SVG icon set (stroke-based, inherits currentColor).
 * Keeps the bundle free of an icon-font dependency.
 */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: 20,
  height: 20,
  "aria-hidden": true,
};

const Icon = ({ children, size, ...rest }) => (
  <svg {...base} width={size || 20} height={size || 20} {...rest}>
    {children}
  </svg>
);

export const IcMenu = (p) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Icon>;
export const IcX = (p) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>;
export const IcSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Icon>;
export const IcPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
export const IcMinus = (p) => <Icon {...p}><path d="M5 12h14" /></Icon>;
export const IcChevronDown = (p) => <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>;
export const IcChevronRight = (p) => <Icon {...p}><path d="m9 18 6-6-6-6" /></Icon>;
export const IcChevronLeft = (p) => <Icon {...p}><path d="m15 18-6-6 6-6" /></Icon>;
export const IcArrowRight = (p) => <Icon {...p}><path d="M5 12h14M12 5l7 7-7 7" /></Icon>;
export const IcArrowUpRight = (p) => <Icon {...p}><path d="M7 17 17 7M8 7h9v9" /></Icon>;
export const IcCheck = (p) => <Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>;
export const IcCheckCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.4 2.4 4.6-4.8" /></Icon>;
export const IcAlertCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></Icon>;
export const IcInfo = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></Icon>;
export const IcXCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9l6 6" /></Icon>;
export const IcHeart = (p) => <Icon {...p}><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" /></Icon>;
export const IcCart = (p) => <Icon {...p}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2l2.7 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21.5 7H6" /></Icon>;
export const IcUser = (p) => <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c.6-3.7 3.2-6 8-6s7.4 2.3 8 6" /></Icon>;
export const IcUsers = (p) => <Icon {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.2 2.8-5 6.5-5s5.9 1.8 6.5 5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.6 15.4c1.7.6 2.7 2 3 4.6" /></Icon>;
export const IcPackage = (p) => <Icon {...p}><path d="m21 8-9-5-9 5v8l9 5 9-5V8Z" /><path d="m3.3 8.3 8.7 5 8.7-5M12 22V13" /></Icon>;
export const IcTruck = (p) => <Icon {...p}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></Icon>;
export const IcWrench = (p) => <Icon {...p}><path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.7-3.7Z" /></Icon>;
export const IcSettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" /></Icon>;
export const IcCamera = (p) => <Icon {...p}><path d="M14.5 5h-5L8 7.5H4.5A1.5 1.5 0 0 0 3 9v8.5A1.5 1.5 0 0 0 4.5 19h15a1.5 1.5 0 0 0 1.5-1.5V9a1.5 1.5 0 0 0-1.5-1.5H16Z" /><circle cx="12" cy="13" r="3.2" /></Icon>;
export const IcShield = (p) => <Icon {...p}><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" /><path d="m9 11.5 2 2 4-4" /></Icon>;
export const IcMonitor = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></Icon>;
export const IcLaptop = (p) => <Icon {...p}><rect x="4" y="5" width="16" height="11" rx="2" /><path d="M2 20h20" /></Icon>;
export const IcPrinter = (p) => <Icon {...p}><path d="M7 9V3.5A1.5 1.5 0 0 1 8.5 2h7A1.5 1.5 0 0 1 17 3.5V9" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M7 15h10v6H7z" /></Icon>;
export const IcGamepad = (p) => <Icon {...p}><path d="M6.5 7h11a5.5 5.5 0 0 1 5.4 6.6l-.8 3.6a2.5 2.5 0 0 1-4.4 1L16 15H8l-1.7 3.2a2.5 2.5 0 0 1-4.4-1l-.8-3.6A5.5 5.5 0 0 1 6.5 7Z" /><path d="M7.5 10.5v3M6 12h3" /><circle cx="16.5" cy="10.5" r=".4" fill="currentColor" /><circle cx="18.5" cy="13" r=".4" fill="currentColor" /></Icon>;
export const IcCpu = (p) => <Icon {...p}><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></Icon>;
export const IcBox = (p) => <Icon {...p}><path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z" /><path d="m4 6.5 8 4.5 8-4.5M12 11v11" /></Icon>;
export const IcMail = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6 8.5-6" /></Icon>;
export const IcPhone = (p) => <Icon {...p}><path d="M5 3h3.5l1.5 5-2.5 1.5a12 12 0 0 0 6 6L15 13l5 1.5V18a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.2 2 2 0 0 1 5 3Z" /></Icon>;
export const IcMapPin = (p) => <Icon {...p}><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></Icon>;
export const IcClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>;
export const IcCalendar = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></Icon>;
export const IcHeadset = (p) => <Icon {...p}><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M20 19a3 3 0 0 1-3 3h-4" /></Icon>;
export const IcLifeBuoy = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="m5 5 4.5 4.5M15 15 19 19M19 5l-4.5 4.5M9 15 5 19" /></Icon>;
export const IcClipboard = (p) => <Icon {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 10h6M9 14h6M9 18h3" /></Icon>;
export const IcStar = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2Z" />
  </svg>
);
export const IcTag = (p) => <Icon {...p}><path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h9l8.6 8.6a1.6 1.6 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" /></Icon>;
export const IcLogOut = (p) => <Icon {...p}><path d="M9 21H5.5a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 5.5 3H9" /><path d="m16 17 5-5-5-5M21 12H9" /></Icon>;
export const IcLogIn = (p) => <Icon {...p}><path d="M15 3h3.5A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5H15" /><path d="m10 17 5-5-5-5M15 12H3" /></Icon>;
export const IcEye = (p) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Icon>;
export const IcEyeOff = (p) => <Icon {...p}><path d="m3 3 18 18" /><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.4 4M6.6 6.6C3.6 8.4 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 4-.9" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></Icon>;
export const IcTrash = (p) => <Icon {...p}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></Icon>;
export const IcEdit = (p) => <Icon {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></Icon>;
export const IcBarChart = (p) => <Icon {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Icon>;
export const IcGrid = (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon>;
export const IcSend = (p) => <Icon {...p}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></Icon>;
export const IcPaperclip = (p) => <Icon {...p}><path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></Icon>;
export const IcHome = (p) => <Icon {...p}><path d="m3 10.5 9-7.5 9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1Z" /></Icon>;
export const IcBag = (p) => <Icon {...p}><path d="M6 7h12l1.2 12.4a1.5 1.5 0 0 1-1.5 1.6H6.3a1.5 1.5 0 0 1-1.5-1.6Z" /><path d="M8.5 10V6a3.5 3.5 0 0 1 7 0v4" /></Icon>;
export const IcFilter = (p) => <Icon {...p}><path d="M3 5h18M6 12h12M10 19h4" /></Icon>;
export const IcRefresh = (p) => <Icon {...p}><path d="M21 12a9 9 0 1 1-2.6-6.3M21 3v6h-6" /></Icon>;
export const IcSparkles = (p) => <Icon {...p}><path d="m12 3 1.8 4.8L18.5 9.5l-4.7 1.7L12 16l-1.8-4.8L5.5 9.5l4.7-1.7Z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" /></Icon>;
export const IcZap = (p) => <Icon {...p}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></Icon>;
export const IcLock = (p) => <Icon {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Icon>;
export const IcSendMail = IcSend;
export const IcFacebook = (p) => <Icon {...p}><path d="M14 8h3V4.5h-3A3.5 3.5 0 0 0 10.5 8v2.5H8V14h2.5v6H14v-6h2.5l.5-3.5H14V8.5A.5.5 0 0 1 14.5 8Z" /></Icon>;
export const IcInstagram = (p) => <Icon {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></Icon>;
export const IcYoutube = (p) => <Icon {...p}><rect x="2.5" y="6" width="19" height="12" rx="3.5" /><path d="m10.5 9.5 4.5 2.5-4.5 2.5Z" fill="currentColor" stroke="none" /></Icon>;
export const IcLinkedin = (p) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 0 1 4 0v3" /></Icon>;
export const IcWhatsapp = (p) => <Icon {...p}><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" /><path d="M9 8.5c0 4 2.5 6.5 6.5 6.5.7 0 1.3-.6 1.3-1.3v-1l-2.2-.8-.8.8c-1.2-.4-2.3-1.5-2.7-2.7l.8-.8L11 6.5h-1C9.6 6.5 9 7.1 9 8.5Z" /></Icon>;
export const IcStarHalf = (p) => <Icon {...p}><path d="M12 2 9.5 8.3 2.8 8.9l5 4.4-1.5 6.5L12 16l5.7 3.8-1.5-6.5 5-4.4-6.7-.6Z" /></Icon>;
export const IcDownload = (p) => <Icon {...p}><path d="M12 3v11M7 9.5 12 14.5 17 9.5" /><path d="M4 20h16" /></Icon>;
export const IcUpload = (p) => <Icon {...p}><path d="M12 16V5M7.5 9.5 12 5l4.5 4.5" /><path d="M4 20h16" /></Icon>;
export const IcBell = (p) => <Icon {...p}><path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9" /><path d="M10 20a2.2 2.2 0 0 0 4 0" /></Icon>;
export const IcBuilding = (p) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h1.5M13.5 8H15M9 12h1.5M13.5 12H15M9 16h1.5M13.5 16H15M9 21v-3h6v3" /></Icon>;
export const IcServer = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" /></Icon>;
export const IcRocket = (p) => <Icon {...p}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M14.5 4.5C17 3 21 3 21 3s0 4-1.5 6.5L15 14l-5-5Z" /><path d="m13 8-2-2-4 1 2 3M15 11l2-2-1 4-3 2" /><circle cx="9.5" cy="14.5" r="1.5" /></Icon>;
export const IcClipboardCheck = (p) => <Icon {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 14l2 2 4-4" /></Icon>;
export const IcMessageCircle = (p) => <Icon {...p}><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.8 8.8 0 0 1-3.8-.9L3 21l2-5.3a8.3 8.3 0 0 1-1-4.2A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" /></Icon>;
export const IcCopy = (p) => <Icon {...p}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Icon>;
export const IcExternalLink = (p) => <Icon {...p}><path d="M14 4h6v6M20 4 10 14" /><path d="M19 14v5a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 19V7a1.5 1.5 0 0 1 1.5-1.5H10" /></Icon>;
export const IcShieldCheck = (p) => <Icon {...p}><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" /><path d="m8.8 11.6 2.2 2.2 4.2-4.4" /></Icon>;
export const IcNote = (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></Icon>;
export const IcUserPlus = (p) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></Icon>;
export const IcTicket = (p) => <Icon {...p}><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2.5a2 2 0 0 0 0 4V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5a2 2 0 0 0 0-4Z" /><path d="M15 5v2M15 11v2M15 17v2" opacity=".6" /></Icon>;
export const IcWallet = (p) => <Icon {...p}><path d="M20 7H5a2 2 0 0 1 0-4h13v4" /><path d="M4 3v16a2 2 0 0 0 2 2h14V7" /><path d="M16.5 13.5a1.5 1.5 0 1 0 0 3h3v-3Z" /></Icon>;

export default Icon;
