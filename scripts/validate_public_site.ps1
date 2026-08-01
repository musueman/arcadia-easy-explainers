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

Assert-Count -Pattern '"capitalName":\s*"[^"]+"' -Expected 20 -Message '권역 대표 거점 20개 불일치'

$readerBlock = [regex]::Match($html, 'const readerSections = \[(?<body>[\s\S]*?)\];\s*const readerIconNames').Groups['body'].Value
$readerCount = [regex]::Matches($readerBlock, 'title:\s*"(나라와 권역|종족과 문화|도시와 마을|돈과 물건|달력과 계절|역사와 소문)"').Count
if ($readerCount -ne 6) {
    $failures.Add("세계 읽기 여섯 묶음 불일치 (expected=6 actual=$readerCount)")
}

$detailLabels = @(
    '어떤 나라·권역인가',
    '수도와 주요 도시',
    '사람과 종족',
    '돈과 장터',
    '달력과 계절',
    '남아 있는 역사와 소문',
    '여행자가 시작하기 좋은 장소'
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
Assert-Contains -Pattern 'loading="lazy"' -Message '지연 로딩 이미지 누락'
Assert-Contains -Pattern 'event\.key\s*===\s*"ArrowLeft"' -Message '이전 이미지 키보드 조작 누락'
Assert-Contains -Pattern 'event\.key\s*===\s*"ArrowRight"' -Message '다음 이미지 키보드 조작 누락'
Assert-Contains -Pattern 'aria-live="polite"' -Message '슬라이드 변경 알림 영역 누락'
Assert-Contains -Pattern 'ren-guide-full-cutout\.webp' -Message '렌 전신 누끼 안내자 이미지 누락'
Assert-Contains -Pattern 'duran-guide-full-cutout\.webp' -Message '듀란 상반신 누끼 안내자 이미지 누락'
Assert-Contains -Pattern '비레스를 먼저 걸으며 낯선 길과 사람의 기색을 읽어 온 여행자' -Message '렌 공개 소개 누락'
Assert-Contains -Pattern '붉은 망토를 두르고, 무너진 길에서도 사람을 지키려는 기사' -Message '듀란 공개 소개 누락'
Assert-Count -Pattern 'class="guide-profile' -Expected 2 -Message '렌·듀란 안내자 프로필 두 개 불일치'
Assert-Contains -Pattern 'data-lucide=' -Message '루시드 아이콘 체계 누락'
Assert-Contains -Pattern '사건 당사자는 아닙니다' -Message '안내자 역할 경계 문구 누락'
Assert-Count -Pattern 'class="region-card-scene"' -Expected 1 -Message '권역 카드 풍경 렌더러 누락'

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
