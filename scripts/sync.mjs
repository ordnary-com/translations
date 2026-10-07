// Brings each product's English text, and any new translations written in the
// product's own repository, into this repository. Runs every hour from
// .github/workflows/sync.yml, with the product repositories checked out under
// ./source/<owner>/<repo>.
//
// - English comes from the product: it's where new text is written.
// - Other languages: keys this repository doesn't have yet are taken from the
//   product (so translations written along with a feature aren't lost).
//   Keys it already has are never overwritten here: this repository is where
//   translations are improved.
// - Keys English no longer has are removed.

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const products = JSON.parse(readFileSync(join(root, "products.json"), "utf8"));
const read = (file) => JSON.parse(readFileSync(file, "utf8"));
const write = (file, data) => writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
const isGroup = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

/** `ours`, completed with what `theirs` has and `ours` lacks, limited to `shape`. */
function merge(shape, ours, theirs) {
  const out = {};
  for (const [key, english] of Object.entries(shape)) {
    const mine = ours?.[key];
    const other = theirs?.[key];
    if (isGroup(english)) {
      const merged = merge(english, isGroup(mine) ? mine : {}, isGroup(other) ? other : {});
      if (Object.keys(merged).length > 0) out[key] = merged;
    } else if (mine !== undefined) {
      out[key] = mine;
    } else if (other !== undefined) {
      out[key] = other;
    }
  }
  return out;
}

for (const [product, { repository, path }] of Object.entries(products)) {
  const sourceDir = join(root, "source", repository, path);
  if (!existsSync(sourceDir)) {
    console.warn(`${product}: ${repository} isn't checked out, skipped.`);
    continue;
  }
  const english = read(join(sourceDir, "en.json"));
  write(join(root, product, "en.json"), english);

  for (const name of readdirSync(sourceDir).filter((f) => f.endsWith(".json") && f !== "en.json")) {
    const target = join(root, product, name);
    const theirs = read(join(sourceDir, name));
    if (!isGroup(theirs) || !Object.keys(theirs).some((key) => key in english)) continue;
    const ours = existsSync(target) ? read(target) : {};
    write(target, merge(english, ours, theirs));
  }
  console.log(`${product}: synced from ${repository}/${path}.`);
}
