param(
    [string]$HtmlPath = (Join-Path $PSScriptRoot '..\index.html')
)

$ErrorActionPreference = 'Stop'
$html = Get-Content -Raw -LiteralPath $HtmlPath -Encoding UTF8
$failures = [System.Collections.Generic.List[string]]::new()

function Assert-Contains {
    param(
        [string]$Pattern,
        [string]$Message
    )

    if ($html -notmatch $Pattern) {
        $failures.Add($Message)
    }
}

function Assert-Count {
    param(
        [string]$Pattern,
        [int]$Expected,
        [string]$Message
    )

    $actual = [regex]::Matches($html, $Pattern).Count
    if ($actual -ne $Expected) {
        $failures.Add("$Message (expected=$Expected actual=$actual)")
    }
}

$regions = @(
    '레오니아', '노르가르드', '티리스', '린레네트', '벡도레트',
    '센할레트', '헤스페레트', '켈나베트', '헤스베케트', '옌메베트',
    '님나레트', '실니메트', '아르도레트', '가르메베트', '실할레트',
    '메르할레트', '님소레트', '실바니아', '드래곤스파이어', '펜리르의 눈'
)

foreach ($region in $regions) {
    Assert-Contains -Pattern ('name:\s*"' + [regex]::Escape($region) + '"') -Message "권역 데이터 누락: $region"
    Assert-Contains -Pattern ('"' + [regex]::Escape($region) + '":\s*"[^"]+"') -Message "권역 종족 설명 누락: $region"
}

$regionBlock = [regex]::Match($html, 'const regions = \[(?<body>[\s\S]*?)\];\s*const regionFacts').Groups['body'].Value
foreach ($field in @('name', 'type', 'short', 'first', 'places', 'life', 'pressure', 'memory', 'persona')) {
    $count = [regex]::Matches($regionBlock, ([regex]::Escape($field) + ':\s*"[^"]+"')).Count
    if ($count -ne 20) {
        $failures.Add("권역 필드 20개 불일치: $field (expected=20 actual=$count)")
    }
}

$factsBlock = [regex]::Match($html, 'const regionFacts = \{(?<body>[\s\S]*?)\};\s*const regionIconNames').Groups['body'].Value
foreach ($field in @('money', 'people', 'time', 'history')) {
    $count = [regex]::Matches($factsBlock, ([regex]::Escape($field) + ':\s*"[^"]+"')).Count
    if ($count -ne 20) {
        $failures.Add("권역 생활 정보 20개 불일치: $field (expected=20 actual=$count)")
    }
}

Assert-Count -Pattern '"capitalName":\s*"[^"]+"' -Expected 20 -Message '권역 대표 거점 20개 불일치'
Assert-Count -Pattern 'class="region-fact"' -Expected 8 -Message '권역 기사 정보 여덟 항목 불일치'

$readerBlock = [regex]::Match($html, 'const readerSections = \[(?<body>[\s\S]*?)\];\s*const readerIconNames').Groups['body'].Value
$readerCount = [regex]::Matches($readerBlock, 'title:\s*"(나라와 권역|종족과 문화|도시와 마을|돈과 물건|달력과 계절|역사와 소문)"').Count
if ($readerCount -ne 6) {
    $failures.Add("세계 읽기 여섯 묶음 불일치 (expected=6 actual=$readerCount)")
}

$detailLabels = @(
    '이곳에서는 무엇이 길을 열까요?',
    '먼저 만나게 될 도시',
    '사람과 종족',
    '장터에서 값을 치르는 법',
    '길을 나서기 좋은 때',
    '사람들이 아직 기억하는 이야기',
    '어디서 이야기를 시작할까요?'
)

foreach ($label in $detailLabels) {
    Assert-Contains -Pattern ([regex]::Escape($label)) -Message "권역 상세 항목 누락: $label"
}

$species = @('페르브루니르', '실레니르', '메르세니르', '님소리르')
foreach ($name in $species) {
    Assert-Contains -Pattern ([regex]::Escape($name)) -Message "종족 설명 누락: $name"
}

$economyTerms = @('금표', '은량', '반은', '동각', '철각', '하루 품삯', '곡물 한 자루')
foreach ($term in $economyTerms) {
    Assert-Contains -Pattern ([regex]::Escape($term)) -Message "생활경제 설명 누락: $term"
}

Assert-Contains -Pattern 'id="start-situations"' -Message '시작상황 앵커 누락'
Assert-Count -Pattern '<details class="start-scenario">' -Expected 6 -Message '시작상황 여섯 항목 불일치'
Assert-Count -Pattern '<figure class="start-comic">' -Expected 3 -Message '시작 웹툰 세 항목 불일치'
Assert-Contains -Pattern '(?s)\.start-comic img\s*\{[^}]*aspect-ratio:\s*auto' -Message '세로 웹툰 원본 비율 복원 누락'
Assert-Contains -Pattern '(?s)\.start-comic img\s*\{[^}]*object-fit:\s*contain' -Message '세로 웹툰 잘림 방지 누락'
Assert-Contains -Pattern 'loading="lazy"' -Message '지연 로딩 이미지 누락'
Assert-Contains -Pattern 'event\.key\s*===\s*"ArrowLeft"' -Message '이전 이미지 키보드 조작 누락'
Assert-Contains -Pattern 'event\.key\s*===\s*"ArrowRight"' -Message '다음 이미지 키보드 조작 누락'
Assert-Contains -Pattern 'aria-live="polite"' -Message '슬라이드 변경 알림 영역 누락'
Assert-Contains -Pattern 'ren-guide-full-cutout\.webp' -Message '렌 전신 누끼 안내자 이미지 누락'
Assert-Contains -Pattern 'duran-guide-full-cutout\.webp' -Message '듀란 상반신 누끼 안내자 이미지 누락'
Assert-Contains -Pattern '\.guide-portrait\.ren img\s*\{' -Message '렌 원본 비율 개별 배치 누락'
Assert-Contains -Pattern '\.guide-portrait\.duran img\s*\{' -Message '듀란 원본 비율 개별 배치 누락'
Assert-Contains -Pattern '비레스를 먼저 걸으며 낯선 길과 사람의 기색을 읽어 온 여행자' -Message '렌 공개 소개 누락'
Assert-Contains -Pattern '붉은 망토를 두르고, 무너진 길에서도 사람을 지키려는 기사' -Message '듀란 공개 소개 누락'
Assert-Count -Pattern 'class="guide-profile' -Expected 2 -Message '렌·듀란 안내자 프로필 두 개 불일치'
Assert-Contains -Pattern 'data-lucide=' -Message '루시드 아이콘 체계 누락'
Assert-Contains -Pattern '사건 당사자는 아닙니다' -Message '안내자 역할 경계 문구 누락'
Assert-Count -Pattern 'class="section-band' -Expected 4 -Message '전폭 섹션 밴드 네 개 불일치'
Assert-Contains -Pattern 'class="region-index"' -Message '권역 색인 누락'
Assert-Contains -Pattern 'class="region-index-shell"' -Message '권역 가로 슬라이더 셸 누락'
Assert-Count -Pattern 'class="region-index-control' -Expected 2 -Message '권역 슬라이더 이전·다음 버튼 불일치'
Assert-Contains -Pattern 'id="regionPosition"' -Message '권역 슬라이더 현재 위치 표시 누락'
Assert-Contains -Pattern 'regionGrid\.addEventListener\("keydown"' -Message '권역 슬라이더 방향키 조작 누락'
Assert-Contains -Pattern 'class="region-article"' -Message '권역 기사 누락'
Assert-Contains -Pattern 'class="region-article-hero"' -Message '권역 전폭 대표 이미지 누락'
Assert-Contains -Pattern 'class="reader-chapter"' -Message '장 제목형 세계 읽기 누락'
Assert-Contains -Pattern 'class="start-path"' -Message '무박스 플레이 유형 누락'
Assert-Count -Pattern '<section id="(?:regions|read|start|images)" class="section">' -Expected 0 -Message '구형 박스 섹션 잔존'

$relativeSources = [regex]::Matches($html, '(?:src|href)="(\./[^"#?]+)"')
foreach ($match in $relativeSources) {
    $relative = $match.Groups[1].Value.Substring(2) -replace '/', [IO.Path]::DirectorySeparatorChar
    $target = Join-Path (Split-Path -Parent $HtmlPath) $relative
    if (-not (Test-Path -LiteralPath $target)) {
        $failures.Add("깨진 로컬 경로: $($match.Groups[1].Value)")
    }
}

$assetPaths = [regex]::Matches($html, '["''](\./viewer/assets/[^"'']+)["'']') |
    ForEach-Object { $_.Groups[1].Value } |
    Sort-Object -Unique
foreach ($source in $assetPaths) {
    $relative = $source.Substring(2) -replace '/', [IO.Path]::DirectorySeparatorChar
    $target = Join-Path (Split-Path -Parent $HtmlPath) $relative
    if (-not (Test-Path -LiteralPath $target)) {
        $failures.Add("깨진 동적 자산 경로: $source")
    }
}

$forbidden = @('객관정보', '정본', '검산', '운용부록', '실투입본', 'TODO', 'FIXME')
foreach ($term in $forbidden) {
    Assert-Contains -Pattern ('^(?![\s\S]*' + [regex]::Escape($term) + ')') -Message "공개 화면 금칙어 발견: $term"
}

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Host "ERROR: $_" -ForegroundColor Red }
    exit 1
}

Write-Output "PUBLIC_SITE_VALIDATION_OK regions=$($regions.Count)"
