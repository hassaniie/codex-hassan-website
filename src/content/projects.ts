/*
 * The vocabulary the works filter is built from, and the order its chips
 * appear in. It is deliberately separate from `tags`, which are display copy:
 * those mix discipline, industry and platform, so every one of them is a
 * bucket of exactly one project. Declared `as const` so a category typed into
 * a project that is not on this list fails `astro check` rather than becoming
 * a chip that quietly matches nothing.
 */
export const categories = [
  "UX/UI design",
  "Product design",
  "App design",
  "Web design",
] as const;
export type Category = (typeof categories)[number];

export interface Project {
  id: string;
  title: string[];
  year: string;
  /** One paragraph, or several. */
  description: string | string[];
  tags: string[];
  categories: Category[];
  /** The published case study. Left out, the card reads "Case study coming soon". */
  href?: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** Pre-shrunk sizes, so the browser never scales a large file down itself. */
    srcset?: string;
    sizes?: string;
  };
}
export const projects = [
  {
    id: "energy",
    title: ["Clean Energy Analytics", "Dashboard Design"],
    year: "2026",
    description: [
      "Energy data is loud - kilowatts, sources, costs, thousands of readings a day. But the first question is always simple: are we making more than we’re using?",
      "So I built the whole dashboard around two numbers - Production and Consumption - and let everything else answer what comes next. Frosted white panels, calm blues and greens, charts that breathe, nothing louder than it needs to be.",
    ],
    tags: ["Dashboard design", "Data visualisation", "Clean energy"],
    categories: ["Product design", "UX/UI design"],
    image: {
      src: "/assets/energy.webp",
      alt: "Clean energy analytics dashboard floating over a family home, showing solar output, consumption and plant status",
      width: 3200,
      height: 4000,
      srcset: [800, 1000, 1200, 1600, 2000, 2400]
        .map((w) => `/assets/energy-${w}.webp ${w}w`)
        .concat("/assets/energy.webp 3200w")
        .join(", "),
      // The card is half the page on desktop and full width on phones, and
      // the cover is drawn at 112% for its parallax.
      sizes: "(min-width: 901px) 56vw, (min-width: 601px) 50vw, 100vw",
    },
  },
  {
    id: "survey",
    title: ["Making space", "for employee voices."],
    year: "2026",
    description:
      "A clearer survey experience for HR teams. Bringing deployment, response tracking, and employee feedback into one considered workflow.",
    tags: ["Product design", "UX/UI", "Enterprise SaaS"],
    categories: ["Product design", "UX/UI design"],
    href: "https://www.behance.net/gallery/249382607/Employee-Engagement-Survey-Platform-Modern-HR-System",
    image: {
      src: "/assets/survey.webp",
      alt: "Hassan's HRMForce survey deployment dashboard design",
      width: 1400,
      height: 908,
    },
  },
  {
    id: "mycah",
    title: ["Mycah.", "Care, connected."],
    year: "2026",
    description:
      "A mobile experience for managing family health. Appointments, medications, and records come together in an approachable everyday interface.",
    tags: ["Healthcare", "Mobile app", "UX/UI design"],
    categories: ["App design", "UX/UI design"],
    href: "https://www.behance.net/gallery/247474201/Mycah-Healthcare-Mobile-App-UXUI-Design",
    image: {
      src: "/assets/mycah.webp",
      alt: "Mycah family health application interface designed by Hassan",
      width: 1400,
      height: 1601,
    },
  },
  {
    id: "meows",
    title: ["Meows Untold.", "An experience begins."],
    year: "2025",
    description:
      "A digital home for an event, from the first impression to finding a ticket. Expressive visuals meet a focused discovery and booking experience.",
    tags: ["Web design", "Interaction", "Event platform"],
    categories: ["Web design", "UX/UI design"],
    href: "https://www.behance.net/gallery/221670441/Meows-Untold-Online-Event-Ticket-Booking-Platform",
    image: {
      src: "/assets/meows.webp",
      alt: "Meows Untold event website design with sculptural pink and orange artwork",
      width: 1400,
      height: 788,
    },
  },
] satisfies Project[];
