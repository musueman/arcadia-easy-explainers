import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "glossary.html"), "utf8");
const canonData = fs.readFileSync(path.join(root, "glossary-canon-data.js"), "utf8");

function createButton(category) {
  const listeners = new Map();
  return {
    dataset: { category },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    click() {
      listeners.get("click")?.({ type: "click" });
    }
  };
}

function createElement(id) {
  const listeners = new Map();
  let innerHTML = "";
  let buttons = [];
  return {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    dispatch(type) {
      listeners.get(type)?.({ type, target: this });
    },
    get innerHTML() {
      return innerHTML;
    },
    set innerHTML(value) {
      innerHTML = value;
      if (id === "glossaryFilters") {
        buttons = [...value.matchAll(/data-category="([^"]+)"/g)]
          .map(match => createButton(match[1]));
      }
    },
    querySelectorAll(selector) {
      return selector === "button" ? buttons : [];
    },
    textContent: "",
    value: ""
  };
}

function loadGlossaryPage(canonEntriesOverride) {
  const elements = new Map();
  const context = {
    document: {
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, createElement(id));
        return elements.get(id);
      }
    },
    window: { addEventListener() {} }
  };
  context.window.window = context.window;
  vm.createContext(context);
  vm.runInContext(canonData, context);
  if (canonEntriesOverride) context.window.VIRETH_CANON_GLOSSARY_ENTRIES = canonEntriesOverride;

  const inlineScript = html.match(/<script>\s*([\s\S]*?)\s*<\/script>\s*<\/body>/)?.[1];
  assert.ok(inlineScript, "glossary inline script must exist");
  vm.runInContext(`${inlineScript}\nglobalThis.__glossaryPage = { categories, mergedGlossary };`, context);
  return {
    canonEntries: context.window.VIRETH_CANON_GLOSSARY_ENTRIES,
    categories: context.__glossaryPage.categories,
    elements,
    mergedGlossary: context.__glossaryPage.mergedGlossary
  };
}

const page = loadGlossaryPage();
const findEntry = (entries, name, kind) => entries.find(entry => entry.name === name && entry.kind === kind);
const search = page.elements.get("glossarySearch");
const filters = page.elements.get("glossaryFilters");
const results = page.elements.get("glossaryResults");
const count = page.elements.get("glossaryCount");

const manualRadbarhal = findEntry(page.mergedGlossary, "라드바르할", "도시·마을");
assert.equal(
  manualRadbarhal?.description,
  "실버킵 왕실권의 성채 수도로, 왕실 법정과 영지 문서, 신전 봉납이 모인다."
);
const collisionDescription = "테스트 정본 설명: 왕실 법정의 새 판결 기록이 보관된다.";
const collisionPage = loadGlossaryPage([
  ...page.canonEntries,
  {
    name: "라드바르할",
    kind: "도시·마을",
    region: "티리스",
    description: collisionDescription
  }
]);
assert.equal(
  findEntry(collisionPage.mergedGlossary, "라드바르할", "도시·마을")?.description,
  collisionDescription,
  "canonical same-name and same-kind entries must override manual entries"
);

for (const name of ["티리스", "레오니아", "센할레트"]) {
  assert.ok(findEntry(page.mergedGlossary, name, "국가·권역"), `${name} country entry must survive the merge`);
  assert.ok(findEntry(page.mergedGlossary, name, "화폐·단위"), `${name} currency/unit entry must survive the merge`);
}
assert.ok(page.categories.includes("국가·권역"), "country category must remain filterable");

search.value = "__no_such_glossary_entry__";
search.dispatch("input");
assert.equal(count.textContent, "0개 이름", "search input listener must update the result count");
assert.match(results.innerHTML, /일치하는 이름이 없다/);

search.value = "티리스";
search.dispatch("input");
assert.match(results.innerHTML, /<span class="term-kind">국가·권역<\/span>\s*<h3>티리스<\/h3>/);
assert.match(results.innerHTML, /<span class="term-kind">화폐·단위<\/span>\s*<h3>티리스<\/h3>/);

const countryFilter = filters.querySelectorAll("button").find(button => button.dataset.category === "국가·권역");
assert.ok(countryFilter, "country filter button must render");
countryFilter.click();
assert.equal(count.textContent, "1개 이름", "country filter click must reduce 티리스 results to its country entry");
assert.match(results.innerHTML, /<span class="term-kind">국가·권역<\/span>\s*<h3>티리스<\/h3>/);
assert.doesNotMatch(results.innerHTML, /<span class="term-kind">화폐·단위<\/span>/);

const allFilter = filters.querySelectorAll("button").find(button => button.dataset.category === "전체");
assert.ok(allFilter, "all filter button must remain available after rerender");
allFilter.click();
assert.match(results.innerHTML, /<span class="term-kind">화폐·단위<\/span>\s*<h3>티리스<\/h3>/);

for (const [name, description] of [
  ["라드바르할", "실버킵 왕실권의 성채 수도로, 왕실 법정과 영지 문서, 신전 봉납이 모인다."],
  ["베크켈카르", "서부 접경의 성문도시로, 검문과 피난민 분류, 병참, 접경 법정이 얽힌다."]
]) {
  assert.equal(findEntry(page.mergedGlossary, name, "도시·마을")?.description, description);
  assert.doesNotMatch(description, /수도 또는 중심 거점|도시 또는 지역 거점/);
}
assert.equal(
  page.mergedGlossary.filter(entry => /수도 또는 중심 거점|도시 또는 지역 거점/.test(entry.description)).length,
  0,
  "generic city fallback descriptions must not be publicly reachable"
);

console.log(`glossary page tests passed (${page.mergedGlossary.length} merged entries)`);
