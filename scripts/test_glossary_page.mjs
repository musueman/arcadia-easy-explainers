import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "glossary.html"), "utf8");
const canonData = fs.readFileSync(path.join(root, "glossary-canon-data.js"), "utf8");

function createElement() {
  return {
    addEventListener() {},
    innerHTML: "",
    querySelectorAll() { return []; },
    textContent: "",
    value: ""
  };
}

function loadGlossaryPage() {
  const elements = new Map();
  const context = {
    document: {
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, createElement());
        return elements.get(id);
      }
    },
    window: { addEventListener() {} }
  };
  context.window.window = context.window;
  vm.createContext(context);
  vm.runInContext(canonData, context);

  const inlineScript = html.match(/<script>\s*([\s\S]*?)\s*<\/script>\s*<\/body>/)?.[1];
  assert.ok(inlineScript, "glossary inline script must exist");
  vm.runInContext(`${inlineScript}\nglobalThis.__glossaryPage = { categories, mergedGlossary };`, context);
  return { canonEntries: context.window.VIRETH_CANON_GLOSSARY_ENTRIES, ...context.__glossaryPage };
}

const { canonEntries, categories, mergedGlossary } = loadGlossaryPage();
const findEntry = (name, kind) => mergedGlossary.find(entry => entry.name === name && entry.kind === kind);

const canonRadgarga = canonEntries.find(entry => entry.name === "라드가르가" && entry.kind === "도시·마을");
assert.ok(canonRadgarga, "canonical 라드가르가 city entry must exist");
assert.equal(findEntry("라드가르가", "도시·마을")?.description, canonRadgarga.description);

for (const name of ["티리스", "레오니아", "센할레트"]) {
  assert.ok(findEntry(name, "국가·권역"), `${name} country entry must survive the merge`);
  assert.ok(findEntry(name, "화폐·단위"), `${name} currency/unit entry must survive the merge`);
}
assert.ok(categories.includes("국가·권역"), "country category must remain filterable");

assert.equal(
  findEntry("라드바르할", "도시·마을")?.description,
  "실버킵 왕실권의 성채 수도로, 왕실 법정과 영지 문서, 신전 봉납이 모인다."
);
assert.equal(
  findEntry("베크켈카르", "도시·마을")?.description,
  "서부 접경의 성문도시로, 검문과 피난민 분류, 병참, 접경 법정이 얽힌다."
);
for (const name of ["라드바르할", "베크켈카르"]) {
  assert.doesNotMatch(
    findEntry(name, "도시·마을")?.description ?? "",
    /수도 또는 중심 거점|도시 또는 지역 거점/
  );
}
assert.equal(
  mergedGlossary.filter(entry => /수도 또는 중심 거점|도시 또는 지역 거점/.test(entry.description)).length,
  0,
  "generic city fallback descriptions must not be publicly reachable"
);

console.log(`glossary page tests passed (${mergedGlossary.length} merged entries)`);
