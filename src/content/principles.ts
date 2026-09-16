export interface Principle {
  number: string;
  title: string[];
  description: string;
}
export const principles = [
  {
    number: "01",
    title: ["Understand the problem.", "Then make it simple."],
    description:
      "Research, workflows, and real-world constraints shape the experience. Every screen should help someone take their next step with confidence.",
  },
  {
    number: "02",
    title: ["Care for the detail.", "Consider the whole."],
    description:
      "Thoughtful interactions and scalable design systems bring consistency to complex products, across roles, screens, and platforms.",
  },
  {
    number: "03",
    title: ["Stay close to the work.", "All the way to launch."],
    description:
      "I work alongside product and engineering, connecting early ideas to the small decisions that make a finished product feel right.",
  },
] satisfies Principle[];
