// Checks every translation against its product's English file. Runs on
// every pull request; a pull request can only be merged when it passes.
//
//   node scripts/check.mjs
//
// Errors: invalid JSON, keys that English doesn't have, a value of the wrong
// kind, an empty string, a placeholder like {days} missing or added, HTML.
// Missing keys are fine: the apps fall back to English for them.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const products = JSON.parse(readFileSync(join(root, "products.json"), "utf8"));
const PLACEHOLDER = /\{[a-zA-Z]+\}/g;
const HTML = /<\/?[a-z!][^>]*>/i;

let errors = 0;
let missing = 0;
const fail = (file, path, message) => {
  errors += 1;
  console.error(`${file} ${path || "(root)"}: ${message}`);
};

function compare(file, source, target, path) {
  for (const [key, value] of Object.entries(target)) {
    const here = path ? `${path}.${key}` : key;
    if (!(key in source)) {
      fail(file, here, "this key isn't in English. Remove it, or add it to English first.");
      continue;
    }
    const expected = source[key];
    if (typeof expected === "object" && expected !== null && !Array.isArray(expected)) {
      if (typeof value !== "object" || value === null || Array.isArray(value)) fail(file, here, "should be a group of keys, like in English.");
      else compare(file, expected, value, here);
      continue;
    }
    if (Array.isArray(expected)) {
      if (!Array.isArray(value) || value.length !== expected.length) fail(file, here, `should be a list of ${expected.length}, like in English.`);
      else value.forEach((item, i) => compare(file, { [i]: expected[i] }, { [i]: item }, here));
      continue;
    }
    if (typeof value !== "string") {
      fail(file, here, "should be text.");
      continue;
    }
    if (!value.trim()) fail(file, here, "is empty.");
    if (HTML.test(value)) fail(file, here, "contains HTML, which isn't allowed.");
    const want = (String(expected).match(PLACEHOLDER) ?? []).sort().join(" ");
    const have = (value.match(PLACEHOLDER) ?? []).sort().join(" ");
    if (want !== have) fail(file, here, `placeholders should be [${want}], found [${have}]. Keep them exactly as in English.`);
  }
  for (const key of Object.keys(source)) if (!(key in target)) missing += 1;
}

for (const product of Object.keys(products)) {
  const dir = join(root, product);
  const english = JSON.parse(readFileSync(join(dir, "en.json"), "utf8"));
  for (const name of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "en.json")) {
    const file = `${product}/${name}`;
    let data;
    try {
      data = JSON.parse(readFileSync(join(dir, name), "utf8"));
    } catch (error) {
      fail(file, "", `isn't valid JSON (${error.message}).`);
      continue;
    }
    compare(file, english, data, "");
  }
}

console.log(`${errors} error(s); ${missing} key(s) not translated yet (English is shown for those).`);
process.exit(errors > 0 ? 1 : 0);
