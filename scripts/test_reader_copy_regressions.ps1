param(
    [string]$IndexPath = (Join-Path $PSScriptRoot '..\index.html'),
    [string]$GlossaryPath = (Join-Path $PSScriptRoot '..\glossary.html'),
    [string]$GlossaryDataPath = (Join-Path $PSScriptRoot '..\glossary-canon-data.js')
)

$ErrorActionPreference = 'Stop'
$failures = [System.Collections.Generic.List[string]]::new()
$index = Get-Content -Raw -LiteralPath $IndexPath -Encoding UTF8
$readerPattern = 'const\s+readerSections\s*=\s*\[(?<body>[\s\S]*?)\];\s*const\s+readerIconNames'
$readerMatch = [regex]::Match($index, $readerPattern)

function Convert-UnicodeLiteral {
    param([string]$Value)

    return ConvertFrom-Json ('"' + $Value + '"')
}

if (-not $readerMatch.Success) {
    $failures.Add('Could not find the readerSections data block.')
}
else {
    $readerCopy = $readerMatch.Groups['body'].Value
    foreach ($escapedTerm in @(
        '\uC655\uC2E4 \uBC95\uC815 \uB300\uAE30\uD45C',
        '\uBB34\uAE30\uB97C \uB9E1\uACA8 \uBCF4\uAD00\uD45C',
        '\uBB34\uAE30\uACE0 \uBCF4\uAD00\uD45C',
        '\uBCF4\uAD00\uD45C\uAC00 \uC788\uC5B4\uB3C4',
        '\uBC30\uAE09 \uBAA9\uD328',
        '\uB4F1\uC815\uD45C',
        '\uB2E4\uC74C \uBC30\uAE09 \uC8FC\uAE30',
        '\uB2E4\uC74C \uAC1C\uBB38 \uC804\uAE4C\uC9C0 \uBB34\uAE30',
        '\uC5F4\uB78C\uD45C',
        '\uC120\uBC15 \uAC80\uC0AC\uD45C',
        '\uC7A5\uBE44 \uC810\uAC80\uD45C',
        '\uD654\uC0B0\uC11D \uBD09\uC778\uD45C'
    )) {
        $unsupportedTerm = Convert-UnicodeLiteral $escapedTerm
        if ($readerCopy -match [regex]::Escape($unsupportedTerm)) {
            $failures.Add("Unsupported reader procedure remains: $escapedTerm")
        }
    }

    $requiredTerm = Convert-UnicodeLiteral '660\uBE44\uB808\uC2A4\uC77C'
    $shortenedTerm = Convert-UnicodeLiteral '660\uC77C'
    $mutatedBody = $readerCopy.Replace($requiredTerm, $shortenedTerm)
    if ($mutatedBody -eq $readerCopy) {
        $failures.Add('Could not find the required calendar term in readerSections.')
    }
    else {
        $mutatedIndex = $index.Remove(
            $readerMatch.Groups['body'].Index,
            $readerMatch.Groups['body'].Length
        ).Insert(
            $readerMatch.Groups['body'].Index,
            $mutatedBody
        )
        $mutatedIndex = "<!-- required term outside readerSections: $requiredTerm -->`r`n$mutatedIndex"
        $tempIndex = Join-Path ([System.IO.Path]::GetTempPath()) (
            "vireth-reader-copy-{0}.html" -f [guid]::NewGuid().ToString('N')
        )

        try {
            [System.IO.File]::WriteAllText(
                $tempIndex,
                $mutatedIndex,
                [System.Text.UTF8Encoding]::new($false)
            )
            $validator = Join-Path $PSScriptRoot 'validate_public_copy.ps1'
            $validationOutput = & powershell -NoProfile -ExecutionPolicy Bypass `
                -File $validator `
                -IndexPath $tempIndex `
                -GlossaryPath $GlossaryPath `
                -GlossaryDataPath $GlossaryDataPath 2>&1
            $validationExitCode = $LASTEXITCODE
            $validationText = $validationOutput -join "`n"
            $expectedFailure = Convert-UnicodeLiteral (
                '\uC138\uACC4 \uC548\uB0B4 \uAD6C\uCCB4 \uC815\uBCF4 ' +
                '\uB204\uB77D: 660\uBE44\uB808\uC2A4\uC77C'
            )

            if (
                $validationExitCode -eq 0 -or
                $validationText -notmatch [regex]::Escape($expectedFailure)
            ) {
                $failures.Add(
                    'Required reader terms were satisfied outside readerSections.'
                )
            }
        }
        finally {
            Remove-Item -LiteralPath $tempIndex -Force -ErrorAction SilentlyContinue
        }
    }
}

$startBlock = [regex]::Match(
    $index,
    '<section id="start"[\s\S]*?</section>'
).Value
if ([string]::IsNullOrWhiteSpace($startBlock)) {
    $failures.Add('Could not find the start scene section.')
}
else {
    $validator = Join-Path $PSScriptRoot 'validate_public_copy.ps1'
    $firstChoice = Convert-UnicodeLiteral '\uCCAB \uC120\uD0DD'
    $nextChoice = Convert-UnicodeLiteral '\uB2E4\uC74C \uC120\uD0DD'
    $productionStatus = Convert-UnicodeLiteral (
        '\uC6F9\uD230\uC774 \uB354\uD574\uC9C0\uAE30 \uC804\uAE4C\uC9C0'
    )
    $firstChoiceMarkup = '<div class="start-choices"><b>' + $firstChoice + '</b>'
    $nextChoiceMarkup = '<div class="start-choices"><b>' + $nextChoice + '</b>'
    $placeholderMarkup = '<div class="start-placeholder">'
    $tempIndex = Join-Path ([System.IO.Path]::GetTempPath()) (
        "vireth-start-copy-{0}.html" -f [guid]::NewGuid().ToString('N')
    )

    try {
        $mutatedStartBlock = $startBlock.Replace(
            $firstChoiceMarkup,
            $nextChoiceMarkup
        )
        $mutatedStartBlock = $mutatedStartBlock.Replace(
            $placeholderMarkup,
            ($placeholderMarkup + $productionStatus + ' ')
        )
        $mutatedIndex = $index.Remove(
            $startBlock.Index,
            $startBlock.Length
        ).Insert(
            $startBlock.Index,
            $mutatedStartBlock
        )
        [System.IO.File]::WriteAllText(
            $tempIndex,
            $mutatedIndex,
            [System.Text.UTF8Encoding]::new($false)
        )
        $validationOutput = & powershell -NoProfile -ExecutionPolicy Bypass `
            -File $validator `
            -IndexPath $tempIndex `
            -GlossaryPath $GlossaryPath `
            -GlossaryDataPath $GlossaryDataPath 2>&1
        $validationExitCode = $LASTEXITCODE
        $validationText = $validationOutput -join "`n"

        foreach ($expectedFailure in @(
            (Convert-UnicodeLiteral '\uC2DC\uC791 \uC7A5\uBA74 \uC120\uD0DD\uC9C0 \uC5EC\uC12F \uBB36\uC74C \uBD88\uC77C\uCE58'),
            (Convert-UnicodeLiteral '\uC2DC\uC791 \uC7A5\uBA74 \uC81C\uC791 \uC0C1\uD0DC \uBB38\uAD6C \uC794\uC874')
        )) {
            if (
                $validationExitCode -eq 0 -or
                $validationText -notmatch [regex]::Escape($expectedFailure)
            ) {
                $failures.Add("Start scene validation missed: $expectedFailure")
            }
        }
    }
    finally {
        Remove-Item -LiteralPath $tempIndex -Force -ErrorAction SilentlyContinue
    }
}

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Host "ERROR: $_" -ForegroundColor Red }
    exit 1
}

Write-Host 'reader copy regression tests passed' -ForegroundColor Green
