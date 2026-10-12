# Deploys every site in a batch result file to its own Vercel project.
# Usage (PowerShell, from this folder):
#   powershell -ExecutionPolicy Bypass -File deploy-batch.ps1 runs\batches\<batch>.result.json
param([Parameter(Mandatory=$true)][string]$ResultFile)
# Native tools (pnpm/vercel) print their banner and progress to stderr. With 'Stop', Windows PowerShell
# turns that stderr into a terminating error, so use 'Continue' and check $LASTEXITCODE instead.
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
$settings = Get-Content (Join-Path $root 'settings.json') -Raw | ConvertFrom-Json
$scope = $settings.vercel_scope
if ($scope -like '<*') { Write-Host 'Set vercel_scope in settings.json first.' -ForegroundColor Red; exit 1 }
$sites = Get-Content (Join-Path $root $ResultFile) -Raw | ConvertFrom-Json
$dest = Join-Path $root ($ResultFile -replace '\.result\.json$', '.deployed.json')
# Keep earlier successful results so a failed run never erases a working URL.
$previous = @{}
if (Test-Path $dest) {
  foreach ($p in (Get-Content $dest -Raw | ConvertFrom-Json)) { if ($p.preview_url) { $previous[$p.id] = $p } }
}
$vercel = @('dlx', 'vercel@59.16.0')
$out = @()
foreach ($s in $sites) {
  $dir = Join-Path $root ("runs\quick\" + $s.id + "\site")
  $project = ("revamp-" + $s.id).ToLower()
  if ($project.Length -gt 90) { $project = $project.Substring(0, 90) }
  Write-Host "`n=== $($s.business.name) -> $project ===" -ForegroundColor Cyan
  Push-Location $dir
  try {
    # No pipes/redirects here: vercel link needs a real console, or it fails with 'IO error: not a terminal'.
    & pnpm @vercel link --yes --project $project --scope $scope
    if ($LASTEXITCODE -ne 0) { throw "vercel link failed (exit $LASTEXITCODE)" }
    $deployOut = & pnpm @vercel deploy --prod --yes --scope $scope
    if ($LASTEXITCODE -ne 0) { throw "vercel deploy failed (exit $LASTEXITCODE)" }
    $deployUrl = ($deployOut | Where-Object { $_ -match '^https://' } | Select-Object -Last 1)
    if (-not $deployUrl) { throw 'vercel deploy printed no URL' }
    $deployUrl = $deployUrl.Trim()
    # The deploy URL can be behind Vercel login; the first other alias is the public one (Vercel may shorten the project name).
    $inspect = & pnpm @vercel inspect $deployUrl --scope $scope 2>&1 | ForEach-Object { "$_" }
    $publicUrl = ($inspect | Select-String -Pattern 'https://\S+\.vercel\.app' -AllMatches |
      ForEach-Object { $_.Matches.Value } | Where-Object { $_ -ne $deployUrl } | Select-Object -First 1)
    if (-not $publicUrl) { throw "No public alias found for $deployUrl" }
    $out += [pscustomobject]@{ id = $s.id; name = $s.business.name; project = $project; deploy_url = $deployUrl; preview_url = $publicUrl }
    Write-Host "Deployed: $publicUrl" -ForegroundColor Green
    Write-Host "NEXT: enable Web Analytics at https://vercel.com/$scope/$project/analytics, then redeploy (see references/production.md)." -ForegroundColor Yellow
  } catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
    if ($previous.ContainsKey($s.id)) { $out += $previous[$s.id]; Write-Host "Kept previous URL: $($previous[$s.id].preview_url)" -ForegroundColor Yellow }
    else { $out += [pscustomobject]@{ id = $s.id; name = $s.business.name; project = $project; error = "$_" } }
  } finally { Pop-Location }
}
$out | ConvertTo-Json | Set-Content -Encoding UTF8 $dest
Write-Host "`nSaved URLs to $dest" -ForegroundColor Cyan
$out | Format-Table name, preview_url -AutoSize
Write-Host "`nPage views are NOT counted yet: enable Web Analytics on each project above, redeploy, then confirm /_vercel/insights/view returns 200 before any outreach." -ForegroundColor Yellow
