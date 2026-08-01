# Vireth Cinematic Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 비레스 공개 안내서를 반복 카드형 화면에서 전폭 이미지와 기사형 본문이 이어지는 시네마틱 잡지형 안내서로 개편한다.

**Architecture:** 단일 `index.html`의 기존 데이터 배열과 상호작용 함수는 유지하고, 렌더링 마크업과 CSS 표현 계층만 바꾼다. 20개 권역은 간결한 색인으로 탐색하고 선택 결과는 전폭 기사로 렌더링한다. 세계 읽기, 시작상황, 자료관은 기존 기능을 보존하면서 중첩 박스를 여백·구분선·전폭 이미지로 교체한다.

**Tech Stack:** 정적 HTML, CSS, 바닐라 JavaScript, PowerShell 검증기, Playwright CLI, GitHub Pages.

## Global Constraints

- `D:/OneDrive/Documents/arcadia-easy-explainers-publish/index.html`의 단일 페이지 구조와 기존 데이터 배열을 유지한다.
- 20개 권역, 여섯 세계 읽기 주제, 여섯 시작상황, 세 웹툰을 삭제하지 않는다.
- `객관정보`, `정본`, `검산`, `운용부록`, `실투입본` 같은 제작 용어를 공개 화면에 노출하지 않는다.
- 설명은 처음 비레스를 접하는 사용자가 이해할 수 있는 현대 생활어로 작성한다.
- 독립적으로 선택하거나 펼치는 요소에만 박스와 테두리를 남긴다.
- 렌·듀란 키 비주얼, 이미지 슬라이드, 확대 모달, 키보드 조작, 지연 로딩을 유지한다.
- 관련 없는 미추적 세계관 파일과 `viewer/assets/maps/`는 커밋하지 않는다.

---

### Task 1: 시네마틱 구조 검증 규칙

**Files:**
- Modify: `scripts/validate_public_site.ps1`
- Test: `scripts/validate_public_site.ps1`

**Interfaces:**
- Consumes: `index.html`의 정적 마크업과 JavaScript 템플릿 문자열.
- Produces: 새 시네마틱 클래스와 기존 콘텐츠 개수를 동시에 검사하는 `PUBLIC_SITE_VALIDATION_OK`.

- [ ] **Step 1: 새 구조를 요구하는 실패 검사를 추가한다**

```powershell
Assert-Count -Pattern 'class="section-band' -Expected 4 -Message '전폭 섹션 밴드 네 개 불일치'
Assert-Contains -Pattern 'class="region-index"' -Message '권역 색인 누락'
Assert-Contains -Pattern 'class="region-article"' -Message '권역 기사 누락'
Assert-Contains -Pattern 'class="region-article-hero"' -Message '권역 전폭 대표 이미지 누락'
Assert-Contains -Pattern 'class="reader-chapter"' -Message '장 제목형 세계 읽기 누락'
Assert-Contains -Pattern 'class="start-path"' -Message '무박스 플레이 유형 누락'
Assert-Count -Pattern '<section id="(?:regions|read|start|images)" class="section">' -Expected 0 -Message '구형 박스 섹션 잔존'
```

- [ ] **Step 2: 검증기를 실행해 실패를 확인한다**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1
```

Expected: `전폭 섹션 밴드`, `권역 색인`, `권역 기사` 관련 오류로 실패.

- [ ] **Step 3: 기존 콘텐츠 보존 검사를 유지한다**

20개 권역명, 20개 대표 거점, 여섯 세계 읽기 제목, 여섯 시작상황, 세 웹툰, 종족·경제 핵심어 검사는 삭제하지 않는다.

---

### Task 2: 전폭 밴드와 권역 기사 구조

**Files:**
- Modify: `index.html`의 공통 섹션 CSS, `#regions` 마크업, `renderRegionButtons()`, `renderRegionDetail()`
- Test: `scripts/validate_public_site.ps1`

**Interfaces:**
- Consumes: `regions[]`, `regionSpecies`, `regionCrests`.
- Produces: `renderRegionIndex(): void` 역할의 `renderRegionButtons()`와 `renderRegionArticle(index: number): void` 역할의 `renderRegionDetail(index)`.

- [ ] **Step 1: 네 섹션을 전폭 밴드로 바꾼다**

```html
<section id="regions" class="section-band region-band">
  <div class="section-shell">
    ...
  </div>
</section>
```

`read`, `start`, `images`도 같은 `section-band > section-shell` 구조를 사용한다. 바깥 테두리, 둥근 모서리, 그림자는 제거하고 밴드별 배경색과 위아래 여백으로 구분한다.

- [ ] **Step 2: 권역 선택기를 텍스트 중심 색인으로 바꾼다**

```html
<div id="region-grid" class="region-index" aria-label="비레스 권역 색인"></div>
<article id="region-detail" class="region-article" aria-live="polite"></article>
```

각 색인 버튼은 문장, 권역명, 수도명, 한 문장 소개를 포함한다. 배경 풍경 이미지는 제거하고 선택 상태는 왼쪽 색선과 굵은 글자로 표시한다.

- [ ] **Step 3: 권역 상세를 전폭 기사로 렌더링한다**

```html
<div class="region-article-hero">
  <img src="${region.capitalImage}" alt="${region.capitalName} 전경">
  <div class="region-article-title">
    <span>${region.type}</span>
    <h3>${region.name}</h3>
    <p>${region.capitalName} · ${region.capitalText}</p>
  </div>
</div>
```

대표 이미지 아래에는 `어떤 나라·권역인가`, `수도와 주요 도시`, `사람과 종족`, `돈과 장터`, `달력과 계절`, `남아 있는 역사와 소문`, `여행자가 시작하기 좋은 장소`를 전폭 단락과 구분선으로 배치한다.

- [ ] **Step 4: 문체를 생활어로 편집한다**

제목은 질문이나 생활 장면으로 쓴다. 예:

```text
어떤 곳인가 → 이곳에서는 무엇이 길을 열까요?
수도와 주요 도시 → 먼저 만나게 될 도시
돈과 장터 → 장터에서 값을 치르는 법
남아 있는 역사와 소문 → 사람들이 아직 기억하는 이야기
```

본문은 기존 사실을 유지하고 한 문장을 2~3개의 짧은 절로 나눈다. 제작 절차나 데이터 설명은 추가하지 않는다.

- [ ] **Step 5: 검증기를 실행한다**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1
```

Expected: 권역·콘텐츠 검사는 통과하고 아직 미구현인 `reader-chapter`, `start-path` 검사만 실패.

---

### Task 3: 세계 읽기와 플레이 시작점의 편집형 전환

**Files:**
- Modify: `index.html`의 reader CSS, `renderReaderSections()`, `#start` 마크업과 CSS
- Test: `scripts/validate_public_site.ps1`

**Interfaces:**
- Consumes: `readerSections[]`, `readerIconNames[]`, 정적 시작상황 여섯 항목.
- Produces: `details.reader-chapter` 여섯 개와 `.start-path` 네 개.

- [ ] **Step 1: 세계 읽기를 장 제목형 아코디언으로 바꾼다**

```html
<details class="reader-chapter">
  <summary>
    <i class="reader-summary-icon" ...></i>
    <span class="reader-summary-text">...</span>
  </summary>
  <div class="reader-article">...</div>
</details>
```

닫힌 항목은 바닥 구분선만 사용한다. 열린 본문의 대표 이미지는 테두리 없는 2열 배치로 두고, `reader-note`는 배경 박스 대신 세로 색선, `reader-group`은 배경 없이 열 사이 구분선만 사용한다.

- [ ] **Step 2: 여섯 주제의 도입 문장을 사용자 언어로 다듬는다**

```text
나라와 권역: 지금 서 있는 땅의 이름부터 살펴봅니다.
종족과 문화: 누구와 마주치고, 서로 어떻게 살아가는지 봅니다.
도시와 마을: 성문 밖과 안에서 무엇이 달라지는지 읽습니다.
돈과 물건: 오늘 품삯으로 무엇을 사고 어디서 잘 수 있는지 봅니다.
달력과 계절: 오늘이 언제이며 길을 나서기 좋은 때인지 확인합니다.
역사와 소문: 기록에 남은 일과 사람들 입에 남은 이야기를 나눠 봅니다.
```

- [ ] **Step 3: 플레이 유형 카드 배경을 제거한다**

```html
<div class="start-path">
  <i class="path-icon" ...></i>
  <b>길 위의 여행자</b>
  <span>여관과 검문소에서 길값과 소문을 먼저 만납니다.</span>
</div>
```

네 항목은 같은 행의 편집 칼럼으로 배치하며 위쪽 색선과 아이콘만 유지한다.

- [ ] **Step 4: 시작상황 펼침 본문을 연속 기사로 만든다**

시작상황 이미지 배너는 유지한다. 펼친 본문에서 태그는 작은 글자 행, 첫 선택은 세로 색선, 웹툰은 전폭 이미지로 이어지게 하고 별도 배경 카드와 그림자를 제거한다.

- [ ] **Step 5: 검증기를 실행한다**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1
```

Expected: `PUBLIC_SITE_VALIDATION_OK regions=20`.

---

### Task 4: 자료관 프레임 축소와 반응형 정리

**Files:**
- Modify: `index.html`의 gallery, slide, lightbox, responsive CSS
- Test: browser checks

**Interfaces:**
- Consumes: 기존 `galleryData`, `diagramSlides`, lightbox 이벤트.
- Produces: 기존 함수 서명을 유지하는 테두리 없는 갤러리와 동일한 키보드 조작.

- [ ] **Step 1: 슬라이드 외부 박스를 제거한다**

슬라이드 무대는 이미지와 캡션만 남기고 큰 배경 프레임, 중첩 테두리, 불필요한 그림자를 제거한다. 이전·다음 버튼과 썸네일 선택 상태는 유지한다.

- [ ] **Step 2: 데스크톱 권역 기사를 검증한다**

Viewport: `1280×900`.

Expected:
- 권역 색인과 기사가 같은 화면에 자연스럽게 이어짐.
- 전폭 대표 이미지 위 제목이 읽힘.
- 중첩 카드가 없음.
- 가로 넘침 0.

- [ ] **Step 3: 태블릿을 검증한다**

Viewport: `768×1024`.

Expected:
- 권역 색인이 2열 이하로 정리됨.
- 대표 이미지와 제목이 잘리지 않음.
- 글자 단위 줄바꿈 없음.

- [ ] **Step 4: 모바일을 검증한다**

Viewport: `390×844`.

Expected:
- 권역 색인이 가로 스크롤 또는 2열 목록으로 탐색 가능함.
- 기사가 이미지 다음 본문 순서로 쌓임.
- 시작상황과 세계 읽기 버튼의 터치 영역이 44px 이상임.
- 가로 넘침 0.

---

### Task 5: 최종 검산, 커밋, 배포

**Files:**
- Modify only if verification exposes a defect: `index.html`, `scripts/validate_public_site.ps1`
- Verify: public GitHub Pages

**Interfaces:**
- Consumes: 완료된 정적 페이지.
- Produces: 검증된 Git 커밋과 공개 URL.

- [ ] **Step 1: 정적 검사를 실행한다**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_site.ps1
```

Expected: `PUBLIC_SITE_VALIDATION_OK regions=20`.

- [ ] **Step 2: 인라인 JavaScript를 파싱한다**

```powershell
@'
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const scripts = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)];
scripts.forEach((match) => new Function(match[1]));
console.log(`INLINE_JS_PARSE_OK count=${scripts.length}`);
'@ | node
```

Expected: `INLINE_JS_PARSE_OK count=1`.

- [ ] **Step 3: 브라우저 상태를 검증한다**

확인값:

```text
regions=20
readerChapters=6
startScenarios=6
brokenImages=0
consoleErrors=0
horizontalOverflow=0
```

- [ ] **Step 4: 작업 파일만 커밋한다**

```powershell
git add -- index.html scripts/validate_public_site.ps1 docs/superpowers/plans/2026-08-02-vireth-cinematic-editorial-redesign.md
git commit -m "Redesign Vireth guide as cinematic editorial"
```

- [ ] **Step 5: main에 푸시하고 공개 페이지를 확인한다**

```powershell
git push origin HEAD:main
```

Expected:
- `https://musueman.github.io/arcadia-easy-explainers/` HTTP 200.
- 공개 HTML에 `region-article-hero`, `reader-chapter`, `start-path` 존재.
