import type { Project } from "../projects";

export interface CaseStudyChapter {
  id: string;
  number: string;
  label: string;
}

export interface CaseStudySummary {
  project: Project;
  headline: readonly string[];
  intro: string;
  fullArtwork: string;
  brief: readonly { label: string; value: string }[];
  chapters: readonly CaseStudyChapter[];
}
