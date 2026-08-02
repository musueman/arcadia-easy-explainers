param(
    [string]$IndexPath = (Join-Path $PSScriptRoot '..\index.html'),
    [string]$GlossaryPath = (Join-Path $PSScriptRoot '..\glossary.html'),
    [string]$GlossaryDataPath = (Join-Path $PSScriptRoot '..\glossary-canon-data.js')
)

$ErrorActionPreference = 'Stop'
$index = Get-Content -Raw -LiteralPath $IndexPath -Encoding UTF8
$glossary = Get-Content -Raw -LiteralPath $GlossaryPath -Encoding UTF8
$glossaryData = Get-Content -Raw -LiteralPath $GlossaryDataPath -Encoding UTF8
$failures = [System.Collections.Generic.List[string]]::new()

$forbiddenPatterns = @{
    '추상 표현: 중요하다' = '중요하다'
    '추상 표현: 힘을 가진다' = '힘을 가진다'
    '추상 표현: 길을 연다' = '길을 연다'
    '추상 표현: 사람을 가른다' = '사람을 가른다'
    '일반 도시 설명' = '(수도 또는 중심 거점이다|주요 도시 또는 지역 거점이다)'
    '제작 상태 문구' = '(웹툰이 더해지기 전까지|자료를 모았다|감을 잡게 하는 자료)'
    '금칙 표현: 삶과 가까운 장면이 열린다' = '삶과 가까운 장면이 열린다'
    '금칙 표현: 감을 잡게 한다' = '감을 잡게 한다'
    '공개 제작 용어: 객관정보' = '객관정보'
    '공개 제작 용어: 정본' = '정본'
    '공개 제작 용어: DB' = '\bDB\b'
    '공개 제작 용어: 검산' = '검산'
    '공개 제작 용어: 운용부록' = '운용부록'
    '공개 제작 용어: 실투입본' = '실투입본'
    '공개 제작 용어: TODO' = '\bTODO\b'
    '공개 제작 용어: FIXME' = '\bFIXME\b'
}

$indexPublicCopy = [regex]::Replace(
    $index,
    '(?i)["''][^"'']*\bDB\b[^"'']*\.(?:svg|webp|png|jpg|jpeg|md|js)["'']',
    ''
)
$glossaryDataPublicCopy = [regex]::Replace(
    $glossaryData,
    '(?ms)^\s*/\* Generated.*?\*/\s*',
    ''
)
$glossaryDataPublicCopy = [regex]::Replace(
    $glossaryDataPublicCopy,
    '(?ms)window\.VIRETH_CANON_GLOSSARY_META\s*=\s*\{.*?\};\s*',
    ''
)
$publicCopy = $indexPublicCopy + "`n" + $glossary + "`n" + $glossaryDataPublicCopy

foreach ($entry in $forbiddenPatterns.GetEnumerator()) {
    if ($publicCopy -match $entry.Value) {
        $failures.Add($entry.Key)
    }
}

foreach ($term in @('금표', '20 은량', '동각', '1/12 은량', '비레스년', '660')) {
    if ($index -notmatch [regex]::Escape($term)) {
        $failures.Add("필수 구체 정보 누락: $term")
    }
}

foreach ($term in @(
    '비레스의 어느 길로 들어설까',
    '스무 권역이 스무 가지 삶을 품는다',
    '길을 나서기 전에 알아둘 것'
)) {
    if ($index -notmatch [regex]::Escape($term)) {
        $failures.Add("개편 제목 누락: $term")
    }
}

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Host "ERROR: $_" -ForegroundColor Red }
    exit 1
}

Write-Output 'PUBLIC_COPY_VALIDATION_OK'
exit 0
