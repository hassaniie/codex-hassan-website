import type { BehaviorContext, Cleanup } from "../../utilities/dom";
import { initHeroScene } from "./hero";
import { initTokenScene } from "./token";
import { initWorkScene } from "./work";
import { initSectionScenes } from "./sections";
import { initVelocityScene } from "./velocity";

/** Homepage choreography, composed so each scene owns its own cleanup. */
export function initScenes(context: BehaviorContext): Cleanup {
  const cleanups = [
    initHeroScene(context),
    initTokenScene(context),
    initWorkScene(context),
    initSectionScenes(context),
    initVelocityScene(context),
  ];
  return () => cleanups.forEach((cleanup) => cleanup());
}
