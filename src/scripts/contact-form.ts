import { formEndpoint, profile } from "../content/profile";
import { query, type BehaviorContext } from "../utilities/dom";

/**
 * Sends the form to FormSubmit, which emails it to the address in profile.
 * If that fails (offline, the service is down, or the address hasn't been
 * activated yet) the message isn't lost: the visitor's email app opens with
 * it already written, which is what the form used to do on its own.
 */
export function initContactForm({ signal }: BehaviorContext) {
  const form = query<HTMLFormElement>("#contact-form");
  const status = query(".toast");
  if (!form) return () => {};
  const button = query<HTMLButtonElement>('button[type="submit"]', form);
  let timer = 0;
  const say = (message: string, hideAfter = 0) => {
    if (!status) return;
    clearTimeout(timer);
    status.textContent = message;
    status.classList.add("visible");
    if (hideAfter)
      timer = window.setTimeout(
        () => status.classList.remove("visible"),
        hideAfter,
      );
  };

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const field = (name: string) => String(data.get(name) || "").trim();
      const name = field("name");
      const email = field("email");
      const company = field("company");
      const details = field("details");
      const subject = `Portfolio enquiry from ${name}`;

      // Bots fill every field; people never see this one.
      if (field("website")) {
        form.reset();
        say("Thanks, your message is on its way.", 5000);
        return;
      }

      if (button) button.disabled = true;
      say("Sending…");
      try {
        const response = await fetch(formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            company: company || "—",
            message: details,
            _subject: subject,
            _replyto: email,
            _template: "table",
            _captcha: "false",
          }),
          signal,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || String(result.success) !== "true")
          throw new Error(result.message || `HTTP ${response.status}`);
        form.reset();
        say("Thanks, your message is on its way.", 5000);
      } catch (error) {
        if (signal.aborted) return;
        say("Couldn't send it here. Opening your email app instead…", 5000);
        const body = [
          `Name: ${name}`,
          `Email: ${email}`,
          company && `Company: ${company}`,
          "",
          details,
        ]
          .filter((line, index) => line || index === 3)
          .join("\n");
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } finally {
        if (button) button.disabled = false;
      }
    },
    { signal },
  );
  return () => {
    clearTimeout(timer);
    status?.classList.remove("visible");
  };
}
