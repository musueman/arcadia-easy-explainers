# Arcadia 기준시대 5083 자연오버레이·사회문화 통합상태 점검표 v1

## 문서 역할

이 문서는 `Arcadia_기준시대_5083_자연오버레이_v1.md`와 `Arcadia_기준시대_5083_사회문화_핵심정보_v1.md`의 항목이 `Arcadia_기준시대_5083_객관정보_v1.md`에 어느 정도 흡수되었는지 점검하는 작업표다. 기준시대 객관정보 정본에는 결론과 운용 기준만 남기고, 이 문서는 흡수 상태와 다음 보강 순서를 추적한다.

| 항목 | 기준 |
|---|---|
| 점검 대상 1 | `Arcadia_기준시대_5083_자연오버레이_v1.md` |
| 점검 대상 2 | `Arcadia_기준시대_5083_사회문화_핵심정보_v1.md` |
| 통합 대상 | `Arcadia_기준시대_5083_객관정보_v1.md` |
| 상태값 | 흡수 완료, 부분 흡수, 정본 보강 필요, 별도 닻 유지 |
| 기본 원칙 | 자연오버레이는 물리 선택값이므로 별도 닻을 유지하고, 기준시대 객관정보에는 변환 결과만 둔다. |
| 기본 원칙 | 사회문화 핵심정보는 기준시대 객관정보의 본문 ID로 흡수하되, 원천 문서는 누락 대조표로 유지한다. |
| 제외 범위 | 인물관계, 사건 장면, 역사 연표, LunaTalk 전용 발화문 |

## 상태값 정의

| 상태값 | 의미 | 후속 처리 |
|---|---|---|
| 흡수 완료 | 기준시대 객관정보에 대응 단락과 운용 표면이 충분히 들어간 상태 | 원천 문서는 대조용으로만 유지한다. |
| 부분 흡수 | 대응 단락은 있으나 구체 사례, 하위 권역, 낮은 표면이 더 필요한 상태 | 기준시대 객관정보에 보강 단락을 추가한다. |
| 정본 보강 필요 | 원천에는 핵심값이 있으나 기준시대 객관정보에서 찾기 어렵거나 너무 추상적인 상태 | 우선 보강 후보로 올린다. |
| 별도 닻 유지 | 물리 선택값이나 검산 기준이라 기준시대 객관정보에 직접 병합하면 층위가 섞이는 상태 | 원천 문서를 유지하고 기준시대 객관정보에는 참조와 변환 규칙만 둔다. |

## 자연오버레이 통합상태

| 원천 항목 | 상태 | 기준시대 객관정보 대응 ID | 현재 흡수 내용 | 남은 처리 |
|---|---|---|---|---|
| 문서 역할·ERA-DELTA-5083 총괄 | 별도 닻 유지 | `CK5083-WORLD-NATURAL-ANCHOR-001`, `CK5083-AST-BASELINE-001` | 5083 자연 상태가 별도 선택값이며 인물 발화가 아니라는 원칙은 반영됨 | 자연오버레이 파일을 계속 기준 닻으로 유지 |
| 5083 자연상태 빠른 색인 | 흡수 완료 | `CK5083-WORLD-NATURAL-DOMAIN-MATRIX-001`, `CK5083-WORLD-NATURAL-OVERLAY-INDEX-001`, `CK5083-WORLD-NATURAL-QUICK-ROUTER-001` | 자연오버레이 빠른 색인이 기준시대 객관정보의 세부 ID와 낮은 표면으로 연결됨 | 자연오버레이 파일은 물리 닻으로 유지 |
| 권역별 자연 압력 초안 | 흡수 완료 | `CK5083-WORLD-NATURAL-PRESSURE-SURFACE-001`, `CK5083-WORLD-NATURAL-REGIONAL-ROUTER-001`, `CK5083-GEO-REGIONAL-ANCHOR-NODES-001`, `CK5083-SOC-REGIONAL-PROFILES-001`, `CK5083-ECO-REGIONAL-PROFILES-001`, `CK5083-INF-REGIONAL-PROFILES-001` | 북방, 농경, 항만, 남방, 숲, 초지, 화산권 압력이 대표 생활권·문서·권위층 검색표로 연결됨 | 세부 도시·기관은 장소권 확장 시 추가 |
| 표면·해수면·빙권 | 흡수 완료 | `CK5083-GEO-REGIONS-001`, `CK5083-WORLD-NATURAL-SURFACE-CROSSINDEX-001`, `CK5083-INF-NATURAL-LINKAGE-001`, `CK5083-LOC-GEO-ANCHOR-PLACE-LINKAGE-001` | 해안, 조간대, 산악 빙권, 극권 해빙이 장소·경제·질병·기록 표면으로 반영됨 | 자연오버레이 파일은 물리 닻으로 유지 |
| 기후·수권·해양 | 흡수 완료 | `CK5083-CAL-SEASONAL-NATURAL-ANCHORS-001`, `CK5083-ECO-NATURAL-LINKAGE-001`, `CK5083-INF-NATURAL-LINKAGE-001`, `CK5083-MED-NATURAL-LINKAGE-001` | 장터, 항로, 수리시설, 물맛, 질병, 저장 문제로 변환됨 | 현 단계에서는 유지 |
| 대기·해양 화학 | 흡수 완료 | `CK5083-WORLD-NATURAL-SURFACE-CROSSINDEX-001`, `CK5083-MED-BIORESERVOIR-SURFACE-001`, `CK5083-MED-WATER-SANITATION-001`, `CK5083-LORE-GEO-ANCHOR-TRADITION-LINKAGE-001` | 저산소수, 독성 조류, 물맛, 냄새, 염류, 먼지·연기, 격리 표면이 장소·경제·질병 연결로 반영됨 | 객관 화학값은 자연오버레이와 마스터 객관정보에 유지 |
| 생물권·생태구 | 흡수 완료 | `CK5083-WORLD-NATURAL-SURFACE-CROSSINDEX-001`, `CK5083-GEO-ECOZONE-HABITAT-001`, `CK5083-MED-GEO-ANCHOR-CARE-001`, `CK5083-ECO-RESOURCE-FLOWS-001` | 성숙 생물권, 비지성 먹이망, 생태구 경계가 식량, 약초, 해충, 가축, 질병, 장소 갈등 표면으로 반영됨 | 종족·인물 설정은 후속 인물 단계에서만 파생 |
| 판구조·자원·자연재해 | 흡수 완료 | `CK5083-TEC-NATURAL-MATERIAL-LINKAGE-001`, `CK5083-ECO-LIFECYCLE-001`, `CK5083-CRS-NATURAL-LINKAGE-001`, `CK5083-SEC-NATURAL-LINKAGE-001` | 광상, 제련, 재해권, 병참·기술 실패로 변환됨 | 현 단계에서는 유지 |
| 천문·우주기상·계절 | 흡수 완료 | `CK5083-AST-EVENT-INSTANCE-RULE-001`, `CK5083-AST-SKY-DISTURBANCES-001`, `CK5083-CAL-SEASONAL-NATURAL-ANCHORS-001`, `CK5083-LORE-RUMOR-PROPHECY-SURFACE-001` | 하늘 이상, 장주기 사건, 달력·징조·전승 제한선은 반영됨 | 별도 사건 인스턴스가 생기기 전까지 추가 병합하지 않음 |
| 국지 자연 변칙 적용 | 흡수 완료 | `CK5083-WORLD-LOCAL-EXCEPTION-RULE-001`, `CK5083-GEO-LOCAL-ANOMALY-EXCEPTION-001`, `CK5083-GEO-LOCAL-ANOMALY-TRANSLATION-001`, `CK5083-INF-LOCAL-OBSTACLE-SURFACE-001`, `CK5083-MED-REGIONAL-PROFILES-001` | `VIR-ANOM-01`~`05`가 소문, 직능 경험칙, 관청·신전 기록, 장소·경로 위험, 사건 승격 조건으로 반영됨 | 자연오버레이 파일은 물리 닻으로 유지 |
| 예외 플래그 | 별도 닻 유지 | `CK5083-AST-EVENT-INSTANCE-RULE-001`, `CK5083-CRS-THRESHOLD-ESCALATION-001`, `CK5083-WORLD-EVENT-INSTANCE-GATE-001` | 대형 사건은 별도 사건 인스턴스가 있을 때만 확정한다는 원칙이 반영됨 | 자연오버레이 파일에 유지 |
| 기준시대 객관정보 변환 규칙 | 흡수 완료 | `CK5083-WORLD-NATURAL-DOMAIN-MATRIX-001`, `CK5083-WORLD-CHATBOT-RESPONSE-MODE-001`, `CK5083-WORLD-SMALL-PERSON-SURFACE-001` | 객관 자연값을 인월드 지식으로 직접 내리지 않는 원칙이 반영됨 | 현 단계에서는 유지 |

## 사회문화 핵심정보 통합상태

| 원천 항목 | 상태 | 기준시대 객관정보 대응 ID | 현재 흡수 내용 | 남은 처리 |
|---|---|---|---|---|
| 문서 역할·운용 원칙 | 흡수 완료 | `CK5083-WORLD-SCOPE-001`, `CK5083-WORLD-LAYER-SEPARATION-001`, 빠른 색인 | 기준시대 객관정보와 사회문화 핵심정보의 관계가 명시됨 | 원천 문서는 누락 대조용으로 유지 |
| 핵심정보 빠른 색인 | 흡수 완료 | 기준시대 객관정보 빠른 색인 | NOM, CAL, GEO, SOC, POL, LAW, CIV, LOC, LORE가 모두 본문 색인에 연결됨 | 현 단계에서는 유지 |
| 5083 사회문화 핵심 구조 | 흡수 완료 | `CK5083-GEO-REGIONS-001`, `CK5083-POL-STATES-001`, `CK5083-SOC-REGIONAL-PROFILES-001`, `CK5083-SOC-NONTIRIS-DAILY-SURFACES-001`, `CK5083-SOC-REGIONAL-VALUE-MATRIX-001` | 주요 국가·권역의 구조, 가치관, Tiris 외 일상 표면이 반영됨 | 세부 도시·하위 기관은 장소권 확장 시 추가 가능 |
| Tiris 서부 접경 핵심 결절 | 흡수 완료 | `CK5083-POL-TIRIS-001`, `CK5083-GEO-REGIONAL-ANCHOR-NODES-001`, `CK5083-LOC-TIRIS-ESTATES-001`, `CK5083-LOC-TIRIS-LOW-SURFACES-001` | Silverkeep, Ravenstone, Greenhollow, Newhollow, Windwatch, Sunspire, Brightwater, Ironford가 장소·정치·생활 표면으로 흡수됨 | 현 단계에서는 유지 |
| NOM. Vireth, Arcadia, Arcadian Sphere | 흡수 완료 | `CK5083-NOM-CORE-TERMS-001`, `CK5083-NOM-CANON-PROMOTION-001`, `CK5083-NOM-CIV-LINKAGE-001` | 명칭 층위, 정본명, 브리지 라벨, 병기명이 정리됨 | 현 단계에서는 유지 |
| CAL. 문화권별 달력 주기 | 흡수 완료 | `CK5083-CAL-CALENDAR-USE-001`, `CK5083-CAL-DATE-AUTHORITY-001`, `CK5083-CAL-SEASONAL-NATURAL-ANCHORS-001` | 문화권별 주기와 사회적 날짜 권위가 반영됨 | 세부 명절은 필요 시 별도 확장 |
| GEO. Arcadian Sphere 권역 분포 | 흡수 완료 | `CK5083-GEO-REGIONS-001`, `CK5083-GEO-REGIONAL-ANCHOR-NODES-001`, `CK5083-GEO-KNOWLEDGE-LAYERS-001` | 권역·접근성·통용 지리층이 반영됨 | 현 단계에서는 유지 |
| GEO. 종족 분포 최소 기준 | 흡수 완료 | `CK5083-GEO-SPECIES-001`, `CK5083-SOC-SPECIES-COHABITATION-001`, `CK5083-SOC-SPECIES-INTERNAL-SURFACES-001`, `CK5083-CIV-SPECIES-LANGUAGE-GATE-001`, `CK5083-LAW-SPECIES-STATUS-001` | 종족 외명, 공존, 내부 생활 표면, 법적 처리, 언어 처리 기준이 반영됨 | 전승권 종족은 별도 사건·장소 확장 시 낮은 생활 표면으로 전환 |
| POL. 국가·정치 지형 | 흡수 완료 | `CK5083-POL-STATES-001`, `CK5083-POL-GEO-ANCHOR-AUTHORITY-001`, `CK5083-POL-REGIONAL-COMMONER-AUTHORITY-001`, `CK5083-POL-SUBINSTITUTION-CITY-SURFACE-001`, `CK5083-SOC-NONTIRIS-DAILY-SURFACES-001` | 국가별 정치 구조, 소시민 접점, Tiris 외 주요 국가의 일상 표면, 국가별 하위 도시·기관 접점이 반영됨 | 개별 도시·기관명은 장소권·역사 단계에서 세분 가능 |
| POL. Tiris와 서부 접경 | 흡수 완료 | `CK5083-POL-TIRIS-001`, `CK5083-POL-POPULATION-STATUS-001`, `CK5083-CRS-EVACUATION-RELIEF-001`, `CK5083-LOC-TIRIS-LOW-SURFACES-001` | 접경 정치, 피난민 지위, 장소 표면까지 반영됨 | 현 단계에서는 유지 |
| LAW. 국가별 신앙과 사법 | 흡수 완료 | `CK5083-LAW-FAITH-001`, `CK5083-LAW-GEO-ANCHOR-JURISDICTION-001`, `CK5083-LAW-INSTITUTION-FIRST-CONTACT-001` | 신앙·사법·기관명·첫 접촉 표면까지 반영됨 | 현 단계에서는 유지 |
| LAW. Tiris 낮은 율례 | 흡수 완료 | `CK5083-LAW-LOW-CODE-001`, `CK5083-LAW-PUBLIC-RECEPTION-001`, `CK5083-LORE-SYMBOLS-001` | 낮은 율례의 성격, 조항, 법감정과 전승 연결이 반영됨 | 현 단계에서는 유지 |
| CIV. 언어와 기록 체계 | 흡수 완료 | `CK5083-CIV-LANGUAGE-RECORDS-001`, `CK5083-CIV-SCRIBAL-GENERATION-001`, `CK5083-CIV-SCRIBAL-LEXICON-001`, `CK5083-CIV-REGIONAL-LANGUAGE-001` | 공용서기어, 지역어, 문자, 문해력, 기록층이 대폭 반영됨 | 현 단계에서는 유지 |
| CIV. 세계 생성과 문명 준동 요약 | 별도 닻 유지 | `CK5083-CIV-LONG-MEMORY-001` | 긴 배경은 최소 요약으로 반영됨 | 상세 자연사·역사는 객관정보 정본 또는 역사 문서에 유지 |
| LOC. 주요 장소 | 흡수 완료 | `CK5083-LOC-MAJOR-PLACES-001`, `CK5083-LOC-NONTIRIS-ANCHORS-001`, `CK5083-LOC-TIRIS-ESTATES-001`, `CK5083-LOC-RAVENSTONE-SUBPLACES-001`, `CK5083-LOC-TIRIS-LOW-SURFACES-001` | 주요 장소와 하위 장소, Tiris 외 대표 장소권, 생활 표면이 반영됨 | 세부 시설명은 필요 시 장소권별로 확장 |
| LORE. 전승 경계 설정 | 흡수 완료 | `CK5083-LORE-TRADITIONS-001`, `CK5083-LORE-GEO-ANCHOR-TRADITION-LINKAGE-001`, `CK5083-LORE-SYMBOLS-001`, `CK5083-LORE-PROPHECY-FRAGMENTS-001` | 전승 항목, 사실화 금지선, 상징, 소문·예언 표면이 반영됨 | 현 단계에서는 유지 |

## 우선 보강 후보

| 우선순위 | 후보 | 이유 | 권장 작업 |
|---:|---|---|---|
| 1 | 자연오버레이 세부 대응 색인 | 자연오버레이 세부 항목과 기준시대 객관정보 ID의 연결이 1차 반영되었다. | `CK5083-WORLD-NATURAL-QUICK-ROUTER-001`을 기준으로 새 장소·직능 확장 때 자연 바닥값을 먼저 찾는다. |
| 2 | 권역별 자연 압력과 생활권 매칭 | 자연권 유형별 대표 생활권, 문서, 권위층, 낮은 표면이 1차 반영되었다. | `CK5083-WORLD-NATURAL-REGIONAL-ROUTER-001`을 기준으로 권역별 생활권 확장 때 세부 장소를 붙인다. |
| 3 | 국가·정치 하위 기관의 개별명 확장 | 국가별 하위 도시·기관 접점은 정본에 들어갔다. 후속 장소권·역사 단계에서 개별 도시, 관청, 길드, 신전, 창고 이름을 늘릴 수 있다. | `CK5083-POL-SUBINSTITUTION-CITY-SURFACE-001`을 기준으로 개별 장소명과 기관명을 붙인다. |
| 4 | 종족 내부 사회 표면 | 공존 종족의 생활권, 직능, 이름층, 법적 접점이 1차 반영되었다. | `CK5083-SOC-SPECIES-INTERNAL-SURFACES-001`을 기준으로 인물관계 단계에서 개별 가구·장소·직능 사례를 파생한다. |
| 5 | 국지 자연 변칙 변환표 | `VIR-ANOM-01`~`05`의 기준시대 표면이 1차 반영되었다. | `CK5083-GEO-LOCAL-ANOMALY-TRANSLATION-001`을 기준으로 장소·사건 확장 때 지역 예외를 낮은 표면으로 붙인다. |

## 통합 판정

현재 단계에서 `사회문화 핵심정보`는 기준시대 객관정보에 흡수되었다. 남은 역할은 누락 대조와 후속 세분 순서 관리다. 반면 `자연오버레이`는 물리 선택값이므로 완전 병합 대상이 아니라 별도 닻으로 유지해야 한다. 기준시대 객관정보는 자연오버레이의 결론을 문화권, 직업군, 관청, 신전, 장소, 전승의 표면으로 변환한 결과만 담는다.

자연오버레이 항목은 기준시대 객관정보 안에서 1차 검색 경로와 생활 표면으로 모두 연결되었다. 자연오버레이 파일은 계속 물리 선택값의 별도 닻으로 유지한다. 다음 실제 보강은 사건·인물로 바로 들어가기 전에, 장소권과 하위 기관을 필요 단위별로 세분하거나 확정된 단락을 쉬운해설본으로 편집하는 작업이다.
