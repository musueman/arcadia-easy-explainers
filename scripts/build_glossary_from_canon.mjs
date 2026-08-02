import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GENERIC_NAMES = new Set([
  "항목", "내용", "기타", "없음", "미상", "전역", "공통", "기준", "현재",
  "도시", "마을", "국가", "권역", "종족", "언어", "문자", "달력", "사건",
  "명칭", "이름", "기능", "시설", "구조물", "생활 설명명", "정본 지명"
]);

const META_HEADER = /(?:^|[_\s·])(?:id|code|상태|비고|정합성|검산|금지선|응답|챗봇|메타|출처|근거|연결|목적|단계|누락감|플레이 노출|유통 형태|기록층|확정도)(?:$|[_\s·])/i;
const NAME_HEADER = /^(?:한글명|위성|현상|자연권|지형권|자원권|재해권|기후대|해류·수권|유역|생태구|정본 지명|가도·항로|종족(?:·집단)?|집단명|언어명|언어|언어층|문화권|층위|문자명|문자|달력명|달력|명절|절기|기념일|화폐명|단위명|사건명|현재갈등명|인물명|명칭|이름|국가·권역|권역명|도시명|도시|마을명|마을)$/;
const DESCRIPTION_PRIORITY = [
  "종류", "성격", "객관 성격", "특징", "기능", "핵심 기능", "생활 설명명",
  "표면·구조 특징", "비레스 효과", "주 사용권", "주 분포권", "현재 분포",
  "유형", "역할", "인물유형", "권한·직능", "핵심 행위", "핵심갈등", "5083 잔존영향",
  "현재기능", "갈등표면", "역사뿌리",
  "대표 통과점", "가까운 도시·구조물", "소속 권역", "관련권역", "지역"
];
const REGION_HEADERS = ["소속 권역", "소속권역", "관련권역", "갈등권역", "출신 권역", "주 사용권", "주 분포권", "현재 분포", "지역", "권역"];

function cleanCell(value = "") {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<br\s*\/?>/gi, " · ")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\\\|/g, "∣")
    .replace(/\s+/g, " ")
    .trim();
}

function splitRow(line) {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split(/(?<!\\)\|/).map(cell => cleanCell(cell.replace(/∣/g, "|")));
}

function isSeparator(line) {
  const cells = splitRow(line);
  return cells.length > 0 && cells.every(cell => /^:?-{3,}:?$/.test(cell.replace(/\s/g, "")));
}

function headingText(line) {
  const match = line.match(/^(#{2,4})\s+(.+?)\s*$/);
  return match ? { level: match[1].length, text: cleanCell(match[2]) } : null;
}

function sectionNumber(text) {
  const match = text.match(/^(\d+)(?:\.|\s)/);
  return match ? Number(match[1]) : null;
}

function chooseNameHeader(headers, context) {
  if (headers.includes("현재갈등명")) return "현재갈등명";
  if (headers.includes("사건명")) return "사건명";
  if (headers.includes("정본 지명")) return "정본 지명";
  if (headers.includes("한글명")) return "한글명";
  if (headers.includes("언어명")) return "언어명";
  if (headers.includes("문자명")) return "문자명";
  if (headers.includes("달력명")) return "달력명";
  if (headers.includes("화폐명")) return "화폐명";
  if (headers.includes("단위명")) return "단위명";
  if (headers.includes("인물명")) return "인물명";
  if (context.section === 13 && headers.includes("이름") && headers.some(header => /활동 시기|핵심 행위/.test(header))) return "이름";
  return headers.find(header => NAME_HEADER.test(header));
}

function classify(headers, context, nameHeader) {
  const joined = `${context.h2} ${context.h3} ${context.h4}`;
  const n = context.section;
  if (headers.includes("현재갈등명")) return "현재 갈등";
  if ((n === 12 || n === 13) && (nameHeader === "인물명" || (nameHeader === "이름" && headers.some(header => /활동\s*시기|핵심\s*행위/.test(header))))) return "역사 인물";
  if ((n === 12 || n === 13) && headers.some(header => /보관·권한대상|현재기능|기관 유형|유형/.test(header)) && nameHeader === "명칭") return "기관·문서";
  if (headers.includes("사건명") || /사건축|역사 사건|전쟁|재난/.test(joined)) return "역사·사건";
  if (n === 1) return "세계·천문";
  if (n === 2) return "지형·생활권";
  if (n === 4) return /국가·권역|권역명/.test(nameHeader) ? "국가·권역" : "도시·마을";
  if (n === 5) {
    if (nameHeader === "정본 지명" && (headers.includes("물리 구획") || headers.includes("가도·항로"))) return "지명·가도";
    return "도시·마을";
  }
  if (n === 6) return "종족·집단";
  if (n === 7) return "언어·문자";
  if (n === 8) return "달력·시간";
  if (n === 9) return "신앙·법";
  if (n === 10 && /화폐|도량형|가치|단위|물가/.test(joined)) return "화폐·단위";
  if (n === 10) return "기관·문서";
  if (n === 14) return "장소·생업";
  if (/언어|문자|기록어/.test(joined)) return "언어·문자";
  if (/달력|절기|명절|기념일/.test(joined)) return "달력·시간";
  if (/화폐|도량형|단위|물가/.test(joined)) return "화폐·단위";
  if (/신앙|법|율례|의례/.test(joined)) return "신앙·법";
  return null;
}

function validName(name) {
  if (!name || name.length < 2 || name.length > 80) return false;
  if (GENERIC_NAMES.has(name)) return false;
  if (/^(?:[A-Z]{1,8}[-_]?\d+|[A-Z]\d+|\d+(?:\.\d+)*|[-–—]+)$/i.test(name)) return false;
  if (/^(?:약\s*)?\d/.test(name)) return false;
  if (/[{}[\]<>]/.test(name)) return false;
  if (/(?:해야 한다|하지 않는다|금지|검산|보강 필요|TODO|FIXME)/i.test(name)) return false;
  return /[가-힣]/.test(name);
}

function makeDescription(record, headers, nameHeader, kind) {
  const candidates = [];
  for (const key of DESCRIPTION_PRIORITY) {
    const value = record[key];
    if (value && key !== nameHeader && !META_HEADER.test(key)) candidates.push(value);
  }
  for (const header of headers) {
    const value = record[header];
    if (!value || header === nameHeader || META_HEADER.test(header) || /(?:^|_)(?:id|code)(?:$|_)/i.test(header) || candidates.includes(value)) continue;
    if (/^(?:좌표|중심 좌표|지도 표기층|연도|시기|번호|순서)$/.test(header)) continue;
    candidates.push(value);
  }
  const unique = [...new Set(candidates)]
    .map(value => publicDescription(value))
    .filter(value => validDescription(value))
    .slice(0, 3);
  const fallback = `${kind}에 속하는 비레스의 고유명이다.`;
  return truncate(unique.join(". ").replace(/[.。]\s*\./g, ".") || fallback, 210);
}

function publicDescription(value) {
  return value
    .replace(/\b(?:HP|INST|CF|ARC(?:-L\d+)?|E)[-_]?\d+(?:[-_]\d+)*\b/gi, "")
    .replace(/\b(?:directtransition|culturaltransfer|recordamplified|institutionalresidue|mediumdependent|contested(?:succession)?|cumulativecluster|livedpressure|longtail|mythologized)\b/gi, "")
    .replace(/([이가]) 중요하다/g, "$1 자주 보인다")
    .replace(/\s*[,;]\s*(?=[,;.]|$)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s,;·.-]+|[\s,;·.-]+$/g, "");
}

function validDescription(value) {
  if (!value || value.length < 2) return false;
  if (/^[a-z][a-z0-9_-]*$/i.test(value)) return false;
  if (/^(?:[A-Z]{1,12}[-_]?\d+(?:[-_]\d+)*|\d+(?:[.,]\d+)*(?:\s*[~–-]\s*\d+)?)$/i.test(value)) return false;
  if (/(?:TODO|FIXME|보강 필요|검산|정합성경계|해야 한다|하지 않는다)/i.test(value)) return false;
  return true;
}

function truncate(value, limit) {
  if (value.length <= limit) return value.replace(/\s*[,;·]\s*$/, "");
  return `${value.slice(0, limit - 1).replace(/\s+\S*$/, "")}…`;
}

function inferRegion(record) {
  for (const key of REGION_HEADERS) {
    const value = record[key];
    if (value && value.length <= 80) return value;
  }
  return "비레스";
}

export function buildGlossaryEntries(markdown) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const context = { h2: "", h3: "", h4: "", section: null };
  const entries = [];
  const seen = new Set();

  const add = entry => {
    if (!validName(entry.name) || !entry.kind) return;
    const key = `${entry.kind}\u0000${entry.name}`;
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({
      name: entry.name,
      kind: entry.kind,
      region: entry.region || "비레스",
      description: entry.description
    });
  };

  for (let index = 0; index < lines.length; index += 1) {
    const heading = headingText(lines[index]);
    if (heading) {
      if (heading.level === 2) {
        context.h2 = heading.text;
        context.h3 = "";
        context.h4 = "";
        context.section = sectionNumber(heading.text);
      } else if (heading.level === 3) {
        context.h3 = heading.text;
        context.h4 = "";
      } else {
        context.h4 = heading.text;
      }
      continue;
    }

    if (!lines[index].trim().startsWith("|") || index + 1 >= lines.length || !isSeparator(lines[index + 1])) continue;

    const headers = splitRow(lines[index]);
    const nameHeader = chooseNameHeader(headers, context);
    const kind = nameHeader ? classify(headers, context, nameHeader) : null;
    index += 2;
    while (index < lines.length && lines[index].trim().startsWith("|")) {
      const cells = splitRow(lines[index]);
      const record = Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex] || ""]));
      if (kind && nameHeader) {
        add({
          name: record[nameHeader],
          kind,
          region: inferRegion(record),
          description: makeDescription(record, headers, nameHeader, kind)
        });
      }
      index += 1;
    }
    index -= 1;
  }

  return entries.sort((a, b) => a.kind.localeCompare(b.kind, "ko") || a.name.localeCompare(b.name, "ko"));
}

function writeDataFile(sourcePath, outputPath) {
  const markdown = fs.readFileSync(sourcePath, "utf8");
  const entries = buildGlossaryEntries(markdown);
  const stat = fs.statSync(sourcePath);
  const meta = {
    source: path.basename(sourcePath),
    sourceModified: stat.mtime.toISOString(),
    generatedAt: new Date().toISOString(),
    entryCount: entries.length
  };
  const content = [
    "/* Generated from the current Vireth integrated canon. Do not edit by hand. */",
    `window.VIRETH_CANON_GLOSSARY_META = ${JSON.stringify(meta, null, 2)};`,
    `window.VIRETH_CANON_GLOSSARY_ENTRIES = ${JSON.stringify(entries, null, 2)};`,
    ""
  ].join("\n");
  fs.writeFileSync(outputPath, content, "utf8");
  return { meta, entries };
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  const sourcePath = process.argv[2];
  const outputPath = process.argv[3] || path.resolve(process.cwd(), "glossary-canon-data.js");
  if (!sourcePath) {
    console.error("usage: node build_glossary_from_canon.mjs <canon.md> [output.js]");
    process.exit(2);
  }
  const { meta, entries } = writeDataFile(path.resolve(sourcePath), path.resolve(outputPath));
  const counts = Object.fromEntries(
    [...new Set(entries.map(entry => entry.kind))]
      .sort((a, b) => a.localeCompare(b, "ko"))
      .map(kind => [kind, entries.filter(entry => entry.kind === kind).length])
  );
  console.log(JSON.stringify({ ...meta, categories: counts }, null, 2));
}
