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

/*
 * Every cover is a 3:4 image, the shape of its card on every screen, made at
 * 3000 x 4000 and saved in /assets/projects at each width below. The browser
 * loads the one closest to the card's drawn width: half the page less the
 * gutter on desktop and tablet, the full width less the margins on phones.
 */
const coverWidths = [800, 1200, 1600, 2000, 2400, 3000];
const cover = (id: string, alt: string): Project["image"] => ({
  src: `/assets/projects/${id}-1600.webp`,
  alt,
  width: 3000,
  height: 4000,
  srcset: coverWidths
    .map((w) => `/assets/projects/${id}-${w}.webp ${w}w`)
    .join(", "),
  sizes:
    "(min-width: 901px) calc(50vw - 24px), (min-width: 601px) calc(50vw - 35px), calc(100vw - 40px)",
});

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
    image: cover(
      "energy-meadow",
      "Clean energy analytics dashboard over a meadow at sunset, showing solar output, consumption and plant status",
    ),
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
    image: cover(
      "survey",
      "Hassan's HRMForce survey deployment dashboard design",
    ),
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
    image: cover(
      "mycah",
      "Mycah family health application interface designed by Hassan",
    ),
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
    image: cover(
      "meows",
      "Meows Untold event website design with sculptural pink and orange artwork",
    ),
  },
] satisfies Project[];
