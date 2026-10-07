import { projects } from "../projects";

// The original project copy and meadow artwork are the source of this story.
// This is an interface exploration, not a claim of shipped or measured impact.
export const energyCaseStudy = {
  project: projects.find((project) => project.id === "energy")!,
  fullArtwork: "/assets/projects/energy-meadow-3000.webp",
  headline: ["Clean energy.", "Clearer decisions."],
  intro:
    "Turning a dense stream of energy data into a calm picture of what’s happening, what’s working, and what it means.",
  facts: [
    { label: "Discipline", value: "UX/UI · Data visualisation" },
    { label: "Format", value: "Desktop dashboard" },
    { label: "Scope", value: "Interface exploration" },
    { label: "Year", value: "2026" },
  ],
  chapters: [
    { id: "overview", number: "01", label: "The starting point" },
    { id: "hierarchy", number: "02", label: "Making sense of the data" },
    { id: "visual-language", number: "03", label: "A quieter visual language" },
    { id: "reflection", number: "04", label: "Looking back & ahead" },
  ],
  overview: {
    title: ["An answer before", "another number."],
    paragraphs: [
      "Kilowatts. Capacity. Yield. Consumption. Every reading matters, but a page full of equally urgent numbers makes it hard to know where to look first.",
      "The starting question was simpler: are we making more than we’re using? I used that question to organise the screen, moving from a system summary to current performance, then to the wider environmental picture.",
    ],
  },
  hierarchy: {
    title: ["A deliberate order", "of attention."],
    intro:
      "The screen reads in three layers. Each answers a different question, so the detail has a place without competing with the overview.",
    decisions: [
      {
        number: "01",
        question: "Is the system healthy?",
        title: "Start with the overview.",
        description:
          "Yield, charging, discharge and capacity sit together at the top. Plant status lives alongside them, pairing colour with labels and counts so the signal isn’t carried by colour alone.",
      },
      {
        number: "02",
        question: "What’s happening right now?",
        title: "Give performance the centre.",
        description:
          "Current PV power has the strongest visual presence. Daily solar power and performance flank it, while consumption, self-use and imported energy sit in a quieter supporting row.",
      },
      {
        number: "03",
        question: "What does that energy mean?",
        title: "End with the wider picture.",
        description:
          "Environmental benefits translate the technical readings into familiar references: carbon saved, equivalent trees, coal saved and waste recycling. A gentler illustrated finish gives these numbers their own space.",
      },
    ],
  },
  visualLanguage: {
    title: ["Technical information.", "A human pace."],
    paragraphs: [
      "Frosted white panels establish a consistent reading surface against the meadow. Neutral backgrounds hold the everyday readings; blues and greens bring attention to performance and environmental information.",
      "Space does as much work as colour. Related numbers stay close, sections have room to breathe, and the larger gauges establish the visual hierarchy before the smaller details come into focus.",
    ],
    principles: [
      { label: "Surface", value: "Frosted, light, contained" },
      { label: "Colour", value: "Calm blues & greens" },
      { label: "Hierarchy", value: "Summary → performance → impact" },
    ],
  },
  reflection: {
    title: ["Clarity is a", "design decision."],
    paragraphs: [
      "The useful part of this exploration is the hierarchy: a screen that gives each kind of information a clear role, rather than asking every number to become the headline.",
      "The next step would be testing that hierarchy with people monitoring energy systems: can they find an abnormal plant, compare generation with consumption, and explain the units without hesitation? Empty, delayed-data and alert states would need the same care before this became a working product.",
    ],
    note: "Interface exploration. The energy readings shown are illustrative.",
  },
} as const;
