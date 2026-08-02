param(
    [string]$HtmlPath = (Join-Path $PSScriptRoot '..\index.html')
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'public_region_contract.ps1')

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

function Assert-NotContains {
    param(
        [string]$Pattern,
        [string]$Message
    )

    if ($html -match $Pattern) {
        $failures.Add($Message)
    }
}

$regions = @(
    '레오니아', '노르가르드', '티리스', '린레네트', '벡도레트',
    '센할레트', '헤스페레트', '켈나베트', '헤스베케트', '옌메베트',
    '님나레트', '실니메트', '아르도레트', '가르메베트', '실할레트',
    '메르할레트', '님소레트', '실바니아', '드래곤스파이어', '펜리르의 눈'
)

foreach ($region in $regions) {
    Assert-Contains -Pattern ('["'']' + [regex]::Escape($region) + '["'']\s*:\s*["''][^"'']+["'']') -Message "권역 종족 설명 누락: $region"
}

$regionMatch = [regex]::Match($html, 'const\s+regions\s*=\s*\[(?<body>[\s\S]*?)\];\s*const\s+regionFacts')
if (-not $regionMatch.Success) {
    $failures.Add('권역 데이터 블록 누락')
}
else {
    $requiredRegionFields = @{
        name = 1
        type = 1
        short = 12
        first = 12
        places = 12
        life = 12
        pressure = 12
        memory = 12
        persona = 12
    }
    $regionErrors = Test-JavaScriptNamedObjectContract `
        -Block $regionMatch.Groups['body'].Value `
        -ExpectedNames $regions `
        -RequiredFields $requiredRegionFields
    foreach ($regionError in $regionErrors) {
        $failures.Add($regionError)
    }
}

$factsMatch = [regex]::Match($html, 'const\s+regionFacts\s*=\s*\{(?<body>[\s\S]*?)\};\s*const\s+regionIconNames')
if (-not $factsMatch.Success) {
    $failures.Add('권역 생활 정보 블록 누락')
}
else {
    $factErrors = Test-JavaScriptKeyedObjectContract `
        -Block $factsMatch.Groups['body'].Value `
        -ExpectedKeys $regions `
        -RequiredFields @('money', 'people', 'time', 'history')
    foreach ($factError in $factErrors) {
        $failures.Add($factError)
    }
}

Assert-Count -Pattern '"capitalName":\s*"[^"]+"' -Expected 20 -Message '권역 대표 거점 20개 불일치'
Assert-Count -Pattern 'class="region-fact"' -Expected 7 -Message '권역 기사 정보 일곱 묶음 불일치'

$readerBlock = [regex]::Match($html, 'const readerSections = \[(?<body>[\s\S]*?)\];\s*const readerIconNames').Groups['body'].Value
$readerCount = [regex]::Matches($readerBlock, 'title:\s*"(나라와 권역|종족과 문화|도시와 마을|돈과 물건|달력과 계절|역사와 소문)"').Count
if ($readerCount -ne 6) {
    $failures.Add("세계 읽기 여섯 묶음 불일치 (expected=6 actual=$readerCount)")
}

$detailLabels = @('어떤 땅인가', '수도와 주요 도시', '사람과 종족', '돈과 장터', '달력과 계절', '역사와 현재', '여행의 시작')
$detailFunctionStart = $html.IndexOf('function renderRegionDetail')
if ($detailFunctionStart -lt 0) {
    $failures.Add('권역 상세 렌더러 누락')
}
else {
    $detailFunctionBlocks = @(Get-JavaScriptObjectBlocks -Text $html.Substring($detailFunctionStart))
    if ($detailFunctionBlocks.Count -eq 0) {
        $failures.Add('권역 상세 렌더러 본문 누락')
    }
    else {
        $detailLabelMatches = [regex]::Matches(
            $detailFunctionBlocks[0].Text,
            '<h4\b[^>]*>\s*(?<label>[^<]+?)\s*</h4>'
        )
        $actualDetailLabels = @($detailLabelMatches | ForEach-Object { $_.Groups['label'].Value.Trim() })
        if ($actualDetailLabels.Count -ne $detailLabels.Count) {
            $failures.Add("권역 상세 항목 수 불일치: expected=$($detailLabels.Count) actual=$($actualDetailLabels.Count)")
        }
        elseif ([string]::Join("`n", $actualDetailLabels) -cne [string]::Join("`n", $detailLabels)) {
            $failures.Add(
                "권역 상세 항목 순서 불일치: expected=$([string]::Join(' > ', $detailLabels)) actual=$([string]::Join(' > ', $actualDetailLabels))"
            )
        }
    }
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
Assert-Contains -Pattern '사건 당사자는 아니다' -Message '안내자 역할 경계 문구 누락'
Assert-Count -Pattern 'class="section-band' -Expected 4 -Message '전폭 섹션 밴드 네 개 불일치'
Assert-Contains -Pattern 'class="region-index"' -Message '권역 색인 누락'
Assert-Contains -Pattern 'class="region-index-shell"' -Message '권역 가로 슬라이더 셸 누락'
Assert-Contains -Pattern 'class="region-card-keywords"' -Message '권역 카드 핵심어 묶음 누락'
Assert-Count -Pattern 'class="region-index-control' -Expected 2 -Message '권역 슬라이더 이전·다음 버튼 불일치'
Assert-Contains -Pattern 'id="regionPosition"' -Message '권역 슬라이더 현재 위치 표시 누락'
Assert-Contains -Pattern 'regionGrid\.addEventListener\("keydown"' -Message '권역 슬라이더 방향키 조작 누락'
Assert-Contains -Pattern 'location\.hash\s*===\s*"#regions"' -Message '구형 권역 링크 첫 화면 복구 누락'
Assert-Contains -Pattern 'history\.replaceState' -Message '구형 권역 링크 주소 정리 누락'
Assert-Contains -Pattern 'class="region-article"' -Message '권역 기사 누락'
Assert-Contains -Pattern 'class="region-article-hero"' -Message '권역 전폭 대표 이미지 누락'
Assert-Contains -Pattern 'class="reader-chapter"' -Message '장 제목형 세계 읽기 누락'
Assert-Contains -Pattern '<strong class="reader-keyword">' -Message '세계 읽기 핵심어 강조 누락'
Assert-Contains -Pattern 'class="start-path"' -Message '무박스 플레이 유형 누락'
Assert-Count -Pattern '<section id="(?:regions|read|start|images)" class="section">' -Expected 0 -Message '구형 박스 섹션 잔존'
Assert-Contains -Pattern 'href="\./glossary\.html"' -Message '고유명사 검색 페이지 링크 누락'
Assert-Contains -Pattern 'class="nav-glossary"' -Message '고유명사 마지막 강조 메뉴 누락'
$navBlock = [regex]::Match($html, '<div class="nav-links">(?<body>[\s\S]*?)</div>')
if (-not $navBlock.Success) {
    $failures.Add('상단 내비게이션 블록 누락')
}
else {
    $navLinks = [regex]::Matches($navBlock.Groups['body'].Value, '<a\b[^>]*href="(?<href>[^"]+)"[^>]*>[\s\S]*?</a>')
    if ($navLinks.Count -eq 0 -or $navLinks[$navLinks.Count - 1].Groups['href'].Value -ne './glossary.html') {
        $failures.Add('고유명사 찾기가 상단 내비게이션의 마지막 메뉴가 아님')
    }
}
Assert-NotContains -Pattern '궁정, 기사, 납품 장부가 길을 여닫습니다' -Message '어색한 권역 소개 문장 잔존'

$politeCount = [regex]::Matches($html, '(?<!아)니다[\.?!]|세요[\.?!]|까요[\.?!]').Count
if ($politeCount -gt 20) {
    $failures.Add("공개 문체의 존댓말 종결 과다 (limit=20 actual=$politeCount)")
}

$glossaryPath = Join-Path (Split-Path -Parent $HtmlPath) 'glossary.html'
$glossaryDataPath = Join-Path (Split-Path -Parent $HtmlPath) 'glossary-canon-data.js'
if (-not (Test-Path -LiteralPath $glossaryPath)) {
    $failures.Add('고유명사 검색 페이지 파일 누락')
}
else {
    $glossary = Get-Content -Raw -LiteralPath $glossaryPath -Encoding UTF8
    foreach ($pattern in @('id="glossarySearch"', 'id="glossaryFilters"', 'id="glossaryResults"', 'aria-live="polite"', 'src="\./glossary-canon-data\.js"', 'VIRETH_CANON_GLOSSARY_ENTRIES')) {
        if ($glossary -notmatch $pattern) {
            $failures.Add("고유명사 검색 기능 누락: $pattern")
        }
    }

    if (-not (Test-Path -LiteralPath $glossaryDataPath)) {
        $failures.Add('최신 통합본 기반 고유명사 데이터 파일 누락')
    }
    else {
        $glossaryData = Get-Content -Raw -LiteralPath $glossaryDataPath -Encoding UTF8
        if ($glossaryData -notmatch 'Arcadia_비레스_세계관_DB_최종통합본_v1\.md') {
            $failures.Add('고유명사 데이터의 최신 통합본 출처 표기 누락')
        }
        $generatedEntryCount = [regex]::Matches($glossaryData, '"name"\s*:').Count
        if ($generatedEntryCount -lt 300) {
            $failures.Add("최신 통합본 고유명사 색인 수 부족 (minimum=300 actual=$generatedEntryCount)")
        }
    }
}

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

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Host "ERROR: $_" -ForegroundColor Red }
    exit 1
}

& (Join-Path $PSScriptRoot 'validate_public_copy.ps1') -IndexPath $HtmlPath -GlossaryPath $glossaryPath -GlossaryDataPath $glossaryDataPath
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Output "PUBLIC_SITE_VALIDATION_OK regions=$($regions.Count)"
exit 0
