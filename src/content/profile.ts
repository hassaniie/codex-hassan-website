export const profile = {
  name: "Hassan Mushtaq",
  role: "Product Designer & Engineer",
  email: "uxhassan99@gmail.com",
  location: "Lahore, Pakistan",
  timeZone: "Asia/Karachi",
  timeZoneLabel: "PKT (GMT+5)",
  portrait: "/assets/hassan.jpg",
  avatar: "/assets/hassan-avatar.webp",
  resume: "/assets/hassan-mushtaq-resume.pdf",
  availability: "Open to opportunities",
  title: "Hassan Mushtaq — Product Designer & Engineer",
  description:
    "Senior product designer and engineer in Lahore, building complex digital interfaces for companies and brands that move forward.",
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/uxhassan/" },
    { label: "Behance", href: "https://www.behance.net/uxhassan" },
    { label: "Dribbble", href: "https://dribbble.com/uxhassan" },
  ],
} as const;
export const mailto = `mailto:${profile.email}`;
/*
 * The contact form posts here, and FormSubmit emails each message to the
 * address above. A new address has to be confirmed once: the first message
 * sent to it triggers an "Activate Form" email from FormSubmit.
 */
export const formEndpoint = `https://formsubmit.co/ajax/${profile.email}`;
export const behance = profile.socialLinks.find(
  (link) => link.label === "Behance",
)!.href;
