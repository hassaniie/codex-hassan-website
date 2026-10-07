/*
 * Case study pages, one per published project. Each is a quiet gallery: a
 * short intro, then a few chapters of two or three lines, most of them led by
 * one large screen. The page template lays them out, so a new case study is a
 * new entry here and its images in /assets/case-studies/<folder>/.
 */

export interface CaseImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
}

export interface CaseChapter {
  title: string;
  text: string;
  image?: CaseImage;
  /** A dark screen sits on the page without the hairline a light one needs. */
  tone?: "light" | "dark";
}

export interface CaseStudy {
  slug: string;
  /** The project in projects.ts this tells the story of. */
  projectId: string;
  intro: string;
  /** One quiet line under the intro, read left to right. */
  facts: string[];
  lead: CaseImage;
  chapters: CaseChapter[];
}

/*
 * Screens are exported from Figma at 2x and saved at each width below, so the
 * browser loads the one closest to the size it draws.
 */
const widths = [800, 1200, 1600, 2000, 2400, 3000];
const shot =
  (folder: string) =>
  (name: string, width: number, height: number, alt: string): CaseImage => ({
    src: `/assets/case-studies/${folder}/${name}-1600.webp`,
    srcset: widths
      .map((w) => `/assets/case-studies/${folder}/${name}-${w}.webp ${w}w`)
      .join(", "),
    width,
    height,
    alt,
  });

const energy = shot("clean-energy");

export const caseStudies: CaseStudy[] = [
  {
    slug: "clean-energy-analytics",
    projectId: "energy",
    intro:
      "A clean-energy analytics suite for solar plants and the buildings they power. It turns thousands of daily readings into answers an energy team can act on, starting with the one question that always comes first.",
    facts: ["Product design", "UX/UI", "Web app", "Light & dark", "2026"],
    lead: energy(
      "lead",
      3840,
      2368,
      "EnersenX energy monitoring dashboard in a desktop window, showing live load, energy cost, savings and an energy breakdown",
    ),
    chapters: [
      {
        title: "Energy data is loud",
        text: "Kilowatts, sources, costs, thousands of readings a day. Shown all at once, every number looks equally urgent, and the person reading has to do the sorting. But the first question is always simple: are we making more than we’re using?",
      },
      {
        title: "Lead with two numbers",
        text: "Production and Consumption open every view. A large gauge reads current PV power against capacity, so the balance is clear before anything else. Everything below answers what comes next: how much was used on site, how much was imported, and what it was worth.",
        image: energy(
          "solar",
          3456,
          2160,
          "CerevraX Solar Energy Management System dashboard with system overview, plant status, a PV power gauge and environmental benefits",
        ),
      },
      {
        title: "Now first, then why",
        text: "Every dashboard reads from top to bottom: live figures first, then the trends that explain them, then the breakdowns by load, equipment and utility. Each card answers one question, and its title says which.",
        image: energy(
          "ems-dashboard",
          3456,
          2234,
          "Energy Monitoring System dashboard: live figures, real-time load curve, cost comparison, saving summary, energy breakdown and power quality",
        ),
      },
      {
        title: "Money and carbon, side by side",
        text: "Energy decisions are also cost and carbon decisions, so both sit beside the data instead of in a separate report. Spend breaks down by tariff period, savings opportunities are ranked by effort, and emissions are tracked against a baseline.",
        image: energy(
          "cost",
          3456,
          2234,
          "Cost and savings view with monthly cost breakdown by source, year-on-year comparison, tariff structure and savings opportunities",
        ),
      },
      {
        title: "Calm by default",
        text: "Colour is reserved for state. Panels stay quiet, charts use calm blues and greens, and red only appears for a peak tariff, a failure or an anomaly, so when something is loud, there is a reason. The dark theme keeps the same rules.",
        image: energy(
          "ems-dark",
          3456,
          2234,
          "Energy Monitoring System dashboard in the dark theme",
        ),
        tone: "dark",
      },
      {
        title: "Where it landed",
        text: "Twelve modules, from live dashboards and analytics to reports, alarms and user management, in light and dark, built on one shared component library. On a data-heavy screen, most of the design work is deciding what not to say first.",
      },
    ],
  },
];
