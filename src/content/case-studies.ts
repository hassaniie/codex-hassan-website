/*
 * Case study pages, one per published project: a short brief, then a few
 * chapters read down one centred column. The page template lays them out, so
 * a new case study is a new entry here.
 */

/** A window onto the project artwork: the whole piece, or one band of it. */
export type CaseView = "landscape" | "performance" | "impact";

export interface CaseChapter {
  id: string;
  number: string;
  /** The short name used in the reading guide and the chapter kicker. */
  label: string;
  title: string;
  paragraphs: string[];
  /** Questions the design answers, each with how it answers. */
  decisions?: { question: string; description: string }[];
  figure?: { view: CaseView; caption: string };
  note?: string;
}

export interface CaseStudy {
  slug: string;
  /** The project in projects.ts this tells the story of. */
  projectId: string;
  headline: string[];
  intro: string;
  /** The quick answers beside the artwork in the first view. */
  brief: { label: string; value: string }[];
  /** The full-resolution artwork, opened from every figure. */
  fullArtwork: string;
  heroCaption: string;
  chapters: CaseChapter[];
}

export const caseStudies: CaseStudy[] = [
  {
    // The project's own copy and meadow artwork are the source of this
    // story. It is an interface exploration, not a claim of measured impact.
    slug: "clean-energy-analytics",
    projectId: "energy",
    headline: ["Clean energy.", "Clearer decisions."],
    intro:
      "A desktop dashboard for monitoring solar energy. Generation and consumption lead the story; system health and environmental impact add context.",
    brief: [
      {
        label: "The challenge",
        value: "Make dense energy readings easier to prioritise at a glance.",
      },
      {
        label: "My contribution",
        value: "Information hierarchy, dashboard UI and data visualisation.",
      },
      {
        label: "Project status",
        value: "Interface exploration · Not yet validated with users.",
      },
    ],
    fullArtwork: "/assets/projects/energy-meadow-3000.webp",
    heroCaption: "The complete dashboard.",
    chapters: [
      {
        id: "problem",
        number: "01",
        label: "The problem",
        title: "A useful answer before another number.",
        paragraphs: [
          "Kilowatts. Capacity. Yield. Consumption. Every reading matters, but a page full of equally urgent numbers makes it hard to know where to look first.",
          "The starting question was simpler: are we making more than we’re using? I used that question to organise the screen, moving from a system summary to current performance, then to the wider environmental picture.",
        ],
      },
      {
        id: "approach",
        number: "02",
        label: "Design approach",
        title: "Three layers, three questions.",
        paragraphs: [
          "The screen reads in three layers. Each answers a different question, so the detail has a place without competing with the overview.",
        ],
        decisions: [
          {
            question: "Is the system healthy?",
            description:
              "Yield, charging, discharge and capacity sit together at the top. Plant status lives alongside them, pairing colour with labels and counts so the signal isn’t carried by colour alone.",
          },
          {
            question: "What’s happening right now?",
            description:
              "Current PV power has the strongest visual presence. Daily solar power and performance flank it, while consumption, self-use and imported energy sit in a quieter supporting row.",
          },
          {
            question: "What does that energy mean?",
            description:
              "Environmental benefits translate the technical readings into familiar references: carbon saved, equivalent trees, coal saved and waste recycling. A gentler illustrated finish gives these numbers their own space.",
          },
        ],
        figure: {
          view: "performance",
          caption: "A closer look at the performance hierarchy.",
        },
      },
      {
        id: "visual-language",
        number: "03",
        label: "Visual language",
        title: "A calmer surface for technical information.",
        paragraphs: [
          "Frosted white panels establish a consistent reading surface against the meadow. Neutral backgrounds hold the everyday readings; blues and greens bring attention to performance and environmental information.",
          "Space does as much work as colour. Related numbers stay close, sections have room to breathe, and the larger gauges establish the visual hierarchy before the smaller details come into focus.",
        ],
        figure: {
          view: "impact",
          caption: "Environmental benefits, given their own space.",
        },
      },
      {
        id: "reflection",
        number: "04",
        label: "Reflection",
        title: "What this explores. What comes next.",
        paragraphs: [
          "The useful part of this exploration is the hierarchy: a screen that gives each kind of information a clear role, rather than asking every number to become the headline.",
          "The next step would be testing that hierarchy with people monitoring energy systems: can they find an abnormal plant, compare generation with consumption, and explain the units without hesitation? Empty, delayed-data and alert states would need the same care before this became a working product.",
        ],
        note: "Interface exploration. The energy readings shown are illustrative.",
      },
    ],
  },
];
