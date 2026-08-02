param(
    [int]$Port = 0
)

$ErrorActionPreference = 'Stop'
$siteRoot = Split-Path -Parent $PSScriptRoot
$scenarios = @(
    @{
        Path = Join-Path $PSScriptRoot 'test_public_accessibility.playwright.js'
        Marker = 'PUBLIC_LIGHTBOX_ACCESSIBILITY_OK'
    },
    @{
        Path = Join-Path $PSScriptRoot 'test_carousel_accessibility.playwright.js'
        Marker = 'PUBLIC_CAROUSEL_ACCESSIBILITY_OK'
    },
    @{
        Path = Join-Path $PSScriptRoot 'test_responsive_contract.playwright.js'
        Marker = 'PUBLIC_RESPONSIVE_CONTRACT_OK'
    }
)
$sessionName = 'vireth-accessibility-' + [guid]::NewGuid().ToString('N')
$cliWorkDir = Join-Path ([IO.Path]::GetTempPath()) $sessionName
$server = $null
$browserOpened = $false
$locationPushed = $false

if ($Port -eq 0) {
    $listener = [System.Net.Sockets.TcpListener]::new(
        [System.Net.IPAddress]::Loopback,
        0
    )
    $listener.Start()
    $Port = ([System.Net.IPEndPoint]$listener.LocalEndpoint).Port
    $listener.Stop()
}

$baseUrl = "http://127.0.0.1:$Port"
$python = (Get-Command python -ErrorAction Stop).Source
$npx = (Get-Command npx.cmd -ErrorAction Stop).Source

try {
    New-Item -ItemType Directory -Path $cliWorkDir -Force | Out-Null
    $server = Start-Process `
        -FilePath $python `
        -ArgumentList @('-m', 'http.server', $Port, '--bind', '127.0.0.1') `
        -WorkingDirectory $siteRoot `
        -WindowStyle Hidden `
        -PassThru

    $serverReady = $false
    for ($attempt = 0; $attempt -lt 40; $attempt++) {
        try {
            $response = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/" -TimeoutSec 2
            if ($response.StatusCode -eq 200) {
                $serverReady = $true
                break
            }
        }
        catch {
            Start-Sleep -Milliseconds 250
        }
    }
    if (-not $serverReady) {
        throw "Local test server did not become ready at $baseUrl"
    }

    Push-Location -LiteralPath $cliWorkDir
    $locationPushed = $true
    $openOutput = & $npx --yes --package '@playwright/cli' playwright-cli `
        "-s=$sessionName" open "$baseUrl/" 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw ($openOutput -join "`n")
    }
    $browserOpened = $true

    foreach ($scenarioSpec in $scenarios) {
        $scenario = (
            Get-Content -Raw -LiteralPath $scenarioSpec.Path -Encoding UTF8
        ).Replace(
            '__BASE_URL__',
            $baseUrl
        )
        $scenario = (($scenario -split '\r?\n') | ForEach-Object {
            $_.Trim()
        }) -join ' '
        $encodedScenario = [Convert]::ToBase64String(
            [System.Text.Encoding]::ASCII.GetBytes($scenario)
        )
        $scenarioBootstrap = (
            'async page => { const d = "' + $encodedScenario +
            '"; const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; ' +
            'let s = ""; for (let i = 0; i < d.length; i += 4) { const x = ' +
            'a.indexOf(d[i]) * 262144 + a.indexOf(d[i + 1]) * 4096 + ' +
            'Math.max(0, a.indexOf(d[i + 2])) * 64 + ' +
            'Math.max(0, a.indexOf(d[i + 3])); ' +
            's += String.fromCharCode(Math.floor(x / 65536) % 256); ' +
            'if (d[i + 2] !== "=") s += String.fromCharCode(Math.floor(x / 256) % 256); ' +
            'if (d[i + 3] !== "=") s += String.fromCharCode(x % 256); } ' +
            'return (0, eval)(s)(page); }'
        )
        $scenarioArgument = $scenarioBootstrap.Replace('"', '\"')
        $testOutput = & $npx --yes --package '@playwright/cli' playwright-cli `
            "-s=$sessionName" run-code $scenarioArgument 2>&1
        $testText = $testOutput -join "`n"
        if (
            $LASTEXITCODE -ne 0 -or
            $testText -match '(?m)^### Error' -or
            $testText -notmatch [regex]::Escape($scenarioSpec.Marker)
        ) {
            throw ($testOutput -join "`n")
        }

        Write-Output $scenarioSpec.Marker
    }

    Write-Output 'PUBLIC_ACCESSIBILITY_PLAYWRIGHT_OK'
}
finally {
    if ($browserOpened) {
        & $npx --yes --package '@playwright/cli' playwright-cli `
            "-s=$sessionName" close *> $null
    }
    if ($server -and -not $server.HasExited) {
        Stop-Process -Id $server.Id -Force
        $server.WaitForExit()
    }
    if ($locationPushed) {
        Pop-Location
    }
    if (Test-Path -LiteralPath $cliWorkDir) {
        $resolvedCliWorkDir = (Resolve-Path -LiteralPath $cliWorkDir).Path
        $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
        if (-not $resolvedCliWorkDir.StartsWith(
            $tempRoot,
            [StringComparison]::OrdinalIgnoreCase
        )) {
            throw "Refusing to remove non-temp Playwright path: $resolvedCliWorkDir"
        }
        Remove-Item -LiteralPath $resolvedCliWorkDir -Recurse -Force
    }
}
