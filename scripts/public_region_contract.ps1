function Get-JavaScriptObjectBlocks {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    $blocks = [System.Collections.Generic.List[object]]::new()
    $depth = 0
    $start = -1
    $quote = [char]0
    $escaped = $false
    $inLineComment = $false
    $inBlockComment = $false

    for ($index = 0; $index -lt $Text.Length; $index++) {
        $character = $Text[$index]
        $next = if ($index + 1 -lt $Text.Length) { $Text[$index + 1] } else { [char]0 }

        if ($inLineComment) {
            if ($character -eq "`r" -or $character -eq "`n") {
                $inLineComment = $false
            }
            continue
        }

        if ($inBlockComment) {
            if ($character -eq '*' -and $next -eq '/') {
                $inBlockComment = $false
                $index++
            }
            continue
        }

        if ($quote -ne [char]0) {
            if ($escaped) {
                $escaped = $false
                continue
            }
            if ($character -eq '\') {
                $escaped = $true
                continue
            }
            if ($character -eq $quote) {
                $quote = [char]0
            }
            continue
        }

        if ($character -eq '/' -and $next -eq '/') {
            $inLineComment = $true
            $index++
            continue
        }
        if ($character -eq '/' -and $next -eq '*') {
            $inBlockComment = $true
            $index++
            continue
        }
        if ($character -eq '"' -or $character -eq "'" -or $character -eq '`') {
            $quote = $character
            continue
        }

        if ($character -eq '{') {
            if ($depth -eq 0) {
                $start = $index
            }
            $depth++
            continue
        }

        if ($character -eq '}') {
            if ($depth -eq 0) {
                throw "JavaScript object has an unmatched closing brace. index=$index"
            }
            $depth--
            if ($depth -eq 0) {
                $length = $index - $start + 1
                $blocks.Add([pscustomobject]@{
                    Start = $start
                    End = $index
                    Text = $Text.Substring($start, $length)
                })
                $start = -1
            }
        }
    }

    if ($depth -ne 0 -or $quote -ne [char]0 -or $inBlockComment) {
        throw 'JavaScript object block is not closed.'
    }

    return $blocks.ToArray()
}

function Get-JavaScriptStringPropertyMatches {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ObjectText,

        [Parameter(Mandatory = $true)]
        [string]$PropertyName
    )

    $property = [regex]::Escape($PropertyName)
    $pattern = '(?s)(?:^|[,{])\s*["'']?' + $property + '["'']?\s*:\s*(?:"(?<double>(?:\\.|[^"\\])*)"|''(?<single>(?:\\.|[^''\\])*)'')'
    return [regex]::Matches($ObjectText, $pattern)
}

function Get-JavaScriptStringPropertyValue {
    param(
        [Parameter(Mandatory = $true)]
        [System.Text.RegularExpressions.Match]$Match
    )

    if ($Match.Groups['double'].Success) {
        return $Match.Groups['double'].Value
    }
    return $Match.Groups['single'].Value
}

function Get-JavaScriptKeyedObjectBlocks {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    $entries = [System.Collections.Generic.List[object]]::new()
    $objects = @(Get-JavaScriptObjectBlocks -Text $Text)
    $previousEnd = -1

    foreach ($object in $objects) {
        $prefixStart = $previousEnd + 1
        $prefixLength = $object.Start - $prefixStart
        $prefix = $Text.Substring($prefixStart, $prefixLength)
        $keyMatch = [regex]::Match(
            $prefix,
            '(?s)(?:"(?<double>(?:\\.|[^"\\])*)"|''(?<single>(?:\\.|[^''\\])*)''|(?<bare>[\p{L}_$][\p{L}\p{N}_$]*))\s*:\s*(?:(?://[^\r\n]*(?:\r?\n|$)|/\*.*?\*/)\s*)*$'
        )
        $key = if (-not $keyMatch.Success) {
            $null
        }
        elseif ($keyMatch.Groups['double'].Success) {
            $keyMatch.Groups['double'].Value
        }
        elseif ($keyMatch.Groups['single'].Success) {
            $keyMatch.Groups['single'].Value
        }
        else {
            $keyMatch.Groups['bare'].Value
        }

        $entries.Add([pscustomobject]@{
            Key = $key
            Text = $object.Text
            Start = $object.Start
            End = $object.End
        })
        $previousEnd = $object.End
    }

    return $entries.ToArray()
}

function Test-JavaScriptNamedObjectContract {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Block,

        [Parameter(Mandatory = $true)]
        [string[]]$ExpectedNames,

        [Parameter(Mandatory = $true)]
        [hashtable]$RequiredFields
    )

    $errors = [System.Collections.Generic.List[string]]::new()
    $objects = @(Get-JavaScriptObjectBlocks -Text $Block)
    $byName = @{}

    if ($objects.Count -ne $ExpectedNames.Count) {
        $errors.Add("region object count mismatch: expected=$($ExpectedNames.Count) actual=$($objects.Count)")
    }

    for ($index = 0; $index -lt $objects.Count; $index++) {
        $nameMatches = @(Get-JavaScriptStringPropertyMatches -ObjectText $objects[$index].Text -PropertyName 'name')
        if ($nameMatches.Count -eq 0) {
            $errors.Add("region object name missing: index=$index")
            continue
        }
        if ($nameMatches.Count -gt 1) {
            $errors.Add("region object name duplicate: index=$index actual=$($nameMatches.Count)")
            continue
        }

        $name = Get-JavaScriptStringPropertyValue -Match $nameMatches[0]
        if ($byName.ContainsKey($name)) {
            $errors.Add("region object duplicate: $name")
            continue
        }
        $byName[$name] = $objects[$index].Text
    }

    foreach ($name in $ExpectedNames) {
        if (-not $byName.ContainsKey($name)) {
            $errors.Add("region object missing: $name")
            continue
        }

        $objectText = $byName[$name]
        foreach ($field in $RequiredFields.Keys) {
            $matches = @(Get-JavaScriptStringPropertyMatches -ObjectText $objectText -PropertyName $field)
            if ($matches.Count -eq 0) {
                $errors.Add("region field missing: $name.$field")
                continue
            }
            if ($matches.Count -gt 1) {
                $errors.Add("region field duplicate: $name.$field actual=$($matches.Count)")
                continue
            }

            $value = Get-JavaScriptStringPropertyValue -Match $matches[0]
            $minimumLength = [int]$RequiredFields[$field]
            if ($value.Length -lt $minimumLength) {
                $errors.Add("region field too short: $name.$field minimum=$minimumLength actual=$($value.Length)")
            }
        }
    }

    foreach ($name in $byName.Keys) {
        if ($name -notin $ExpectedNames) {
            $errors.Add("unexpected region object: $name")
        }
    }

    return $errors.ToArray()
}

function Test-JavaScriptKeyedObjectContract {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Block,

        [Parameter(Mandatory = $true)]
        [string[]]$ExpectedKeys,

        [Parameter(Mandatory = $true)]
        [string[]]$RequiredFields
    )

    $errors = [System.Collections.Generic.List[string]]::new()
    $entries = @(Get-JavaScriptKeyedObjectBlocks -Text $Block)
    $byKey = @{}

    if ($entries.Count -ne $ExpectedKeys.Count) {
        $errors.Add("regionFacts object count mismatch: expected=$($ExpectedKeys.Count) actual=$($entries.Count)")
    }

    for ($index = 0; $index -lt $entries.Count; $index++) {
        $entry = $entries[$index]
        if ([string]::IsNullOrWhiteSpace($entry.Key)) {
            $errors.Add("regionFacts key parse failure: index=$index")
            continue
        }
        if ($byKey.ContainsKey($entry.Key)) {
            $errors.Add("regionFacts object duplicate: $($entry.Key)")
            continue
        }
        $byKey[$entry.Key] = $entry.Text
    }

    foreach ($key in $ExpectedKeys) {
        if (-not $byKey.ContainsKey($key)) {
            $errors.Add("regionFacts object missing: $key")
            continue
        }

        $objectText = $byKey[$key]
        foreach ($field in $RequiredFields) {
            $matches = @(Get-JavaScriptStringPropertyMatches -ObjectText $objectText -PropertyName $field)
            if ($matches.Count -eq 0) {
                $errors.Add("regionFacts field missing: $key.$field")
                continue
            }
            if ($matches.Count -gt 1) {
                $errors.Add("regionFacts field duplicate: $key.$field actual=$($matches.Count)")
            }
        }
    }

    foreach ($key in $byKey.Keys) {
        if ($key -notin $ExpectedKeys) {
            $errors.Add("unexpected regionFacts object: $key")
        }
    }

    return $errors.ToArray()
}
