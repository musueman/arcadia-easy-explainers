import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const regionVisualsSource = html.match(/const regionVisuals = (\{[\s\S]*?\});\s*const readerSections/)?.[1];

assert.ok(regionVisualsSource, "region visuals data must be present");
const regionVisuals = vm.runInNewContext(`(${regionVisualsSource})`);
const visuals = Object.values(regionVisuals);

assert.equal(visuals.length, 20, "all 20 regions need a representative detail image");

let cleanCapitalCount = 0;
let captionFallbackCount = 0;
for (const visual of visuals) {
  assert.equal(typeof visual.capitalHasBakedCaption, "boolean", "capital caption fallback must be explicit");
  assert.ok(fs.existsSync(path.join(root, visual.capital.replace(/^\.\//, ""))), `missing capital image: ${visual.capital}`);

  if (visual.capitalHasBakedCaption) {
    captionFallbackCount += 1;
    assert.match(visual.capital, /-labeled\.webp$/, "caption fallback must retain its audited labeled source");
  } else {
    cleanCapitalCount += 1;
    assert.match(visual.capital, /\/single_slides\//, "clean capital source must use an unlabeled still");
    assert.doesNotMatch(visual.capital, /labeled/, "clean capital source must not contain baked label artwork");
  }
}

assert.equal(cleanCapitalCount, 10, "all available exact clean capital stills must be used");
assert.equal(captionFallbackCount, 10, "only regions without clean capital stills may use a caption fallback");
assert.match(html, /class="region-index-panel"/, "region index status must share a dedicated layout panel");
const regionIndexStatusRule = html.match(/\.region-index-status\s*\{([^}]*)\}/)?.[1];
assert.ok(regionIndexStatusRule, "region index status rule must be present");
assert.match(regionIndexStatusRule, /margin-top:\s*10px/, "region index status needs visible top spacing");
assert.match(regionIndexStatusRule, /min-height:\s*20px/, "region index status needs reserved visible height");
assert.match(html, /\.region-article-image-button img\.has-baked-caption\s*\{/, "caption fallback needs an explicit crop treatment");

console.log(`region visual contract passed (clean=${cleanCapitalCount} fallback=${captionFallbackCount})`);
