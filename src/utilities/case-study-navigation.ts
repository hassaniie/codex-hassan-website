/** Only known portfolio destinations can become a case study's return link. */
export function caseStudyReturn(
  search: string,
  referrer: string,
  origin: string,
) {
  const home = { href: "/", label: "← Back home" };
  const works = { href: "/works/", label: "← All works" };
  const entry = new URLSearchParams(search).get("from");
  if (entry === "home") return home;
  if (entry === "works" || entry !== null) return works;
  // Older links may not carry context. Never send a reader off-site.
  try {
    const previous = new URL(referrer);
    if (previous.origin === origin && previous.pathname === "/") return home;
  } catch {
    // Direct visits and missing referrers use the static Works fallback.
  }
  return works;
}
