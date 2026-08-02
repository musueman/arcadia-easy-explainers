# 비레스 공개 안내 혼합형 문체 개편 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 비레스 공개 홈페이지의 모든 안내 문구를 분위기 있는 제목과 구체적인 현대 생활어 본문으로 개편하면서, 최신 세계관 정보와 수치를 보존한다.

**Architecture:** 현재 정적 HTML, CSS, 바닐라 JavaScript 구조를 유지한다. `index.html`의 권역 데이터와 여섯 개 세계 안내 장을 섹션별로 교정하고, `glossary.html`에서는 최신 통합본으로 생성한 상세 설명이 수동 일반 설명보다 우선하도록 병합 순서를 고친다. 문체 회귀는 별도 PowerShell 검증 스크립트로 차단한다.

**Tech Stack:** 정적 HTML, CSS, 바닐라 JavaScript, PowerShell 검증, Node.js 고유명사 생성기, GitHub Pages

## Global Constraints

- 최신 내용 원천은 `D:/OneDrive/444_비레스/00_최신본`이다.
- 공개 문체는 제목·도입의 판타지 여행기 분위기와 본문의 현대 생활어 서술형 다체를 혼합한다.
- 설정의 고유명사, 수치, 환산값, 도시·시설명은 축약하지 않는다.
- 20개 권역은 같은 정보 밀도를 유지한다.
- 공개 화면에 `객관정보`, `정본`, `DB`, `검산`, `운용부록`, `실투입본`을 노출하지 않는다.
- 사용자 승인 없이 `viewer/Arcadia_비레스_세계관_DB_최종통합본_v1.md`와 `viewer/assets/maps/`의 미추적 파일을 추가하거나 수정하지 않는다.
- 기존 세로 웹툰의 원본 비율과 렌·듀란 누끼 이미지 배치를 보존한다.

---

## File Map

- Modify: `index.html`
  - 첫 화면, 권역 카드·상세, 세계 알아보기, 시작 장면, 갤러리의 공개 문구를 담당한다.
- Modify: `glossary.html`
  - 고유명사 검색 UI와 수동 기본 항목의 병합 우선순위를 담당한다.
- Modify: `scripts/validate_public_site.ps1`
  - 기존 구조, 자산, 권역 수, 접근성 검증을 유지하고 새 문체 검증을 호출한다.
- Create: `scripts/validate_public_copy.ps1`
  - 금칙 표현, 일반 설명, 제작 상태 문구, 필수 구체 정보의 회귀를 검증한다.
- Test: `scripts/test_glossary_builder.mjs`
  - 최신 통합본에서 생성된 상세 항목의 분류와 설명 보존을 검증한다.

---

### Task 1: 문체 회귀 검증 추가

**Files:**
- Create: `scripts/validate_public_copy.ps1`
- Modify: `scripts/validate_public_site.ps1`

**Interfaces:**
- Consumes: `index.html`, `glossary.html`
- Produces: 문체 금칙 표현과 필수 공개 정보 누락을 실패로 반환하는 PowerShell 검증

- [ ] **Step 1: 실패 검증 스크립트 작성**

`scripts/validate_public_copy.ps1`에 다음 검사를 구현한다.

```powershell
param(
    [string]$IndexPath = (Join-Path $PSScriptRoot '..\index.html'),
    [string]$GlossaryPath = (Join-Path $PSScriptRoot '..\glossary.html')
)

$index = Get-Content -Raw -LiteralPath $IndexPath -Encoding UTF8
$glossary = Get-Content -Raw -LiteralPath $GlossaryPath -Encoding UTF8
$failures = [System.Collections.Generic.List[string]]::new()

$forbiddenPatterns = @{
    '추상 표현: 중요하다' = '중요하다'
    '추상 표현: 힘을 가진다' = '힘을 가진다'
    '추상 표현: 길을 연다' = '길을 연다'
    '추상 표현: 사람을 가른다' = '사람을 가른다'
    '일반 도시 설명' = '(수도 또는 중심 거점이다|주요 도시 또는 지역 거점이다)'
    '제작 상태 문구' = '(웹툰이 더해지기 전까지|자료를 모았다|감을 잡게 하는 자료)'
}

foreach ($entry in $forbiddenPatterns.GetEnumerator()) {
    if (($index + "`n" + $glossary) -match $entry.Value) {
        $failures.Add($entry.Key)
    }
}

foreach ($term in @('금표', '20 은량', '동각', '1/12 은량', '비레스년', '660')) {
    if ($index -notmatch [regex]::Escape($term)) {
        $failures.Add("필수 구체 정보 누락: $term")
    }
}

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Host "ERROR: $_" -ForegroundColor Red }
    exit 1
}

Write-Output 'PUBLIC_COPY_VALIDATION_OK'
```

- [ ] **Step 2: 검증이 현재 파일에서 실패하는지 확인**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_copy.ps1
```

Expected: `중요하다`, `수도 또는 중심 거점이다`, `주요 도시 또는 지역 거점이다`, 제작 상태 문구 중 하나 이상으로 FAIL

- [ ] **Step 3: 전체 검증 스크립트에서 문체 검증 호출**

`scripts/validate_public_site.ps1` 마지막 성공 출력 전에 다음을 추가한다.

```powershell
& (Join-Path $PSScriptRoot 'validate_public_copy.ps1') -IndexPath $HtmlPath -GlossaryPath $glossaryPath
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
```

- [ ] **Step 4: 현재 전체 검증이 실패하는지 확인**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1
```

Expected: 기존 구조 검증은 통과하고 새 문체 검증에서 FAIL

- [ ] **Step 5: 커밋**

```powershell
git add scripts/validate_public_copy.ps1 scripts/validate_public_site.ps1
git commit -m "test: add public copy regression checks"
```

---

### Task 2: 첫 화면과 전역 안내 문구 개편

**Files:**
- Modify: `index.html:2226-2280`

**Interfaces:**
- Consumes: 기존 내비게이션, 렌·듀란 안내자 이미지, 첫 화면 버튼
- Produces: 혼합형 문체의 첫 화면과 권역 진입 문구

- [ ] **Step 1: 첫 화면 기대 문구 검증 추가**

`scripts/validate_public_copy.ps1`에 다음 검사를 추가한다.

```powershell
foreach ($term in @(
    '비레스의 어느 길로 들어설까',
    '스무 권역이 스무 가지 삶을 품는다',
    '길을 나서기 전에 알아둘 것'
)) {
    if ($index -notmatch [regex]::Escape($term)) {
        $failures.Add("개편 제목 누락: $term")
    }
}
```

- [ ] **Step 2: 검증 실패 확인**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_copy.ps1
```

Expected: 개편 제목 세 개 누락으로 FAIL

- [ ] **Step 3: 첫 화면 문구 교체**

`index.html`에서 다음 원칙으로 수정한다.

```html
<p class="eyebrow">VIRETH 5083 · 첫 여행 안내</p>
<h1>비레스의 어느 길로 들어설까</h1>
<p class="lead">
  왕도는 추천장을 보고, 항구는 선적 장부를 본다.
  눈 덮인 고개와 안개숲에서는 좋은 신분보다 단단한 신발과 믿을 만한 길잡이가 먼저다.
</p>
```

권역 단락 제목은 `스무 권역이 스무 가지 삶을 품는다`, 세계 안내 단락 제목은 `길을 나서기 전에 알아둘 것`으로 교체한다.

- [ ] **Step 4: 첫 화면 검증**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_copy.ps1
```

Expected: 개편 제목 누락 오류가 사라지고 다른 문체 오류만 남음

- [ ] **Step 5: 커밋**

```powershell
git add index.html scripts/validate_public_copy.ps1
git commit -m "copy: rewrite public guide opening"
```

---

### Task 3: 20개 권역 카드와 상세 정보 교정

**Files:**
- Modify: `index.html:2468-2936`
- Modify: `index.html:3880-3980`

**Interfaces:**
- Consumes: `regions`, `regionFacts`, `regionVisuals`, 기존 권역 렌더러
- Produces: 20개 권역의 구체적인 카드 문장과 동일 순서의 상세 기사

- [ ] **Step 1: 권역별 구체 정보 검증 추가**

`scripts/validate_public_copy.ps1`에서 각 권역이 다음 필드를 1개씩 가지는지 검사한다.

```powershell
$regionBlock = [regex]::Match(
    $index,
    'const regions = \[(?<body>[\s\S]*?)\];\s*const regionFacts'
).Groups['body'].Value

foreach ($field in @('name', 'short', 'first', 'places', 'life', 'pressure', 'memory', 'persona')) {
    $count = [regex]::Matches($regionBlock, ([regex]::Escape($field) + ':\s*"[^"]{12,}"')).Count
    if ($count -ne 20) {
        $failures.Add("구체 권역 필드 불일치: $field expected=20 actual=$count")
    }
}
```

- [ ] **Step 2: 20개 권역 문장 교정**

각 권역의 데이터를 다음 기준으로 다시 쓴다.

```javascript
{
  name: "레오니아",
  short: "왕궁과 기사 봉토가 이어진 중앙 왕국이다. 추천장이 없으면 왕실 납품 줄에 설 수 없다.",
  life: "왕실 납품소는 추천장에 적힌 보증인과 봉인을 대조한다. 문장 반지는 신분과 소속 가문을 확인하는 표식이다.",
  pressure: "최근에는 남품 품질과 서임 순서를 둘러싼 이의가 왕실 법정과 장터에서 함께 늘었다.",
  memory: "오래된 왕권과 빈 왕좌의 기억은 궁정의 서열과 봉토 충성 서약에 남아 있다."
}
```

20개 권역 모두에서 `중요하다`, `힘을 가진다`, `길을 연다`, `사람을 가른다`를 실제 절차와 결과로 바꾼다.

- [ ] **Step 3: 권역 상세 렌더러의 정보 순서 교체**

상세 패널을 다음 순서로 출력한다.

```javascript
[
  ["어떤 땅인가", region.short],
  ["수도와 주요 도시", `${visual.capitalName}. ${region.places}`],
  ["사람과 종족", facts.people],
  ["돈과 장터", facts.money],
  ["달력과 계절", facts.time],
  ["역사와 현재", `${facts.history} ${region.pressure}`],
  ["여행의 시작", region.first]
]
```

기존 `도시와 사람`, `돈과 계절`, `첫 장면` 네 묶음 검증도 새 일곱 묶음에 맞춰 수정한다.

- [ ] **Step 4: 권역 검증 실행**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1
```

Expected: 20개 권역과 새 일곱 상세 항목 PASS, 남은 세계 안내·사전 문체 오류만 FAIL

- [ ] **Step 5: 커밋**

```powershell
git add index.html scripts/validate_public_site.ps1 scripts/validate_public_copy.ps1
git commit -m "copy: make all region descriptions concrete"
```

---

### Task 4: 여섯 개 세계 안내 장 재작성

**Files:**
- Modify: `index.html:2938-3134`
- Modify: `index.html:3982-4025`

**Interfaces:**
- Consumes: `readerSections`, `readerVisuals`, `renderReader`
- Produces: 각 장 안에서 정보가 완결되는 여섯 개 공개 안내 단락

- [ ] **Step 1: 필수 정보 검증 강화**

`scripts/validate_public_copy.ps1`에 다음 구체 항목을 추가한다.

```powershell
$requiredReaderTerms = @(
    '라드아르할',
    '페르브루니르',
    '금표',
    '20 은량',
    '천걸음',
    '약 750미터',
    '비레스년',
    '660비레스일',
    '그린할로우',
    '5068년'
)

foreach ($term in $requiredReaderTerms) {
    if ($index -notmatch [regex]::Escape($term)) {
        $failures.Add("세계 안내 구체 정보 누락: $term")
    }
}
```

- [ ] **Step 2: 나라와 권역 교정**

20개 국가·권역 소개를 `통치 형태 + 수도 + 생활에 닿는 절차`로 쓴다. 시설 명사만 나열하지 않는다.

- [ ] **Step 3: 종족과 문화 교정**

각 종족을 `외형 또는 식별 특징 + 주 분포권 + 생업 + 다른 집단과의 관계` 순서로 쓴다. 기록 출처는 마지막 문장으로 이동한다.

- [ ] **Step 4: 도시와 마을 교정**

성문, 장터, 창고, 수문, 항만, 초소가 실제로 수행하는 일을 구체적으로 적고 이름 있는 대표 장소를 함께 제시한다.

- [ ] **Step 5: 돈과 물건 교정**

금표, 은량, 반은, 동각, 철각의 환산과 품삯, 식사, 숙박, 곡물값을 유지한다. 도량형에는 천걸음, 하룻길, 등짐, 자루를 보존한다.

- [ ] **Step 6: 달력과 계절 교정**

비레스년 660일과 대표 지역 달력명을 명시한다. 각 달력이 파종, 출항, 통금, 저장고 개방에 미치는 결과를 한 문장씩 적는다.

- [ ] **Step 7: 역사와 소문 교정**

굵직한 사건마다 시기, 장소, 결과, 현재 흔적 중 두 가지 이상을 적는다. 지역별 구전 차이는 객관 사건 뒤에 분리해 적는다.

- [ ] **Step 8: 세계 안내 검증**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1
```

Expected: 여섯 장, 종족명, 화폐·단위, 달력, 역사 연도 PASS

- [ ] **Step 9: 커밋**

```powershell
git add index.html scripts/validate_public_copy.ps1
git commit -m "copy: rebuild the six world guide chapters"
```

---

### Task 5: 시작 장면과 갤러리 문구 교정

**Files:**
- Modify: `index.html:2318-2454`

**Interfaces:**
- Consumes: 기존 시작 장면 여섯 항목, 웹툰 세 장, 도시·마을·도식 슬라이드
- Produces: 제작 상태 문구가 없는 장면 소개와 이미지 자체를 설명하는 캡션

- [ ] **Step 1: 시작 장면 필수 요소 검증 추가**

`scripts/validate_public_copy.ps1`에 다음 검사를 추가한다.

```powershell
$startBlock = [regex]::Match(
    $index,
    '<section id="start"[\s\S]*?</section>'
).Value

if ([regex]::Matches($startBlock, '<div class="start-choices"><b>첫 선택</b>').Count -ne 6) {
    $failures.Add('시작 장면 선택지 여섯 묶음 불일치')
}

if ($startBlock -match '웹툰이 더해지기 전까지') {
    $failures.Add('시작 장면 제작 상태 문구 잔존')
}
```

- [ ] **Step 2: 시작 장면 문구 수정**

이미지가 없는 세 항목의 제작 상태 문구를 장면의 감각 단서로 교체한다.

예시:

```html
<div class="start-placeholder">
  젖은 포대에서 곡물 냄새가 올라오고, 환전상은 서로 다른 동전을 저울 위에 올린다.
</div>
```

- [ ] **Step 3: 갤러리 캡션 수정**

`자료`, `내용을 모았다`, `감을 잡게 한다`를 제거하고 이미지에서 확인할 수 있는 장소와 구조를 직접 쓴다.

예시:

```html
<p class="gallery-note">
  각 권역의 수도와 지역도시를 한 장씩 넘긴다. 성벽, 항만, 장터, 신전과 창고가 도시 안에서 어떻게 이어지는지 볼 수 있다.
</p>
```

- [ ] **Step 4: 검증 실행**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1
```

Expected: 제작 상태 문구와 갤러리 제작자 시점 문구 0개

- [ ] **Step 5: 커밋**

```powershell
git add index.html scripts/validate_public_copy.ps1
git commit -m "copy: polish starting scenes and gallery captions"
```

---

### Task 6: 고유명사 사전의 상세 설명 우선 적용

**Files:**
- Modify: `glossary.html:303-426`
- Modify: `scripts/test_glossary_builder.mjs`

**Interfaces:**
- Consumes: `window.VIRETH_CANON_GLOSSARY_ENTRIES`, HTML 내부 수동 보조 항목
- Produces: 최신 통합본 상세 설명을 우선하는 고유명사 목록

- [ ] **Step 1: 생성기 설명 보존 테스트 추가**

`scripts/test_glossary_builder.mjs`에 다음 검사를 추가한다.

```javascript
assert.match(
  byName.get("라드가르가")?.description ?? "",
  /봉토 마을|곡물 집산/
);
assert.ok(
  !/주요 도시 또는 지역 거점이다/.test(
    byName.get("라드가르가")?.description ?? ""
  )
);
```

- [ ] **Step 2: Node 테스트 실행**

Run:

```powershell
node .\scripts\test_glossary_builder.mjs
```

Expected: 상세 설명 보존 PASS

- [ ] **Step 3: 사전 병합 우선순위 변경**

수동 기본 항목을 먼저 넣고 최신 통합본 중복을 버리는 현재 구조를 다음 방식으로 바꾼다.

```javascript
const glossaryByName = new Map();

glossary.forEach(item => glossaryByName.set(item.name, item));
(window.VIRETH_CANON_GLOSSARY_ENTRIES || []).forEach(item => {
  glossaryByName.set(item.name, item);
});

const mergedGlossary = [...glossaryByName.values()];
```

이후 범주, 검색, 결과 렌더러는 `mergedGlossary`를 사용한다.

- [ ] **Step 4: 일반 도시 설명 제거**

`regionRecords`가 만드는 수도와 도시의 일반 설명을 삭제하거나 구체 설명이 없는 항목의 보조값으로만 둔다. 공개 결과에는 다음 문장이 남지 않아야 한다.

```text
수도 또는 중심 거점이다.
주요 도시 또는 지역 거점이다.
```

- [ ] **Step 5: 사전 도입 문구 교정**

사전 도입은 분위기 한 문장과 사용 방법 한 문장으로 제한한다.

```html
<h1>낯선 이름 하나가 길의 모양을 바꾼다</h1>
<p class="lead">
  나라와 도시, 종족과 화폐, 달력과 오래된 사건을 이름으로 찾는다.
  검색창에 한 글자만 입력해도 관련 권역과 뜻이 함께 나타난다.
</p>
```

- [ ] **Step 6: 사전 검증**

Run:

```powershell
node .\scripts\test_glossary_builder.mjs
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1
```

Expected: 두 명령 모두 PASS

- [ ] **Step 7: 커밋**

```powershell
git add glossary.html scripts/test_glossary_builder.mjs
git commit -m "copy: prefer detailed canon glossary entries"
```

---

### Task 7: 브라우저 화면과 접근성 검증

**Files:**
- Modify only if defects are found: `index.html`, `glossary.html`

**Interfaces:**
- Consumes: 완성된 공개 페이지
- Produces: 모바일·태블릿·데스크톱에서 검증된 문장 흐름과 상호작용

- [ ] **Step 1: 로컬 서버 실행**

Run:

```powershell
python -m http.server 8766
```

Expected: `http://127.0.0.1:8766/`와 `/glossary.html`이 200 응답

- [ ] **Step 2: 세 화면 크기 캡처**

브라우저에서 다음 뷰포트를 확인한다.

```text
390 x 900
768 x 1024
1280 x 900
```

확인 항목:

- 첫 화면에서 제목과 첫 행동이 보인다.
- 권역 카드의 글자가 한 글자씩 끊어지지 않는다.
- 권역 상세의 일곱 단락이 순서대로 보인다.
- 여섯 개 세계 안내 장을 독립적으로 열고 닫을 수 있다.
- 고유명사 검색 결과가 구체적인 정의를 표시한다.

- [ ] **Step 3: 키보드 검사**

`Tab`, `Enter`, `Space`, `ArrowLeft`, `ArrowRight`, `Escape`로 권역 슬라이더, 아코디언, 갤러리, 확대 모달, 사전 필터를 조작한다.

Expected: 초점 손실과 키보드 함정 없음

- [ ] **Step 4: 전체 자동 검증**

Run:

```powershell
node .\scripts\test_glossary_builder.mjs
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1
git diff --check
```

Expected:

```text
glossary builder tests passed
PUBLIC_COPY_VALIDATION_OK
PUBLIC_SITE_VALIDATION_OK regions=20
```

- [ ] **Step 5: 최종 커밋**

```powershell
git add index.html glossary.html scripts/validate_public_copy.ps1 scripts/validate_public_site.ps1 scripts/test_glossary_builder.mjs
git commit -m "feat: complete Vireth public copy overhaul"
```

---

### Task 8: GitHub Pages 배포 검증

**Files:**
- No file changes expected

**Interfaces:**
- Consumes: 검증을 통과한 현재 브랜치
- Produces: GitHub Pages에 배포된 공개 안내 페이지

- [ ] **Step 1: 작업 범위 확인**

Run:

```powershell
git status --short
git diff --stat origin/main...HEAD
```

Expected: 미추적 `viewer/Arcadia_비레스_세계관_DB_최종통합본_v1.md`와 `viewer/assets/maps/`는 커밋 대상에 없음

- [ ] **Step 2: 현재 브랜치 푸시**

Run:

```powershell
git push origin HEAD:main
```

Expected: push success

- [ ] **Step 3: 공개 URL 확인**

Open:

```text
https://musueman.github.io/arcadia-easy-explainers/
https://musueman.github.io/arcadia-easy-explainers/glossary.html
```

Expected:

- 새 첫 화면 제목 표시
- 권역 20개 탐색 가능
- 세계 안내 여섯 장 열림
- 사전 상세 설명 검색 가능
- 깨진 이미지와 가로 스크롤 없음

- [ ] **Step 4: 배포 결과 기록**

최종 보고에 커밋 해시, 공개 URL, 검증 명령 결과, 제외한 미추적 파일을 요약한다.

