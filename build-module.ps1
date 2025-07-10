<#
Builds a Foundry VTT module ZIP.

• Creates <id>.zip, where <id> comes from module.json
• Puts *one* top-level folder (<id>/) inside the archive, as Foundry expects
#>

param(
  # override if you want a different filename
  [string]$Output
)

# --- read module id ----------------------------------------------------------
$id = (Get-Content module.json -Raw | ConvertFrom-Json).id
if (-not $Output) { $Output = "$id.zip" }

# --- working folder ----------------------------------------------------------
$temp    = Join-Path $env:TEMP ("fvtt_" + [guid]::NewGuid())
$rootDir = Join-Path $temp $id
New-Item $rootDir -ItemType Directory -Force | Out-Null

# --- files to include --------------------------------------------------------
$include = @(
  'module.json', 'readme.md',               # top-level
  'scripts', 'styles', 'packs', 'lang',     # common asset folders
  'templates', 'docs'                       # others—add/remove as needed
) | Where-Object { Test-Path $_ }

Copy-Item $include -Destination $rootDir -Recurse -Force

# --- zip it ------------------------------------------------------------------
if (Test-Path $Output) { Remove-Item $Output -Force }
Compress-Archive -Path "$rootDir\*" -DestinationPath $Output

# --- clean up ----------------------------------------------------------------
Remove-Item $temp -Recurse -Force
Write-Host "`n✅  Built $Output containing root folder $id\"
