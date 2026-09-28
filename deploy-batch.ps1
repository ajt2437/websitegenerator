# Deploys every site in a batch result file to its own Vercel project.
# Usage (PowerShell, from this folder):
#   powershell -ExecutionPolicy Bypass -File deploy-batch.ps1 runs\batches\<batch>.result.json
param([Parameter(Mandatory=$true)][string]$ResultFile)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$settings = Get-Content (Join-Path $root 'settings.json') -Raw | ConvertFrom-Json
$scope = $settings.vercel_scope
if ($scope -like '<*') { throw 'Set vercel_scope in settings.json first.' }
$sites = Get-Content (Join-Path $root $ResultFile) -Raw | ConvertFrom-Json
$out = @()
foreach ($s in $sites) {
  $dir = Join-Path $root ("runs\quick\" + $s.id + "\site")
  $project = ("revamp-" + $s.id).ToLower()
  if ($project.Length -gt 90) { $project = $project.Substring(0, 90) }
  Write-Host "`n=== $($s.business.name) -> $project ===" -ForegroundColor Cyan
  Push-Location $dir
  try {
    pnpm dlx vercel@59.16.0 link --yes --project $project --scope $scope | Out-Host
    $deployUrl = (pnpm dlx vercel@59.16.0 deploy --prod --yes --scope $scope | Select-Object -Last 1).Trim()
    $out += [pscustomobject]@{ id = $s.id; name = $s.business.name; project = $project; deploy_url = $deployUrl; production_url = "https://$project.vercel.app" }
    Write-Host "Deployed: $deployUrl" -ForegroundColor Green
  } catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
    $out += [pscustomobject]@{ id = $s.id; name = $s.business.name; project = $project; error = "$_" }
  } finally { Pop-Location }
}
$dest = Join-Path $root ($ResultFile -replace '\.result\.json$', '.deployed.json')
$out | ConvertTo-Json | Set-Content -Encoding UTF8 $dest
Write-Host "`nSaved URLs to $dest" -ForegroundColor Cyan
$out | Format-Table name, production_url -AutoSize
