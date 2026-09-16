import { query } from "../utilities/dom";
import { profile } from "../content/profile";

export function initClock() {
  const time = query<HTMLTimeElement>("#local-time");
  if (!time) return () => {};
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
    const hourBlock = time.querySelector("[data-hours]");
    const minuteBlock = time.querySelector("[data-minutes]");
    if (hourBlock) hourBlock.textContent = hours;
    if (minuteBlock) minuteBlock.textContent = minutes;
    time.setAttribute(
      "aria-label",
      `${hours}:${minutes}, local time in Lahore`,
    );
    time.dateTime = now.toISOString();
  };
  update();
  const timer = window.setInterval(update, 30000);
  return () => clearInterval(timer);
}
