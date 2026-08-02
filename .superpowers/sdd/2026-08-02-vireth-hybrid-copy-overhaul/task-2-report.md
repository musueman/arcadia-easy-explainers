# Task 2 Report: Vireth Hybrid Copy Overhaul

## Scope

Implemented the Task 2 public travel-guide copy refresh in the requested worktree.

Changed only:

- `index.html`
- `scripts/validate_public_copy.ps1`
- This report file

Navigation, Ren/Duran guide assets, buttons, IDs, hrefs, interactions, viewer files, maps, source canon files, and unrelated work were preserved.

## Implementation

Added the three exact Task 2 regression terms to `scripts/validate_public_copy.ps1`:

- `비레스의 어느 길로 들어설까`
- `스무 권역이 스무 가지 삶을 품는다`
- `길을 나서기 전에 알아둘 것`

Updated `index.html` with the required mixed-style opening:

- Hero heading: `비레스의 어느 길로 들어설까`
- Hero lead: `왕도는 추천장을 보고, 항구는 선적 장부를 본다.` followed by the required snow-pass and fog-forest sentence.
- Region heading: `스무 권역이 스무 가지 삶을 품는다`
- World-guide heading: `길을 나서기 전에 알아둘 것`

## Verification

Command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_public_copy.ps1
```

Pre-edit result: expected failure. All three new errors were reported as `개편 제목 누락`.

Post-edit result: expected partial failure. All three new heading errors disappeared. The validator still reports these existing failures, outside Task 2 scope:

- `일반 도시 설명`
- `제작 상태 문구`
- `추상 표현: 힘을 가진다`
- `추상 표현: 사람을 가른다`
- `추상 표현: 중요하다`
- `추상 표현: 길을 연다`
- `금칙 표현: 삶과 가까운 장면이 열린다`
- `필수 구체 정보 누락: 비레스년`

Additional check: `git diff --check` produced no whitespace errors. Git emitted only its normal LF-to-CRLF working-copy warnings.

## Concerns

The specified validator remains nonzero because of pre-existing public-copy findings and the missing `비레스년` term. Resolving those would exceed Task 2 and alter unrelated copy behavior.
