export const profile = {
  name: "Hassan Mushtaq",
  role: "Product & UX/UI designer",
  email: "uxhassan99@gmail.com",
  location: "Lahore, Pakistan",
  timeZone: "Asia/Karachi",
  timeZoneLabel: "PKT (GMT+5)",
  portrait: "/assets/hassan.jpg",
  avatar: "/assets/hassan-avatar.webp",
  resume: "/assets/hassan-mushtaq-resume.pdf",
  availability: "Open to opportunities",
  title: "Hassan Mushtaq — Product & UX/UI Designer",
  description:
    "Hassan Mushtaq is a product and UX/UI designer in Lahore, creating thoughtful digital products, complex interfaces, and scalable design systems.",
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/uxhassan/" },
    { label: "Behance", href: "https://www.behance.net/uxhassan" },
    { label: "Dribbble", href: "https://dribbble.com/uxhassan" },
  ],
} as const;
export const mailto = `mailto:${profile.email}`;
export const behance = profile.socialLinks.find(
  (link) => link.label === "Behance",
)!.href;
