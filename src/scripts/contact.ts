import { query, type BehaviorContext } from "../utilities/dom";
import { profile } from "../content/profile";

export function initContact({ signal }: BehaviorContext) {
  const status = query(".toast");
  let timer = 0;
  query(".copy-email")?.addEventListener(
    "click",
    async () => {
      let message = "Email copied. Say hello.";
      try {
        await navigator.clipboard.writeText(profile.email);
      } catch {
        message = profile.email;
      }
      if (signal.aborted || !status) return;
      status.textContent = message;
      status.classList.add("visible");
      clearTimeout(timer);
      timer = window.setTimeout(() => status.classList.remove("visible"), 3000);
    },
    { signal },
  );
  return () => {
    clearTimeout(timer);
    status?.classList.remove("visible");
  };
}
