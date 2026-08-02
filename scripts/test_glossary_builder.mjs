import assert from "node:assert/strict";
import { buildGlossaryEntries } from "./build_glossary_from_canon.mjs";

const sample = `
## 5. 도시·마을·시설 DB
### 5.6 이름 있는 지역·가도·마을·구조물

| 물리 구획 | 정본 지명 | 생활 설명명 | 중심 좌표 | 지도 표기층 |
|---|---|---|---|---|
| 북부 협곡 | 라드가르에트 | 붉은 협곡 | 10, 20 | 지역 |

| 정본 지명 | 생활 설명명 | 유형 | 좌표 | 소속 권역 | 가까운 도시·구조물 | 기능 |
|---|---|---|---|---|---|---|
| 라드가르가 | 붉은 협곡 마을 | 봉토 마을 | 11, 21 | 레오니아 | 라드아르할 | 곡물 집산 |

## 7. 언어·문자·기록
| 언어명 | 주 사용권 | 특징 |
|---|---|---|
| 라드어 | 레오니아 | 궁정과 봉토 장부에서는 납품 인장이 중요하다 |

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

assert.equal(byName.get("라드가르에트")?.kind, "지명·가도");
assert.equal(byName.get("라드가르가")?.kind, "도시·마을");
assert.equal(byName.get("라드어")?.kind, "언어·문자");
assert.equal(byName.get("라우벤 세르쿰")?.kind, "역사 인물");
assert.equal(byName.get("센푸쿰 배급 기준 재판")?.kind, "현재 갈등");
assert.equal(byName.get("첫창고 기준 확정")?.kind, "역사·사건");
assert.ok(entries.every(entry => !/HP001|CF5083-001|E0018|directtransition/.test(entry.description)));
assert.match(byName.get("라드어")?.description || "", /납품 인장이 중요하다/);

console.log(`glossary builder tests passed (${entries.length} entries)`);
