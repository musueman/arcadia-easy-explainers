# Arcadia 기준시대 5083 자연 오버레이 v1

## 문서 역할

이 문서는 에덴포르트 서력 5083년의 실제 자연 상태를 `Arcadia_마스터_객관정보_정본_v1.md`에서 선택해 기록하는 기준시대 자연 오버레이다. 객관정보 정본은 물리·자연 원천이고, 이 문서는 그 원천값 중 5083년에 적용할 상태값만 고른다. 문화권 명칭, 신앙 해석, 정치 사건, 인물 발화는 `Arcadia_기준시대_5083_객관정보_v1.md`에서 다룬다.

| 항목 | 기준 |
|---|---|
| 문서 역할 | 기준시대 자연 오버레이 |
| 기준시대 | 에덴포르트 서력 5083년 |
| 오버레이 ID | `ERA-DELTA-5083` |
| 원천 객관정보 | `Arcadia_마스터_객관정보_정본_v1.md` |
| 기준 원칙 | 객관정보 정본의 물리값을 바꾸지 않고, 5083년에 적용할 자연 상태값만 선택한다. |
| 기준시대 객관정보 연결 | `Arcadia_기준시대_5083_객관정보_v1.md`는 이 문서의 자연 상태를 시대 사람들이 아는 말과 오해 체계로 변환한다. |
| 제외 범위 | 국가 경계, 문화권명, 종족 사회, 신앙 해석, 전쟁·재난 서사, 인물관계, LunaTalk 발화문 |

## 5083 자연상태 빠른 색인

이 색인은 5083년 자연 오버레이를 기준시대 객관정보로 옮길 때 먼저 확인할 실제 자연 조건이다. 아래 항목은 문화권명이나 인물 지식이 아니라, 그 시대의 사회·경제·질병·항로·재해가 놓이는 자연 바닥값이다.

| 자연권 | 5083 선택값 | 생활·제도에 남는 압력 | 기준시대 객관정보 연결 |
|---|---|---|---|
| 전역 표면 | 대륙·대양·주요 산맥·주요 판은 A0와 같은 안정 문명시대층 | 큰 지도 골격은 고정되지만 해안 저지대, 습지, 삼각주, 산악 통행은 지역값으로 달라진다. | GEO, INF, ECO, SEC |
| 평균 기후 | oceanic-stable, 지역적 건조대 확대와 폭풍로 이동 병존 | 평균은 온화해도 내륙 저장·물 관리·항만 위험·목축 이동이 권역별로 갈린다. | SOC, ECO, INF, CRS |
| 해안·해협 | sea level delta 0m, 조석은 normal이나 해협·내해에서 증폭 가능 | 같은 항구라도 조간대, 염습지, 난파 위험, 항로 시간이 다르게 작동한다. | CAL, INF, ECO, SEC |
| 하천·삼각주 | stable이나 일부 유역은 avulsing 또는 closed-basin | 농경지 비옥도, 수리 행정, 홍수, 공동 창고, 물권 분쟁의 자연 기반이 된다. | ECO, LAW, LOC, MED |
| 산악·고원 | 제한적 산악 빙권, 고산 자외선·적설·빙하호 위험 유지 | 산길 폐쇄, 목축 한계, 약초권, 관측소, 수도원, 고산병과 보존 기술을 만든다. | INF, MED, LAW, LOC |
| 건조대·폐쇄분지 | 건조권 말단의 염호·알칼리 분지·먼지 위험 활성 가능 | 소금·염류·독성 조류·물 부족·유목 이동·시장 날짜 변동으로 나타난다. | ECO, MED, CAL, CRS |
| 온대 농경권 | 성숙 생물권과 안정 대기, 생장기·휴면기 길이 뚜렷 | 곡물, 양모, 저장, 세금일, 노동일, 장터 주기, 겨울 보존 관습을 만든다. | SOC, ECO, CAL, POL |
| 습지·하구 | 산소 안정 전역값 아래 국지 저산소·독성 조류 가능 | 냄새, 물맛, 가축 반응, 격리 표식, 약초 불신, 장례 증가로 체감된다. | MED, LORE, LAW, LOC |
| 숲·초지 경계 | 생태구 안정이나 고산 피난처·해안 이동 가능 | 목재권, 사냥권, 목축권, 숲 금기, 경계 분쟁, 정착지 확장 한계를 만든다. | GEO, SOC, LAW, ECO |
| 열곡·화산·지열권 | 전역 quiet이나 판경계·섬호·열곡은 active-boundary | 광상, 온천, 유황수, 화산가스, 분화 기억, 제련·의례·금기 지대를 만든다. | TEC, ECO, MED, LORE |
| 극권·냉수권 | limited ice, 극권 해빙과 냉수 용승 유지 | 빙산, 차가운 폭풍, 원양 어장, 휴면 생물 방출, 외해 금기의 배경이 된다. | INF, ECO, MED, LORE |
| 하늘·우주기상 | Arion 활동 low, impact flux baseline, 사건 인스턴스 없음 | 평년의 하늘이 기본값이다. 극광, 혜성, 대형 플레어는 사건 문서 없이 확정하지 않는다. | AST, CAL, LORE, CRS |

### 5083 권역별 자연 압력 초안

| 권역 유형 | 자연 바닥값 | 우선 체감 요소 | 아직 확정하지 않는 것 |
|---|---|---|---|
| 북방 고위도·고산권 | 제한적 빙권, 긴 적설, 냉수·산악 바람 | 저장, 보온, 가축 이동, 산길 폐쇄, 무기·방어구 재료 접근 | 특정 왕국의 신앙 해석이나 종족 습성 |
| 온대 농경·영지권 | 안정 생장기, 하천·삼각주, 계절 홍수 | 곡물세, 양모, 장터, 공동 창고, 수리 행정, 피난민 수용 능력 | 특정 전쟁·기근·판결 사건 |
| 해양·항만권 | 조석 증폭 가능, 해류·안개·폭풍로 | 항만세, 해도, 선박 수리, 보험, 난파 소문, 항해 금기 | 외해 괴담의 사실 여부 |
| 남방 산악·약초권 | 고산 자외선, 계곡 수권, 생태구 경계 | 약초, 수도원, 관측, 산악 통행, 독성 식물·물맛 구분 | 특정 약초의 초자연 효능 |
| 숲·성림권 | 산림 생태구, 수분 경계, 목재권 | 숲 경계, 수목 의례, 사냥·채집, 목재 세금, 길 잃음 | 단일 숲 종족권이나 초자연 숲 의지 |
| 건조·초지·폐쇄분지권 | 물 부족, 염류, 먼지, 계절 이동 | 유목, 저장물, 물권, 염호, 이동력, 가축 질병 | 전역 사막화 또는 무한 방랑 문화 |
| 화산·열곡·섬호권 | active-boundary, 지열, 광상, 가스 위험 | 제련, 온천, 유황수, 분화 경보, 섬 항로 | 대형 분화 사건 발생 여부 |

## ERA-DELTA-5083. 자연 오버레이 총괄

| 항목 | 내용 |
|---|---|
| ID | ERA-DELTA-5083 |
| 계층 | 기준시대 자연 오버레이 |
| 기준 행성 | Vireth |
| 기준 epoch | `AST-EPOCH-A0` |
| 연결 객관 ID | `OBJ-VIR-ERA-DELTA-001`, `OBJ-VIR-ERA-DELTA-CONSTRAINTS-001` |
| 표면 기준 | `VIR-SURF-STATE-A0`와 같은 지성체 가능 핵심 표면창 |
| 자연 상태 성격 | 안정 문명시대층. 대륙·대양·주요 산맥·주요 판은 고정하고, 해안선·빙권·생태구·재해 위상만 지역값으로 조정한다. |
| 정밀도 | overview. 지역별 기준시대 객관정보 확장 시 regional로 높인다. |
| 예외 플래그 | 전역 예외 없음. 지역 사건은 별도 사건 인스턴스가 있을 때만 붙인다. |

| 시대 delta 필드 | 5083 선택값 | 근거 객관 ID | 판정 |
|---|---|---|---|
| `era_delta_id` | `ERA-DELTA-5083` | `OBJ-VIR-ERA-DELTA-001` | locked |
| `reference_epoch` | `AST-EPOCH-A0` | `OBJ-AST-EPOCH-001` | locked |
| `confidence_class` | locked, bounded, scenario-variable 혼합 | `OBJ-RULE-UNCERTAINTY-001` | 필드별 적용 |
| `uncertainty_class` | bounded-range, phase-window, local-model 혼합 | `OBJ-RULE-UNCERTAINTY-001` | 필드별 적용 |
| `time_span_vy` | 기준 연도 1 VY, 주변 자연 상태는 수십 VY 범위에서 연속 | `OBJ-CAL-TIME-001` | bounded |
| `era_time_offset_vy` | A0 기준점과 같은 문명시대 자연창으로 취급 | `OBJ-AST-EPOCH-001` | derived |
| `surface_state_id` | `VIR-SURF-STATE-A0` | `OBJ-VIR-SURFACE-001` | locked |
| `stellar_luminosity_stage` | stable | `OBJ-AST-STELLAR-LIFECYCLE-001` | locked |
| `arion_activity_phase` | low. 극대기는 사건 인스턴스가 있을 때만 적용 | `OBJ-AST-SPACEWEATHER-001` | phase-window |
| `moon_tide_phase_model` | Caelum-dominant, 지역별 double-enhanced 가능 | `OBJ-AST-MOON-SYSTEM-001` | derived |
| `tidal_range_class` | normal. 해협·내해·삼각주는 amplified-local 가능 | `OBJ-AST-MOON-SYSTEM-001`, `OBJ-VIR-HYDRO-001` | local-model |
| `season_reference` | `Ls` 0~360도. 특정 날짜 산출은 통용 달력에서 별도 처리 | `OBJ-CAL-SEASONS-001` | derived |
| `perihelion_season_offset` | A0 기준 보정 유지 | `OBJ-CAL-SEASONS-001` | derived |
| `local_anomaly_refs` | `[]`. 지역 오버레이에서만 `VIR-ANOM-##` 선택 | `OBJ-VIR-LOCAL-ANOMALY-001` | local-model |
| `stochastic_window_refs` | `[]`. 사건 오버레이에서만 선택 | `OBJ-AST-CYCLE-STOCHASTICITY-001` | stochastic-window |
| `exception_flags` | `[]` | `OBJ-VIR-ERA-DELTA-CONSTRAINTS-001` | bounded |
| `requires_event_instance` | false. 대형 천문·화산·충돌 사건에는 true | `OBJ-VIR-ERA-DELTA-CONSTRAINTS-001` | locked |
| `precision_class` | overview | `OBJ-RULE-CONSISTENCY-001` | locked |

5083 자연 오버레이는 A0 표면 기준을 그대로 역사 연도와 동일시하지 않는다. A0는 계산 기준점이고, 5083은 그 기준점 안에서 선택한 안정 문명시대 자연 상태다.

## 표면·해수면·빙권

| 항목 | 5083 선택값 | 연결 객관 ID | 기준시대 객관정보로 넘길 의미 |
|---|---|---|---|
| 전역 표면 골격 | `VIR-LAND-##`, `VIR-OCEAN-##`, 주요 `VIR-TERR-##`, 주요 `VIR-PLATE-##` 유지 | `OBJ-VIR-SURFACE-001`, `OBJ-VIR-TECTONICS-001` | 기준시대 지도와 권역명은 이 골격 위에 붙인다. |
| `sea_level_delta_m` | `0m`. 검산 범위는 `VMSL-A0` 대비 -5m~+5m | `OBJ-VIR-CRYOSPHERE-001` | 대륙 윤곽은 유지하고, 항만·습지·삼각주·조간대는 지역별로 달라진다. |
| `high_greenhouse_sea_level_delta_m` | 사용하지 않음 | `OBJ-VIR-ERA-DELTA-CONSTRAINTS-001` | 5083은 후기 고온실 예외 상태가 아니다. |
| `ice_volume_class` | limited | `OBJ-VIR-CRYOSPHERE-001` | 전역 빙하기가 아니며 극권·산악 빙권이 제한적으로 존재한다. |
| `coastline_state` | A0-like, minor-local | `OBJ-VIR-HYDRO-001`, `OBJ-VIR-CRYOSPHERE-001` | 연안 저지대, 내해, 조간대, 석호는 지역별 통용 지리에서 세부화한다. |
| 산악 빙권 | `VIR-ICE-02`, `VIR-ICE-03`, `VIR-ICE-06` 유지 | `OBJ-VIR-CRYOSPHERE-001` | 고산 통행, 빙하호, 눈길, 계절 홍수의 자연 기반이다. |
| 극권 빙권 | `VIR-ICE-01` 유지 | `OBJ-VIR-CRYOSPHERE-001` | 남극권 해빙, 빙산, 차가운 폭풍권의 자연 기반이다. |

## 기후·수권·해양

| 항목 | 5083 선택값 | 연결 객관 ID | 기준시대 객관정보로 넘길 의미 |
|---|---|---|---|
| `climate_state` | oceanic-stable. 지역적으로 dryland-expanded와 storm-track-shifted가 병존 | `OBJ-VIR-CLIMATE-001` | 5083은 온화한 평균 기후지만, 내륙 건조대·산악 기후·폭풍로가 뚜렷하다. |
| `hydro_route_state` | stable. 일부 내해·삼각주·폐쇄분지는 avulsing 또는 closed-basin | `OBJ-VIR-HYDRO-001` | 하천, 내해, 습지, 염호, 항만 가능지가 문화권별로 다르게 체감된다. |
| 주요 해류 | `VIR-CURR-01`~`VIR-CURR-08` A0 구조 유지 | `OBJ-VIR-HYDRO-001` | 항로, 안개, 어장, 폭풍로, 해안 습지의 물리 배경이다. |
| 주요 강 유역 | `VIR-BASIN-01`~`VIR-BASIN-08` 유지 | `OBJ-VIR-HYDRO-001` | 농경지, 항만, 수리 행정, 습지, 산악 홍수의 자연 기반이다. |
| 조석 증폭 | `VIR-ANOM-01`이 해협·내해·삼각주에서 활성 가능 | `OBJ-VIR-LOCAL-ANOMALY-001` | 평균 해수면이 안정되어도 해안 체감과 항로 조건은 지역별로 흔들린다. |
| 폐쇄분지 수권 | `VIR-ANOM-02`가 건조대·내해 말단에서 활성 가능 | `OBJ-VIR-LOCAL-ANOMALY-001` | 염류, 염호, 독성 조류, 건조 먼지의 지역 기반이다. |

## 대기·해양 화학

| 항목 | 5083 선택값 | 연결 객관 ID | 기준시대 객관정보로 넘길 의미 |
|---|---|---|---|
| `atmosphere_chemistry_state` | oxygen-stable | `OBJ-VIR-BIOGEOCHEM-001` | 복잡 육상 생태계와 지성체 문명이 유지 가능한 대기 상태다. |
| `ocean_redox_state` | oxygenated, 국지 anoxic-patchy 가능 | `OBJ-VIR-BIOGEOCHEM-001` | 일부 내해·하구·정체수역은 저산소·독성 조류 위험을 가진다. |
| `nutrient_flux_state` | balanced, 지역 runoff-enriched 또는 upwelling-enriched 가능 | `OBJ-VIR-BIOGEOCHEM-001` | 대륙붕, 하구, 용승 해역, 삼각주 생산성 차이를 만든다. |
| `carbonate_buffer_state` | stable, 폐쇄분지 alkaline-basin 가능 | `OBJ-VIR-BIOGEOCHEM-001` | 얕은 바다와 내해의 석회질 생태·염류 분포를 좌우한다. |
| `ozone_shield_state` | normal. 강한 우주기상 사건 때 일시 weakened 가능 | `OBJ-AST-SPACEWEATHER-COUPLING-001` | 고산·극권·건조대 자외선 스트레스의 배경이다. |

## 생물권·생태구

| 항목 | 5083 선택값 | 연결 객관 ID | 기준시대 객관정보로 넘길 의미 |
|---|---|---|---|
| `biosphere_recovery_state` | mature | `OBJ-VIR-EVOLUTION-001` | 5083은 표면 생물권이 회복기나 붕괴기가 아닌 성숙 상태다. |
| 연결 생물권 상태 | `VIR-BIOSTATE-07` | `OBJ-VIR-BIOSPHERE-001`, `OBJ-VIR-EVOLUTION-001` | 성숙 해양·육상 생물권과 복잡 먹이망이 기준이다. |
| `biome_shift_state` | stable, 지역 highland-refuge와 coastal-migration 가능 | `OBJ-VIR-BIOSPHERE-001` | 고산·해안·습지 생태구는 기후와 수권에 따라 지역 차이를 보인다. |
| 주요 생태구 | `VIR-BIOME-01`~`VIR-BIOME-12` 유지 | `OBJ-VIR-BIOSPHERE-001` | 문화권별 식량, 질병, 가축화 후보, 산림·초지·습지 이용의 자연 기반이다. |
| 생물학적 위험 저장소 | `VIR-BIORES-01`~`VIR-BIORES-06` 유지 | `OBJ-VIR-BIOSPHERE-001` | 하구, 정체수, 열대권, 염호, 해빙, 열수권의 질병·독성·저산소 위험 배경이다. |

## 판구조·자원·자연재해

| 항목 | 5083 선택값 | 연결 객관 ID | 기준시대 객관정보로 넘길 의미 |
|---|---|---|---|
| `tectonic_phase` | quiet. 판경계 지역만 active-boundary | `OBJ-VIR-TECTONICS-001` | 대륙 배치는 안정되지만 조산대, 섬호, 열곡, 해구의 재해·자원성은 지역값으로 살아 있다. |
| `resource_exposure_state` | exposed와 buried가 지역별 병존 | `OBJ-VIR-RESOURCE-001` | 광상, 석재, 점토, 염류, 지열, 비옥토의 지역 불균형을 만든다. |
| `hazard_phase` | baseline, 일부 권역 elevated | `OBJ-VIR-HAZARD-001` | 재해는 상시 배경 위험이며 특정 사건은 역사 문서에서 따로 기록한다. |
| 주요 재해권 | `VIR-HAZ-01`~`VIR-HAZ-11` 유지 | `OBJ-VIR-HAZARD-001` | 지진, 해일, 분화, 산사태, 홍수, 가뭄, 폭풍, 산불의 자연권을 제공한다. |
| `volcanic_max_vei` | VEI 6 대재난 가능, VEI 7 희귀, VEI 8 제외 | `OBJ-VIR-ERA-DELTA-001` | 기준시대에는 지도 골격을 바꾸지 않는 재해·퇴적·토양 사건으로만 쓴다. |
| `impact_class_m` | 10~50m급 가능, 140m급 매우 희귀, 1km급 제외 | `OBJ-AST-CYCLE-STOCHASTICITY-001` | 운석·충돌은 별도 사건 인스턴스가 없으면 배경 위험으로만 둔다. |

## 천문·우주기상·계절

| 항목 | 5083 선택값 | 연결 객관 ID | 기준시대 객관정보로 넘길 의미 |
|---|---|---|---|
| `impact_flux_class` | baseline | `OBJ-AST-LONG-CYCLES-001` | 5083 기본 상태는 혜성 폭풍기나 소행성대 불안정기 한가운데가 아니다. |
| `spaceweather_exposure_class` | normal. 사건 인스턴스가 있으면 auroral-expanded 또는 radiation-elevated | `OBJ-AST-SPACEWEATHER-001` | 극광, 자침 이상, 하늘빛 이상은 가능하나 전역 재난 기본값은 아니다. |
| `stochastic_window_refs` | `[]`. 필요 시 사건 오버레이에서 `OBJ-AST-CYCLE-STOCHASTICITY-001` 또는 `VIR-HAZ-##` 선택 | `OBJ-RULE-UNCERTAINTY-001` | 장주기 현상은 예언 날짜가 아니라 위험 창과 관측 이상으로만 변환한다. |
| `requires_event_instance` | false. 대형 플레어·대형 충돌·VEI 7급 분화는 true | `OBJ-VIR-ERA-DELTA-CONSTRAINTS-001` | 기준시대 객관정보가 특정 재난을 말하려면 별도 사건 문서가 필요하다. |
| 물리 계절 | 660 VD, 평균 사분기 약 165 VD | `OBJ-CAL-SEASONS-001` | 문화권별 달력은 이 물리년을 각자 다른 방식으로 분할한다. |
| 긴 계절 효과 | 생장기·휴면기·적설·해빙이 길게 누적 | `OBJ-CAL-SEASONS-001`, `OBJ-VIR-CRYOSPHERE-001` | 농경·목축·항해·산악 이동의 계절 체감이 강하다. |

## 국지 자연 변칙 적용

| 변칙 ID | 5083 적용 방식 | 연결 자연권 | 기준시대 객관정보 변환 방향 |
|---|---|---|---|
| `VIR-ANOM-01` | 해협, 내해, 삼각주, 석호에서 활성 가능 | `VIR-OCEAN-05`, `VIR-TERR-05`, `VIR-BASIN-02`, `VIR-BIOME-04` | 조수, 항만, 어업, 습지, 염분 경계의 지역 차이로 변환한다. |
| `VIR-ANOM-02` | 폐쇄분지와 건조대 말단에서 활성 가능 | `VIR-CLIM-03`, `VIR-BASIN-02`, `VIR-RES-05`, `VIR-BIORES-04` | 염호, 염류, 건조 먼지, 독성 조류, 휴면 생물 위험으로 변환한다. |
| `VIR-ANOM-03` | 고산·고원·건조 고지에서 활성 가능 | `VIR-CLIM-08`, `VIR-BIOME-11`, `VIR-ICE-02`, `VIR-ICE-03` | 고산병, 햇빛 금기, 산악 이동 위험, 약초·목축 한계로 변환한다. |
| `VIR-ANOM-04` | 열곡, 화산섬, 지열 호수, 해저 열수대에서 활성 가능 | `VIR-TERR-04`, `VIR-TERR-07`, `VIR-BASIN-06`, `VIR-BIOME-03` | 유황수, 지열, 화산가스, 독수, 광상·온천 전승의 자연 기반으로 변환한다. |
| `VIR-ANOM-05` | 극권 해빙 가장자리와 냉수 용승권에서 활성 가능 | `VIR-ICE-01`, `VIR-OCEAN-03`, `VIR-BIOME-10`, `VIR-BIORES-05` | 해빙, 빙산, 극권 어장, 휴면 생물 방출, 차가운 폭풍권으로 변환한다. |

## 예외 플래그

| 예외 플래그 | 5083 기본값 | 적용 조건 |
|---|---|---|
| `deep_ice_exception` | off | 별도 한랭 강제와 빙권 확장 사건이 필요하다. |
| `high_greenhouse_exception` | off | 5083은 후기 고온실·탄산염 완충 약화 상태가 아니다. |
| `large_eruption_exception` | off | VEI 7급 이상 또는 장기 열곡 분출 사건 인스턴스가 필요하다. |
| `impact_exception` | off | 실제 충돌 사건 인스턴스가 필요하다. |
| `local_tidal_amplification_exception` | off, 지역별 on 가능 | 해협·내해 형상과 쌍월 조석이 겹치는 지역에서만 적용한다. |
| `spaceweather_coupling_exception` | off | 대형 CME 방향성, 자기권 결합, 오존 회복 지연이 겹친 사건 인스턴스가 필요하다. |

## 5083 기준시대 객관정보 변환 규칙

| 객관 자연 상태 | 기준시대 객관정보에서 변환할 것 | 기준시대 객관정보에서 하지 않을 것 |
|---|---|---|
| 안정 문명시대층 | 사람들의 농경, 항해, 주거, 질병, 재해 기억, 달력 사용에 반영한다. | 현대 물리학 용어로 직접 설명하지 않는다. |
| A0-like 표면 골격 | 문화권별 지명, 권역, 항로, 영지, 산맥·하천 인식을 얹는다. | 객관 ID를 인물 발화처럼 쓰지 않는다. |
| 제한적 빙권 | 산악 이동, 저장, 계절 홍수, 해빙 위험, 극권 항로에 반영한다. | 전역 빙하기처럼 과장하지 않는다. |
| 국지 자연 변칙 | 지역별 속신, 직업군 경험칙, 관청 경보, 신전 의례로 변환한다. | 초자연 사실이나 특정 신의 직접 작용으로 확정하지 않는다. |
| 장주기 천문·우주기상 | 관측 이상, 장부, 징조표, 항해 경보, 의례 오차로 변환한다. | 객관 주기표를 예언이나 과학 지식처럼 말하지 않는다. |

이 문서는 5083 기준시대 객관정보의 자연 기반이다. 기준시대 객관정보는 이 자연 상태를 문화권, 직업군, 학술층, 관청, 신전의 지식 한계 안에서 다시 서술한다.
