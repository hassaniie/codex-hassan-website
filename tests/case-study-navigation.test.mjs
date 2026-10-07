import test from "node:test";
import assert from "node:assert/strict";
import { caseStudyReturn } from "../src/utilities/case-study-navigation.ts";

const origin = "https://portfolio.example";
test("explicit entry context survives reloads and overrides a different referrer", () => {
  assert.deepEqual(
    caseStudyReturn(
      "?from=home",
      `${origin}/works/clean-energy/?from=home`,
      origin,
    ),
    {
      href: "/",
      label: "← Back home",
    },
  );
  assert.equal(
    caseStudyReturn("?from=works", `${origin}/`, origin).href,
    "/works/",
  );
});

test("legacy home links return home while direct and foreign visits return Works", () => {
  assert.equal(caseStudyReturn("", `${origin}/#work`, origin).href, "/");
  for (const referrer of [
    "",
    "not a URL",
    "https://elsewhere.example/",
    `${origin}/works/`,
  ])
    assert.equal(caseStudyReturn("", referrer, origin).href, "/works/");
});

test("unrecognised return contexts cannot redirect the reader elsewhere", () => {
  for (const entry of [
    "https://elsewhere.example/",
    "//elsewhere.example",
    "home/../../",
    "",
  ])
    assert.equal(
      caseStudyReturn(
        `?from=${encodeURIComponent(entry)}`,
        `${origin}/`,
        origin,
      ).href,
      "/works/",
    );
});
