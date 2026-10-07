/*
 * Case study pages, one per published project. Each is a short story told in
 * blocks: the page template lays them out, so a new case study is a new entry
 * here and its images in /assets/case-studies/<slug>/, nothing else.
 */

export interface CaseImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
}

export interface CaseFigure {
  image: CaseImage;
  caption: string;
  /**
   * How the screen meets the page: a light one gets a hairline, a dark one
   * stands alone, and a framed one brings its own window chrome.
   */
  tone?: "light" | "dark" | "framed";
}

export type CaseBlock =
  | { type: "text"; paragraphs: string[] }
  | { type: "statement"; text: string }
  | { type: "stats"; items: { value: string; label: string }[] }
  | {
      type: "point";
      number: string;
      title: string;
      text: string;
      figures: CaseFigure[];
    };

export interface CaseSection {
  id: string;
  label: string;
  title: string;
  blocks: CaseBlock[];
}

export interface CaseStudy {
  slug: string;
  /** The project in projects.ts this tells the story of. */
  projectId: string;
  summary: string;
  facts: { label: string; value: string }[];
  lead: CaseFigure;
  sections: CaseSection[];
  /** Extra screens shown together after the story. */
  gallery?: CaseFigure[];
}

/*
 * Screens are exported from Figma at 2x and saved at each width below, so the
 * browser loads the one closest to the size it draws.
 */
const widths = [800, 1200, 1600, 2000, 2400];
const shot =
  (slug: string) =>
  (
    name: string,
    width: number,
    height: number,
    alt: string,
    sizes = widths,
  ): CaseImage => ({
    src: `/assets/case-studies/${slug}/${name}-1600.webp`,
    srcset: sizes
      .map((w) => `/assets/case-studies/${slug}/${name}-${w}.webp ${w}w`)
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
    summary:
      "A clean-energy analytics suite for solar plants and the buildings they power. It turns thousands of daily readings into answers an energy team can act on, starting with the one question that always comes first.",
    facts: [
      { label: "Role", value: "Product designer, UX/UI" },
      {
        label: "Scope",
        value: "Dashboard design, data visualisation, design system",
      },
      { label: "Platform", value: "Web app, desktop, light and dark themes" },
      { label: "Products", value: "CerevraX BMS, EnersenX EMS" },
      { label: "Year", value: "2026" },
    ],
    lead: {
      image: energy(
        "lead",
        3840,
        2368,
        "EnersenX energy monitoring dashboard in a desktop window, showing live load, energy cost, savings and an energy breakdown",
        [...widths, 3000],
      ),
      caption: "EnersenX, Energy Monitoring System dashboard",
    },
    sections: [
      {
        id: "overview",
        label: "Overview",
        title: "One clear picture of where the energy goes",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "Solar plants report yield and capacity, batteries charge and discharge, and the grid and generators fill the gaps, each with its own tariff and its own carbon cost. The people running these sites need to see all of it, but they need to read it in the right order.",
              "I designed two connected products for them: the Solar Energy Management System inside the CerevraX building platform, and an Energy Monitoring System that follows the same power through to cost, savings and emissions, also delivered as EnersenX for a partner.",
            ],
          },
          {
            type: "stats",
            items: [
              { value: "02", label: "Numbers every view starts from" },
              { value: "12", label: "Modules, from live data to reports" },
              { value: "02", label: "Themes, light and dark" },
            ],
          },
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        title: "Energy data is loud",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "Kilowatts, sources, costs, thousands of readings a day. Put on screen all at once, every number looks equally urgent, and the person reading it has to do the sorting themselves.",
            ],
          },
          {
            type: "statement",
            text: "But the first question is always simple: are we making more than we’re using?",
          },
        ],
      },
      {
        id: "decisions",
        label: "Decisions",
        title: "Four decisions that shaped it",
        blocks: [
          {
            type: "point",
            number: "3.1",
            title: "Lead with two numbers",
            text: "Production and Consumption open every view. A large gauge reads current PV power against capacity, with daily solar power and performance either side, so the balance is clear before anything else. Everything below answers what comes next: how much was used on site, how much was imported, and what it was worth.",
            figures: [
              {
                image: energy(
                  "solar",
                  3456,
                  2160,
                  "CerevraX Solar Energy Management System dashboard with system overview, plant status, a PV power gauge and environmental benefits",
                ),
                caption: "CerevraX, Solar Energy Management System",
              },
            ],
          },
          {
            type: "point",
            number: "3.2",
            title: "Now first, then why",
            text: "Every dashboard reads from top to bottom. A strip of live figures comes first: power, today’s energy, cost, demand, power factor and savings. Then come the trends that explain them, then the breakdowns by load, equipment and utility. Each card answers one question, and its title says which.",
            figures: [
              {
                image: energy(
                  "ems-dashboard",
                  3456,
                  2234,
                  "Energy Monitoring System dashboard: live figures, real-time load curve, cost comparison, saving summary, energy breakdown and power quality",
                ),
                caption: "Energy Monitoring System, live overview",
              },
            ],
          },
          {
            type: "point",
            number: "3.3",
            title: "Money and carbon in the same view",
            text: "Energy decisions are also cost and carbon decisions, so both sit beside the energy data instead of in a separate report. Cost & Savings breaks spend down by tariff period and ranks savings opportunities by effort. GHG Emissions tracks scope 1, 2 and 3 against a baseline.",
            figures: [
              {
                image: energy(
                  "cost",
                  3456,
                  2234,
                  "Cost and savings view with monthly cost breakdown by source, year-on-year comparison, tariff structure and savings opportunities",
                ),
                caption: "Cost & Savings, tariffs and opportunities",
              },
              {
                image: energy(
                  "ghg",
                  2896,
                  2172,
                  "GHG emissions dashboard with emissions by source, scope 1, 2 and 3 breakdown, cumulative emissions and emissions against baseline",
                ),
                caption: "GHG Emissions, scope 1, 2 and 3 against baseline",
                tone: "framed",
              },
            ],
          },
          {
            type: "point",
            number: "3.4",
            title: "Calm by default, loud when it matters",
            text: "Colour is reserved for state. Panels stay white, charts use calm blues and greens, and red only appears for a peak tariff, a failure or an anomaly, so when something is loud, there is a reason. The dark theme follows the same rules for screens that stay on all day.",
            figures: [
              {
                image: energy(
                  "ems-dark",
                  3456,
                  2234,
                  "Energy Monitoring System dashboard in the dark theme",
                ),
                caption: "Dark theme, same hierarchy, same rules",
                tone: "dark",
              },
            ],
          },
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        title: "Where it landed",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "The design spans twelve modules, from live dashboards and analytics to reports, alarms and user management, in light and dark themes, all built on one shared component library.",
              "Reports can be generated from templates or scheduled, and analytics adds forecasting, insights and anomaly detection on top of the live data.",
            ],
          },
          {
            type: "statement",
            text: "On a data-heavy screen, most of the design work is deciding what not to say first.",
          },
        ],
      },
    ],
  },
];
