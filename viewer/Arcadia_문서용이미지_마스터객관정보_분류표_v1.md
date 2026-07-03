# Arcadia 문서용 이미지 분류표: 마스터 객관정보 v1

이 문서는 마스터 객관정보 정본을 설명하기 위한 이미지 자산의 분류표다. 이미지 제작은 별도 `문서용 이미지 제작` 스레드에서 진행하고, 이 문서에는 자산의 목적, 연결 단락, 제작 상태, 저장 위치를 기록한다.

현재 작업 범위는 마스터 객관정보 이미지 보강이다. 기준시대 5083 객관정보 이미지는 마스터 객관정보용 이미지가 문서 삽입 가능한 상태가 된 뒤 별도 분류한다. 마스터 객관정보에 삽입하는 도식 자산은 텍스트 가독성을 위해 SVG 원본을 우선한다. PNG는 검수용 또는 미리보기용 보조 파일로 둔다.

## 0. 제작·검수 푸시 프로토콜

| 역할 | 담당 스레드 | 처리 |
|---|---|---|
| 이미지 제작 | `문서용 이미지 제작` | 요청받은 이미지 파일을 생성하고, 산출 직후 메인 스레드로 검수 요청을 보낸다. |
| 이미지 검수·병합 | `문서 분석 및 보완 항목 정리` | 산출 이미지를 확인하고, 통과하면 문서 저장소로 이관한 뒤 마스터 객관정보와 해설본에 링크한다. |
| 다음 이미지 설계 | `문서 분석 및 보완 항목 정리` | 직전 이미지 병합 또는 수정 요청 후, 다음 마스터 객관정보 이미지 설계안을 제작 스레드로 보낸다. |

제작 스레드가 산출 완료 후 메인 스레드로 보내는 검수 요청에는 이미지 ID, 산출 파일 경로, 반영한 정본 단락, 이미지 안의 주요 표기, 자체 확인한 오탈자 여부를 포함한다.

## 1. 기존 확인 이미지

| 이미지 ID | 상태 | 연결 단락 | 이미지 성격 | 현재 파일 |
|---|---|---|---|---|
| IMG-MOBJ-AST-001 | 문서 병합 완료 | 마스터 객관정보 1.1, 1.4 | 아리온 항성계 정본 구조도 | `assets/images/arion-system-canon-schematic-v2.svg` |
| IMG-MOBJ-AST-002 | 자산 보존 | 마스터 객관정보 1.1 | 아리온 항성계 설명용 분위기 이미지 | `assets/images/arion-star-system-overview-v2-corrected.png` |

## 2. 마스터 객관정보 필수 제작 후보

| 우선순위 | 이미지 ID | 상태 | 연결 단락 | 제안 파일명 | 핵심 내용 |
|---:|---|---|---|---|---|
| 1 | IMG-MOBJ-VIR-001 | 문서 병합 완료 | 2.1, 2.2, 2.3 | `assets/images/vireth-planet-moons-smallbodies-schematic-v3.svg` | 비레스 행성, 카엘룸, 움브라, 내부 소행성대, 크세르크세스, 닉스 천체대의 관계 |
| 2 | IMG-MOBJ-SUR-001 | 문서 병합 완료 | 3.1, 3.2 | `assets/images/vireth-continents-oceans-geodesy-v2.svg` | 비레스의 대륙·해양·좌표권, 주요 지형권의 전체 배치 |
| 3 | IMG-MOBJ-GEO-001 | 문서 병합 완료 | 3.3, 4.1, 4.2 | `assets/images/vireth-tectonics-resources-hazards-v1.svg` | 판구조, 자원권, 재해권을 한 장에서 읽는 지질 종합도 |
| 4 | IMG-MOBJ-CLM-001 | 문서 병합 완료 | 5.1, 5.2, 5.3 | `assets/images/vireth-climate-hydro-biosphere-v1.svg` | 기후대, 해류, 유역, 생물권의 겹침 |
| 5 | IMG-MOBJ-TIM-001 | 문서 병합 완료 | 1.3, 7 | `assets/images/arion-vireth-natural-history-timeline-v1.svg` | 아리온 형성 후 비레스 생명권 가능 창까지의 장기 자연사 연대표 |
| 6 | IMG-MOBJ-CAL-001 | 문서 병합 완료 | 6.1, 6.2, 2.2 | `assets/images/vireth-seasons-twinmoon-cycle-v1.svg` | 660일 물리년, 165일 평균 사분기, 카엘룸·움브라 위상주기의 관계 |

## 3. 검수 기록

| 이미지 ID | 산출 파일 | 검수 상태 | 기록 |
|---|---|---|---|
| IMG-MOBJ-VIR-001 | `D:/OneDrive/Documents/듀란일대기 설정 및 챗봇제작/assets/images/vireth-planet-moons-smallbodies-schematic-v1.png` | 수정 요청 | 전체 구성은 적합하나 하단 표 겹침, 비레스 설명 오탈자, 닉스 천체대 행과 검수 문장 충돌이 있어 제2판 제작을 요청했다. |
| IMG-MOBJ-VIR-001 | `D:/OneDrive/Documents/듀란일대기 설정 및 챗봇제작/assets/images/vireth-planet-moons-smallbodies-schematic-v2.png` | 수정 요청 | 표 겹침은 개선됐으나 크세르크세스 라벨 오탈자와 하단 검수 포인트 문구가 남아 제3판 제작을 요청했다. |
| IMG-MOBJ-SUR-001 | `D:/OneDrive/Documents/듀란일대기 설정 및 챗봇제작/assets/images/vireth-continents-oceans-geodesy-v1.png` | 수정 요청 | 좌표권 기반 도식 방향은 적합하나 하단의 사용 포인트·주의·검수 문장이 운용 메모처럼 보여 삭제를 요청했다. 경도 표기와 범례 가독성도 수정 요청했다. |
| IMG-MOBJ-VIR-001 | `assets/images/vireth-planet-moons-smallbodies-schematic-v3.png` | 통과·병합 | 메타 문구와 주요 오탈자가 제거되어 마스터 객관정보 2.1 아래에 병합했다. |
| IMG-MOBJ-SUR-001 | `assets/images/vireth-continents-oceans-geodesy-v2.png` | 통과·병합 | 대륙·해양·좌표권 도식으로 통과 처리하고 마스터 객관정보 3.1 아래에 병합했다. |
| IMG-MOBJ-GEO-001 | `assets/images/vireth-tectonics-resources-hazards-v1.png` | 통과·병합 | 판구조·자원권·자연재해권을 한 장에서 읽는 종합도로 통과 처리하고 마스터 객관정보 3.3 아래에 병합했다. |
| IMG-MOBJ-CLM-001 | `assets/images/vireth-climate-hydro-biosphere-v1.png` | 통과·병합 | 기후대·해류·유역·생물권을 한 장에서 읽는 종합도로 통과 처리하고 마스터 객관정보 5장 아래에 병합했다. |
| IMG-MOBJ-TIM-001 | `D:/OneDrive/Documents/듀란일대기 설정 및 챗봇제작/assets/images/arion-vireth-natural-history-timeline-v1.png` | PNG 미리보기 확인 | PNG 미리보기 산출을 확인했고, 최종 병합은 SVG 원본으로 진행했다. |
| IMG-MOBJ-AST-001 | `assets/images/arion-system-canon-schematic-v2.svg` | SVG 교체·병합 | PNG 링크를 SVG 원본으로 교체했다. |
| IMG-MOBJ-VIR-001 | `assets/images/vireth-planet-moons-smallbodies-schematic-v3.svg` | SVG 교체·병합 | PNG 링크를 SVG 원본으로 교체했다. |
| IMG-MOBJ-SUR-001 | `assets/images/vireth-continents-oceans-geodesy-v2.svg` | SVG 교체·병합 | PNG 링크를 SVG 원본으로 교체했다. |
| IMG-MOBJ-GEO-001 | `assets/images/vireth-tectonics-resources-hazards-v1.svg` | SVG 교체·병합 | PNG 링크를 SVG 원본으로 교체했다. |
| IMG-MOBJ-CLM-001 | `assets/images/vireth-climate-hydro-biosphere-v1.svg` | SVG 교체·병합 | PNG 링크를 SVG 원본으로 교체했다. |
| IMG-MOBJ-TIM-001 | `assets/images/arion-vireth-natural-history-timeline-v1.svg` | 통과·병합 | 장기 자연사 연대표 SVG 원본을 마스터 객관정보 1.3 아래에 병합했다. |
| IMG-MOBJ-CAL-001 | `assets/images/vireth-seasons-twinmoon-cycle-v1.svg` | 통과·병합 | 비레스 물리년·사분기·쌍월 위상주기 설명도 SVG 원본을 마스터 객관정보 6장 아래에 병합했다. |

## 4. 제작 스타일 기준

| 항목 | 기준 |
|---|---|
| 기본 톤 | 기존 `arion-system-canon-schematic-v2.svg`와 같은 어두운 우주 배경, 얇은 선, 절제된 색상, 표 중심 정보 |
| 텍스트 | 한국어 중심, 필요한 정본명만 병기 |
| 화면비 | 문서 삽입용 16:9 가로형 우선 |
| 산출형 | SVG 원본 우선. PNG는 검수용 또는 미리보기용 보조 파일 |
| 피해야 할 것 | 과도한 판타지 삽화, 장면 일러스트, 설정에 없는 도시·인물·문장 삽입 |

## 5. 제작 후 이관 기준

| 단계 | 처리 |
|---|---|
| 제작 | `문서용 이미지 제작` 스레드에서 생성 |
| 1차 확인 | 이미지 안의 이름, 수치, 위치, 색상 구분 오류 확인 |
| 저장 | 최종 파일을 Arcadia 문서 저장소의 이미지 자산 폴더로 복사 |
| 연결 | 마스터 객관정보 정본과 쉬운해설본에서 해당 단락 아래에 이미지 링크 삽입 |
| 검증 | 파일 경로, 이미지 표시, 정본명 표기, 영문 잔류 여부 확인 |
