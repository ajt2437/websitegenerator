# Downloads a template's stock images (listed in stock-images.json) and builds it once.
# Usage (PowerShell, from this folder):  powershell -ExecutionPolicy Bypass -File prepare-template.ps1 plumber
param([string]$Template = 'plumber')
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$dir = Join-Path $root "templates\$Template"
$images = Join-Path $dir 'public\images'
New-Item -ItemType Directory -Force $images | Out-Null
foreach ($img in (Get-Content (Join-Path $dir 'stock-images.json') -Raw | ConvertFrom-Json)) {
  $dest = Join-Path $images $img.file
  if (-not (Test-Path $dest)) {
    Write-Host "Downloading $($img.file)"
    Invoke-WebRequest -Uri $img.image -OutFile $dest -UseBasicParsing
  }
}
$env:PYTHONUTF8 = '1'
$py = if (Get-Command py -ErrorAction SilentlyContinue) { 'py' } else { 'python' }
$pyArgs = @()
if ($py -eq 'py') { $pyArgs += '-3' }
& $py @pyArgs tools\quick_site.py prepare --template $Template
if ($LASTEXITCODE -ne 0) { Write-Host "Prepare failed (exit $LASTEXITCODE)" -ForegroundColor Red; exit 1 }
Write-Host "Template '$Template' is ready." -ForegroundColor Green
