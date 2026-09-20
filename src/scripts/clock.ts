import { query } from "../utilities/dom";
import { profile } from "../content/profile";

export function initClock() {
  const time = query<HTMLTimeElement>("#local-time");
  const menuTime = document.querySelector<HTMLTimeElement>(".menu-local-time");
  if (!time && !menuTime) return () => {};
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: profile.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const update = () => {
    const now = new Date();
    const parts = formatter.formatToParts(now);
    const hours = parts.find((part) => part.type === "hour")?.value ?? "00";
    const minutes = parts.find((part) => part.type === "minute")?.value ?? "00";
    const iso = now.toISOString();
    const label = `${hours}:${minutes}, local time in Lahore`;
    for (const el of [time, menuTime]) {
      if (!el) continue;
      const hourBlock = el.querySelector("[data-hours], [data-menu-hours]");
      const minuteBlock = el.querySelector("[data-minutes], [data-menu-minutes]");
      if (hourBlock) hourBlock.textContent = hours;
      if (minuteBlock) minuteBlock.textContent = minutes;
      el.setAttribute("aria-label", label);
      el.dateTime = iso;
    }
  };
  update();
  const timer = window.setInterval(update, 30000);
  return () => clearInterval(timer);
}
