export interface Project {
  id: string;
  title: string[];
  year: string;
  description: string;
  tags: string[];
  href: string;
  image: { src: string; alt: string; width: number; height: number };
}
export const projects = [
  {
    id: "survey",
    title: ["Making space", "for employee voices."],
    year: "2026",
    description:
      "A clearer survey experience for HR teams. Bringing deployment, response tracking, and employee feedback into one considered workflow.",
    tags: ["Product design", "UX/UI", "Enterprise SaaS"],
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
    href: "https://www.behance.net/gallery/221670441/Meows-Untold-Online-Event-Ticket-Booking-Platform",
    image: {
      src: "/assets/meows.webp",
      alt: "Meows Untold event website design with sculptural pink and orange artwork",
      width: 1400,
      height: 788,
    },
  },
] satisfies Project[];
