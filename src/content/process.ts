export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  meta: string;
}
export const process = [
  {
    number: "01",
    title: "Listen",
    description:
      "Interviews, the workflows already in place, and the constraints nobody wrote down. The work starts with what people actually do.",
    meta: "Interviews · Workflows · Constraints",
  },
  {
    number: "02",
    title: "Frame",
    description:
      "A vague ask becomes a sharp problem, with a measure of success agreed on before anyone opens a design tool.",
    meta: "Scope · Success measures",
  },
  {
    number: "03",
    title: "Shape",
    description:
      "Sketches, then wireframes, then something clickable. It goes in front of someone while it is still cheap to change.",
    meta: "Sketches · Prototypes · Testing",
  },
  {
    number: "04",
    title: "Systemise",
    description:
      "One screen becomes a pattern, and patterns become a system that holds together across roles, screens, and platforms.",
    meta: "Components · Tokens · Documentation",
  },
  {
    number: "05",
    title: "Ship",
    description:
      "Alongside product and engineering through build and QA, down to the small decisions that make it feel finished.",
    meta: "Handoff · QA · Launch",
  },
] satisfies ProcessStep[];
