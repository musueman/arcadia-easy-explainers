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
