import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const html = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const root = new URL("../dist/", import.meta.url);

test("homepage content is delivered as HTML, including all migrated projects and roles", () => {
  for (const content of [
    "Hassan Mushtaq",
    "Making space",
    "Mycah.",
    "Meows Untold.",
    "NASTP Delta",
    "Vertex IT Systems",
    "Shufti",
    "Datum Brain",
  ]) {
    assert.ok(html.includes(content), `Missing rendered content: ${content}`);
  }
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/class="project reveal"/g) || []).length, 3);
  assert.equal((html.match(/class="experience-row reveal"/g) || []).length, 4);
});

test("every local navigation target exists and IDs are unique", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, target] of html.matchAll(/href="(?:\/)?#([^"]+)"/g))
    assert.ok(ids.includes(target), `Broken target: ${target}`);
});

test("built images, fonts, scripts, stylesheets, and resume resolve locally", async () => {
  const paths = new Set(
    [...html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)].map((match) => match[1]),
  );
  for (const path of paths) await access(new URL(`.${path}`, root));
  for (const path of paths) {
    if (!path.endsWith(".css")) continue;
    const css = await readFile(new URL(`.${path}`, root), "utf8");
    for (const [, asset] of css.matchAll(
      /url\(["']?(\/assets\/[^)'"\s]+)["']?\)/g,
    ))
      await access(new URL(`.${asset}`, root));
  }
});

test("project destinations remain the original published case studies", () => {
  const baseline = readFile(
    new URL("../research/prototype-v1/index.html", import.meta.url),
    "utf8",
  );
  return baseline.then((source) => {
    const destinations = (value) =>
      [
        ...new Set(
          [
            ...value.matchAll(
              /href="(https:\/\/www\.behance\.net\/gallery\/[^"\s]+)"/g,
            ),
          ].map((match) => match[1]),
        ),
      ].sort();
    assert.deepEqual(destinations(html), destinations(source));
  });
});

test("all rendered buttons use the shared Action component", () => {
  const buttons = [...html.matchAll(/<button\b([^>]*)>/g)];
  assert.equal(buttons.length, 3);
  for (const [, attributes] of buttons) {
    assert.match(attributes, /class="[^"]*\baction\b/);
    assert.match(attributes, /data-appearance="/);
  }
  assert.equal((html.match(/data-appearance="media"/g) || []).length, 3);
  const interactiveStack = [];
  for (const [, closing, tag] of html.matchAll(/<(\/)?(a|button)\b[^>]*>/g)) {
    if (closing) assert.equal(interactiveStack.pop(), tag);
    else {
      assert.equal(interactiveStack.length, 0, "Nested interactive control");
      interactiveStack.push(tag);
    }
  }
});

test("action palettes retain readable text and icon contrast", async () => {
  const css = await readFile(
    new URL("../src/styles/tokens.css", import.meta.url),
    "utf8",
  );
  const rgb = (name) => {
    const hex = css.match(new RegExp(name + ":\\s*#([0-9a-f]{6})", "i"))[1];
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  };
  const luminance = (color) =>
    color
      .map((value) => {
        const channel = value / 255;
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      })
      .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
  const contrast = (a, b) =>
    (Math.max(luminance(a), luminance(b)) + 0.05) /
    (Math.min(luminance(a), luminance(b)) + 0.05);
  assert.ok(contrast(rgb("--color-accent"), [255, 255, 255]) >= 4.5);
  assert.ok(
    contrast(
      rgb("--color-action-on-dark"),
      rgb("--color-action-dark-surface"),
    ) >= 4.5,
  );
});
