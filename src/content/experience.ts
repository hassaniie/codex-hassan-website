export interface Experience {
  company: string;
  period: string;
  description: string;
  role: string;
}
export const experience = [
  {
    company: "NASTP Delta",
    period: "(2025 \u2014 now)",
    description:
      "Enterprise IoT and building management. Designing infrastructure monitoring, role-based workflows, and a shared design system for complex operational environments.",
    role: "Senior Product Designer",
  },
  {
    company: "Vertex IT Systems",
    period: "(2024 \u2014 2025)",
    description:
      "End-to-end product design for vStellar Studio, a low-code software testing platform. Simplifying technical workflows and the path from onboarding to first use.",
    role: "UX/UI Designer",
  },
  {
    company: "Shufti \u00b7 Programmers Force",
    period: "(2023 \u2014 2024)",
    description:
      "Identity verification and backoffice experiences. Streamlining KYC workflows, navigation, and interface patterns for enterprise users.",
    role: "Product Designer",
  },
  {
    company: "Datum Brain",
    period: "(2022 \u2014 2023)",
    description:
      "Ground-up compliance platforms, transaction monitoring, and ERP workflows. Working with founders to take products from early direction to detailed interfaces.",
    role: "Associate UX/UI Designer",
  },
] satisfies Experience[];
