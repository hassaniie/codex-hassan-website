/** Queries are optional so shared behaviors remain safe on future page layouts. */
export const query = <T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
) => root.querySelector<T>(selector);
export const queryAll = <T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
) => [...root.querySelectorAll<T>(selector)];
export type Cleanup = () => void;
export interface BehaviorContext {
  signal: AbortSignal;
  reducedMotion: boolean;
}
