/*
 * The skills block under Experience. Drawn from Hassan's resume. Each tool
 * shows its official logo, unaltered, from the svg-logos collection (CC0, via
 * @iconify-json/logos 1.2.14); Maze, which it lacks, is the Simple Icons mark
 * (CC0) in Maze's black. The files live in public/assets/tools.
 */
export interface Tool {
  name: string;
  /** The logo file, served from public/. */
  logo: string;
}
export interface Skill {
  title: string;
  description: string;
  tags?: string[];
  tools?: Tool[];
}

const tools: Tool[] = [
  { name: "Figma", logo: "/assets/tools/figma.svg" },
  { name: "Miro", logo: "/assets/tools/miro.svg" },
  { name: "Jira", logo: "/assets/tools/jira.svg" },
  { name: "Linear", logo: "/assets/tools/linear.svg" },
  { name: "Notion", logo: "/assets/tools/notion.svg" },
  { name: "Maze", logo: "/assets/tools/maze.svg" },
  { name: "Claude", logo: "/assets/tools/claude.svg" },
  { name: "Cursor", logo: "/assets/tools/cursor.svg" },
  { name: "Gemini", logo: "/assets/tools/gemini.svg" },
];

export const skills = [
  {
    title: "Product & UX strategy",
    description:
      "Every good interface starts with the right question. I dig into who\u2019s using it, what they\u2019re trying to get done and where they get stuck, then shape that into flows, wireframes and prototypes we can test before a single pixel is polished.",
    tags: [
      "User research & discovery",
      "Journey mapping",
      "Jobs-to-be-done",
      "Design sprints",
      "Wireframes & prototypes",
      "Usability testing",
    ],
  },
  {
    title: "UI & interaction design",
    description:
      "I design for the hard stuff: real-time dashboards, data-dense screens, compliance flows and control panels where one wrong click matters. My job is to make that complexity feel calm, clear on every screen size and accessible to everyone.",
    tags: [
      "Dashboards & data visualisation",
      "KYC & compliance flows",
      "IoT control interfaces",
      "Responsive & adaptive design",
      "Accessibility (WCAG 2.2)",
      "Generative UI",
    ],
  },
  {
    title: "Design systems",
    description:
      "I build systems teams actually use, from tokens and custom icons to libraries of 150+ components, so products stay consistent across web and mobile and developers ship faster with fewer surprises.",
    tags: [
      "Component libraries",
      "Design tokens",
      "Custom iconography",
      "Figma variants & auto layout",
      "Multi-platform consistency",
    ],
  },
  {
    title: "Collaboration & delivery",
    description:
      "With a degree in software engineering, I speak both design and code. I work in agile teams alongside product, engineering and stakeholders: planning sprints, presenting ideas clearly and handing off designs that get built the way they were meant to.",
    tags: [
      "Agile / Scrum",
      "Sprint planning",
      "Developer handoff",
      "Stakeholder presentations",
      "Cross-functional teams",
    ],
  },
  {
    title: "Industries I know",
    description:
      "Four-plus years across products where the stakes are real: buildings that must stay safe, money that must stay compliant, identities that must be verified and health data that must be trusted.",
    tags: [
      "IoT & smart buildings",
      "Fintech & compliance",
      "Identity verification (KYC/AML)",
      "Low-code platforms",
      "B2B SaaS",
      "ERP systems",
      "Healthcare",
      "e-Commerce",
    ],
  },
  {
    title: "Tools & AI workflow",
    description:
      "Figma is home base, with FigJam and Miro for workshops, ProtoPie for high-fidelity prototypes and Zeroheight for documentation. Jira, Linear and Notion keep delivery moving, and Maze helps me test with real users. AI tools like Claude, Cursor and Gemini speed up research synthesis, ideation and iteration; the judgement stays human.",
    tools,
  },
] satisfies Skill[];
