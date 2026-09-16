import { profile } from "../content/profile";
import { query, type BehaviorContext } from "../utilities/dom";

export function initContactForm({ signal }: BehaviorContext) {
  const form = query<HTMLFormElement>("#contact-form");
  const status = query(".toast");
  if (!form) return () => {};
  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get("name") || "");
      const email = String(data.get("email") || "");
      const company = String(data.get("company") || "");
      const details = String(data.get("details") || "");
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(
        [
          `Name: ${name}`,
          `Email: ${email}`,
          company && `Company: ${company}`,
          "",
          details,
        ]
          .filter((line, index) => line || index === 3)
          .join("\n"),
      );
      if (status) {
        status.textContent = "Opening your email app…";
        status.classList.add("visible");
      }
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    },
    { signal },
  );
  return () => status?.classList.remove("visible");
}
