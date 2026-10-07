import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const root = new URL("../dist/", import.meta.url);
const path = "/works/clean-energy/";
const html = await readFile(new URL(`.${path}index.html`, root), "utf8");

test("energy case study is reachable from both project listings in the same tab", async () => {
  for (const [page, entry] of [
    ["index.html", "home"],
    ["works/index.html", "works"],
  ]) {
    const listing = await readFile(new URL(page, root), "utf8");
    const links = [
      ...listing.matchAll(
        /<a\b[^>]*href="\/works\/clean-energy\/\?from=(?:home|works)"[^>]*>/g,
      ),
    ];
    assert.equal(links.length, 2, `Missing cover or CTA link in ${page}`);
    for (const [link] of links) {
      assert.ok(!link.includes('target="_blank"'));
      assert.ok(
        link.includes(`?from=${entry}"`),
        `Wrong return context in ${page}`,
      );
    }
  }
  const sitemap = await readFile(new URL("sitemap.xml", root), "utf8");
  assert.ok(sitemap.includes(path));
});

test("case study content and every chapter destination exist in static HTML", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ["overview", "hierarchy", "visual-language", "reflection"])
    assert.ok(ids.includes(id), `Missing chapter ${id}`);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.includes(id), `Broken local chapter target ${id}`);
  assert.ok(html.includes("Interface exploration"));
  assert.ok(html.includes("energy readings shown are illustrative"));
  const opening = html.match(/<header class="case-hero"[\s\S]*?<\/header>/)[0];
  for (const answer of [
    "The challenge",
    "My contribution",
    "Project status",
    "Not yet validated with users",
  ])
    assert.ok(opening.includes(answer), `Missing opening answer: ${answer}`);
  assert.ok(
    opening.includes("data-open-artwork"),
    "The opening needs a dashboard preview",
  );
});

test("artwork has a real asset fallback and an accessible viewer", async () => {
  const artworkLinks = [...html.matchAll(/<a\b[^>]*data-open-artwork[^>]*>/g)];
  assert.equal(artworkLinks.length, 6);
  for (const [link] of artworkLinks) {
    const href = link.match(/href="([^"]+)"/)[1];
    await access(new URL(`.${href}`, root));
  }
  assert.match(html, /<dialog[^>]*aria-labelledby="artwork-title"/);
  assert.match(html, /<button[^>]*data-close-artwork/);
  for (const [, attributes] of html.matchAll(/<button\b([^>]*)>/g))
    assert.match(attributes, /class="[^"]*\baction\b/);
});

test("case study metadata uses the energy artwork", () => {
  assert.ok(html.includes('property="og:image:alt"'));
  assert.match(
    html,
    /property="og:image" content="[^"]*energy-meadow-1200\.webp"/,
  );
  assert.match(html, /rel="canonical" href="[^"]*\/works\/clean-energy\/"/);
});
