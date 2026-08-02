import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = process.env.REGION_VISUAL_HTML || path.join(root, "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const regionVisualsSource = html.match(/const regionVisuals = (\{[\s\S]*?\});\s*const readerSections/)?.[1];

const expectedCapitalSources = {
  "레오니아": "./viewer/assets/illustrations/single_slides/leonia-radarhal.jpg",
  "노르가르드": "./viewer/assets/illustrations/single_slides/norghard-marnabmir.jpg",
  "티리스": "./viewer/assets/illustrations/generated_outputs/city_vistas/ck5083-city-tiris-radbarhal-imagegen-v1-2560-labeled.webp",
  "린레네트": "./viewer/assets/illustrations/single_slides/linrenet-renumga.jpg",
  "벡도레트": "./viewer/assets/illustrations/single_slides/bekdoret-dorkar.jpg",
  "센할레트": "./viewer/assets/illustrations/single_slides/senhalet-senpukum.jpg",
  "헤스페레트": "./viewer/assets/illustrations/generated_outputs/city_vistas/ck5083-city-hesferet-hespukum-imagegen-v1-2560-labeled.webp",
  "켈나베트": "./viewer/assets/illustrations/single_slides/kelnabet-markelmir.jpg",
  "헤스베케트": "./viewer/assets/illustrations/single_slides/hesbeket-bekhespukum.jpg",
  "옌메베트": "./viewer/assets/illustrations/generated_outputs/city_vistas/ck5083-city-yenmebet-yenwokel-imagegen-v1-2560-labeled.webp",
  "님나레트": "./viewer/assets/illustrations/generated_outputs/city_vistas/ck5083-city-nimnaret-yalbekum-imagegen-v1-2560-labeled.webp",
  "실니메트": "./viewer/assets/illustrations/generated_outputs/city_vistas/ck5083-city-silnimet-dorsorsan-imagegen-v1-2560-labeled.webp",
  "아르도레트": "./viewer/assets/illustrations/generated_outputs/city_vistas/ck5083-city-ardolet-dorsorhal-imagegen-v1-2560-labeled.webp",
  "가르메베트": "./viewer/assets/illustrations/generated_outputs/city_vistas/ck5083-city-garmebet-tikmebhal-imagegen-v1-2560-labeled.webp",
  "실할레트": "./viewer/assets/illustrations/generated_outputs/city_vistas/ck5083-city-silhalet-silsorsan-imagegen-v1-2560-labeled.webp",
  "메르할레트": "./viewer/assets/illustrations/generated_outputs/city_vistas/ck5083-city-merhalet-merbelmar-imagegen-v1-2560-labeled.webp",
  "님소레트": "./viewer/assets/illustrations/generated_outputs/city_vistas/ck5083-city-nimsolet-nimhal-imagegen-v1-2560-labeled.webp",
  "실바니아": "./viewer/assets/illustrations/single_slides/sylvania-silensan.jpg",
  "드래곤스파이어": "./viewer/assets/illustrations/single_slides/dragonspire-narmarkel.jpg",
  "펜리르의 눈": "./viewer/assets/illustrations/single_slides/fenrir-eye-dunartore.jpg"
};

const expectedCleanRegions = [
  "레오니아", "노르가르드", "린레네트", "벡도레트", "센할레트",
  "켈나베트", "헤스베케트", "실바니아", "드래곤스파이어", "펜리르의 눈"
];
const expectedFallbackRegions = [
  "티리스", "헤스페레트", "옌메베트", "님나레트", "실니메트",
  "아르도레트", "가르메베트", "실할레트", "메르할레트", "님소레트"
];
const knownBakedLabelBandStart = 0.82;

assert.ok(regionVisualsSource, "region visuals data must be present");
const regionVisuals = JSON.parse(JSON.stringify(vm.runInNewContext(`(${regionVisualsSource})`)));

assert.deepEqual(Object.keys(regionVisuals), Object.keys(expectedCapitalSources), "region order and the exact 20-region visual contract must remain stable");
assert.deepEqual(
  Object.fromEntries(Object.entries(regionVisuals).map(([region, visual]) => [region, visual.capital])),
  expectedCapitalSources,
  "every region must retain its audited capital source"
);

const actualCleanRegions = [];
const actualFallbackRegions = [];
for (const [region, visual] of Object.entries(regionVisuals)) {
  assert.equal(typeof visual.capitalHasBakedCaption, "boolean", `${region} must explicitly classify its capital source`);
  assert.ok(fs.existsSync(path.join(root, visual.capital.replace(/^\.\//, ""))), `${region} capital image must exist: ${visual.capital}`);

  if (visual.capitalHasBakedCaption) {
    actualFallbackRegions.push(region);
    assert.match(visual.capital, /-labeled\.webp$/, `${region} fallback must retain its audited labeled source`);
  } else {
    actualCleanRegions.push(region);
    assert.match(visual.capital, /\/single_slides\//, `${region} clean source must use an unlabeled still`);
    assert.doesNotMatch(visual.capital, /labeled/, `${region} clean source must not contain baked label artwork`);
  }
}

assert.deepEqual(actualCleanRegions, expectedCleanRegions, "the exact ten clean regions must remain clean");
assert.deepEqual(actualFallbackRegions, expectedFallbackRegions, "the exact ten fallback regions must remain explicit");
assert.equal(actualCleanRegions.length, 10, "there must be exactly ten clean capital stills");
assert.equal(actualFallbackRegions.length, 10, "there must be exactly ten caption fallbacks");

const cssRule = selector => html.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1];
const heroRule = cssRule(".region-article-hero");
const fallbackRule = cssRule(".region-article-image-button img.has-baked-caption");

assert.match(html, /class="region-index-panel"/, "region index status must share a dedicated layout panel");
const regionIndexStatusRule = cssRule(".region-index-status");
assert.ok(regionIndexStatusRule, "region index status rule must be present");
assert.match(regionIndexStatusRule, /margin-top:\s*10px/, "region index status needs visible top spacing");
assert.match(regionIndexStatusRule, /min-height:\s*20px/, "region index status needs reserved visible height");

assert.ok(heroRule?.trim(), "region-capital media container rule must not be empty");
assert.match(heroRule, /overflow:\s*hidden/, "region-capital media must clip transformed fallback artwork");
assert.ok(fallbackRule?.trim(), "caption fallback crop rule must not be empty");
const scaleMatch = fallbackRule.match(/transform:\s*scale\(\s*([0-9.]+)\s*\)/);
assert.ok(scaleMatch, "caption fallback crop must use a numeric scale transform");
const fallbackScale = Number(scaleMatch[1]);
assert.ok(Number.isFinite(fallbackScale), "caption fallback crop scale must be finite");
assert.ok(fallbackScale >= 1 / knownBakedLabelBandStart, "caption fallback scale must crop before the known bottom label band");
assert.match(fallbackRule, /transform-origin:\s*center\s+top/, "caption fallback crop must anchor at the top");
assert.match(fallbackRule, /object-position:\s*center\s+top/, "caption fallback image positioning must anchor at the top");
const visibleSourceBottom = 1 / fallbackScale;
assert.ok(visibleSourceBottom <= knownBakedLabelBandStart, "fallback crop geometry must exclude the known bottom label band");

console.log(`region visual contract passed (clean=${actualCleanRegions.length} fallback=${actualFallbackRegions.length} scale=${fallbackScale} visibleBottom=${visibleSourceBottom.toFixed(3)})`);
