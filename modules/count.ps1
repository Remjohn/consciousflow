$files = Get-ChildItem "d:\Work\The Conscious Coaching Factory\docs\prd\modules\PRD_*.md"
foreach ($f in $files) {
    $c = [IO.File]::ReadAllText($f.FullName)
    $w = ($c -split '\s+' | Where-Object { $_.Length -gt 0 }).Count
    $status = if ($w -ge 4800 -and $w -le 5400) { "PASS" } elseif ($w -lt 4800) { "UNDER" } else { "OVER" }
    Write-Host "$($f.BaseName) : $w words [$status]"
}
