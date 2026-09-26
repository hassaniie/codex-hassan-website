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
  description: string;
  tags: string[];
  categories: Category[];
  href: string;
  /*
   * A 4:5 thumbnail on a flat background. The card shows it whole and fills
   * any spare room with `background`, the thumbnail's own edge colour, so it
   * is never cropped whatever shape the frame takes.
   */
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    background: string;
  };
}
export const projects = [
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
      src: "/assets/survey-thumb.webp",
      alt: "Hassan's HRMForce survey deployment dashboard design",
      width: 1600,
      height: 2000,
      background: "#21409a",
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
      src: "/assets/mycah-thumb.webp",
      alt: "Mycah family health application interface designed by Hassan",
      width: 1600,
      height: 2000,
      background: "#006c55",
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
      src: "/assets/meows-thumb.webp",
      alt: "Meows Untold event website design with sculptural pink and orange artwork",
      width: 1600,
      height: 2000,
      background: "#e8c4d7",
    },
  },
] satisfies Project[];
