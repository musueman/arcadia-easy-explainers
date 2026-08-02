import assert from "node:assert/strict";
import { buildGlossaryEntries } from "./build_glossary_from_canon.mjs";

const sample = `
## 4. 국가·권역
| 국가·권역 | 분류 | 통치·제도 |
|---|---|---|
| 레오니아 | 중앙집권 왕국 | 왕권, 기사단, 서임문 |

## 5. 도시·마을·시설 DB
### 5.6 이름 있는 지역·가도·마을·구조물

| 물리 구획 | 정본 지명 | 생활 설명명 | 중심 좌표 | 지도 표기층 |
|---|---|---|---|---|
| 북부 협곡 | 라드가르에트 | 붉은 협곡 | 10, 20 | 지역 |
| 남방 사원길 | 실소르켈 | 성림 접촉로 | 66, 74 | 가도 |

| 정본 지명 | 생활 설명명 | 유형 | 좌표 | 소속 권역 | 가까운 도시·구조물 | 기능 |
|---|---|---|---|---|---|---|
| 라드가르가 | 붉은 협곡 마을 | 봉토 마을 | 11, 21 | 레오니아 | 라드아르할 | 곡물 집산 |
| 실소르켈 | 성림 접촉 도시 | 숲 경계 도시 | 66, 74 | 실니메트 | 도르소르산 | 의례 통역 |

| 층위 | 내용 |
|---|---|
| 수도·중심도시 | 라드아르할 |
| 대표도시 | 지르바르에트 |
| 지역 도시·거점 | 붉은 협곡 마을 |
| 도시 성격 | 기사 봉토와 군사 후원망의 중심이다 |
| 도시망 규모 | 대도시 하나와 외곽 마을 셋 |
| 중심도시 설계 | 궁정 언덕과 서임 광장이 층을 이룬다 |
| 대표도시 설계 | 기사단 마구간과 훈련장이 모인다 |
| 지역·외곽도시 설계 | 성문 밖 농경지가 이어진다 |
| 하위 정착지·구역 | 강변 작업촌 |
| 기본 공공시설 | 우물과 숙소 |
| 추가 도시층 | 외곽 장터 |

## 7. 언어·문자·기록
| 언어명 | 주 사용권 | 특징 |
|---|---|---|
| 라드어 | 레오니아 | 궁정과 봉토 장부에서는 납품 인장이 중요하다 |

### 7.1 언어층

| 층위 | 쓰임 | 예시 |
|---|---|---|
| 생활어 | 마을, 가문, 장터, 항구에서 말하는 일상어 | 티리스 농경어 |
| 권역 공용어 | 국가와 권역 안의 행정·교역 언어 | 레오니아 궁정어 |
| 공용서기어 | 조약, 지도, 세금 장부의 공통 표기층 | 서로 다른 지역명을 대조한다 |
| 종족어 | 종족·가문·길드가 보존한 말 | 철맥계 각문어 |
| 전승 외명 | 고문서와 항해담에 남은 이름 | 실바니아 전승명 |

### 7.6 문해력과 기록 접근

| 층위 | 읽을 수 있는 것 | 접근 가능한 정보 | 한계 |
|---|---|---|---|
| 비문해 생활층 | 표식, 색, 문장 | 장터 위치와 창고 줄 | 장부 내용을 남에게 들어야 한다 |
| 생활 문해 | 이름패, 목패, 단순 장부 | 세금, 배급, 노동일 | 조약문과 학술 주석은 어렵다 |
| 전문 서기 문해 | 조약, 판결 요약, 공용서기어 | 판결문과 항만세 장부 | 현장 생활어를 놓칠 수 있다 |
| 학술·신전 문해 | 관측표, 의례문, 주석서 | 신전 해석과 학술 논쟁 | 민간 경험을 낮게 볼 수 있다 |

## 9. 신앙·의례·법
| 국가·권역 | 주 신앙·권위 | 사법·관할 | 생활에 닿는 방식 |
|---|---|---|---|
| 레오니아 | 용 상징과 기사 서약 | 신성 법정과 궁정 법 | 추천장과 서임문 확인 |

## 10. 화폐·도량형·생활경제
| 국가·권역 | 회계 기반 | 가치 매체 | 대표 비용 표면 |
|---|---|---|---|
| 레오니아 | 왕실 은전과 금표 | 은량과 궁정 납품표 | 납품 검수와 사절 숙소비 |

## 13. 장기역사 사건축·현재갈등 상세 DB
| code | 이름 | 활동 시기 | 출신 권역 | 핵심 행위 |
|---|---|---|---|---|
| HP001 | 라우벤 세르쿰 | 4020년대 | 노르가르드 | 항만 장부를 통합했다 |

| conflict_id | 현재갈등명 | 갈등권역 | 역사뿌리 | 갈등표면 |
|---|---|---|---|---|
| CF5083-001 | 센푸쿰 배급 기준 재판 | 센할레트 | 수문 배급 개정 | 배급 순서 이의 |

| event_id | 사건명 | event_type | 관련 인물 | 결과 |
|---|---|---|---|---|
| E0018 | 첫창고 기준 확정 | directtransition | HP001 라우벤 세르쿰 | 배급 명부가 남았다 |
`;

const entries = buildGlossaryEntries(sample);
const byName = new Map(entries.map(entry => [entry.name, entry]));
const findEntries = name => entries.filter(entry => entry.name === name);

assert.equal(byName.get("라드가르에트")?.kind, "지명·가도");
assert.equal(byName.get("라드가르가")?.kind, "도시·마을");
assert.match(
  byName.get("라드가르가")?.description ?? "",
  /봉토 마을|곡물 집산/
);
assert.ok(
  !/주요 도시 또는 지역 거점이다/.test(
    byName.get("라드가르가")?.description ?? ""
  )
);
assert.equal(byName.get("라드어")?.kind, "언어·문자");
assert.equal(byName.get("라우벤 세르쿰")?.kind, "역사 인물");
assert.equal(byName.get("센푸쿰 배급 기준 재판")?.kind, "현재 갈등");
assert.equal(byName.get("첫창고 기준 확정")?.kind, "역사·사건");
assert.ok(entries.every(entry => !/HP001|CF5083-001|E0018|directtransition/.test(entry.description)));
assert.match(byName.get("라드어")?.description || "", /납품 인장이 중요하다/);
for (const tierName of [
  "생활어", "권역 공용어", "공용서기어", "종족어", "전승 외명",
  "비문해 생활층", "생활 문해", "전문 서기 문해", "학술·신전 문해"
]) {
  assert.equal(
    byName.get(tierName)?.kind,
    "언어·문자",
    `${tierName} is a legitimate tier glossary entity`
  );
}
assert.match(byName.get("공용서기어")?.description ?? "", /조약|세금 장부/);
assert.match(byName.get("생활 문해")?.description ?? "", /이름패|배급/);
assert.deepEqual(
  findEntries("실소르켈").map(entry => entry.kind).sort((a, b) => a.localeCompare(b, "ko")),
  ["도시·마을", "지명·가도"].sort((a, b) => a.localeCompare(b, "ko")),
  "a canonically named city and route may retain distinct semantic entities"
);

for (const structuralLabel of [
  "수도·중심도시", "대표도시", "지역 도시·거점", "도시 성격", "도시망 규모",
  "중심도시 설계", "대표도시 설계", "지역·외곽도시 설계",
  "하위 정착지·구역", "기본 공공시설", "추가 도시층"
]) {
  assert.equal(
    findEntries(structuralLabel).length,
    0,
    `${structuralLabel} is a table facet, not a glossary entity`
  );
}

const leoniaEntries = findEntries("레오니아");
assert.deepEqual(
  leoniaEntries.map(entry => entry.kind),
  ["국가·권역"],
  "a known region name must not become a currency or law entity"
);
assert.match(leoniaEntries[0].description, /중앙집권 왕국/);
assert.match(leoniaEntries[0].description, /용 상징|궁정 법/);
assert.match(leoniaEntries[0].description, /금표|궁정 납품표/);

console.log(`glossary builder tests passed (${entries.length} entries)`);
