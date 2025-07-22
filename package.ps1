# Simple Foundry VTT Module Packager
# Creates a ZIP file for module distribution

Write-Host "Packaging Foundry VTT Module..." -ForegroundColor Yellow

# Read module info
$moduleInfo = Get-Content "module.json" -Raw | ConvertFrom-Json
$moduleId = $moduleInfo.id
$outputFile = "$moduleId.zip"

Write-Host "Module: $($moduleInfo.title) v$($moduleInfo.version)"

# Remove old ZIP if it exists
if (Test-Path $outputFile) { 
    Remove-Item $outputFile -Force 
    Write-Host "Removed old ZIP file"
}

# Files and folders to include
$items = @("module.json", "README.md", "packs", "scripts", "styles", "templates", "lang", "docs", "macros")
$existingItems = $items | Where-Object { Test-Path $_ }

Write-Host "Including: $($existingItems -join ', ')"

# Create the ZIP
Compress-Archive -Path $existingItems -DestinationPath $outputFile -CompressionLevel Optimal

# Check result
if (Test-Path $outputFile) {
    $size = [Math]::Round((Get-Item $outputFile).Length / 1MB, 2)
    Write-Host "Created $outputFile ($size MB)" -ForegroundColor Green
} else {
    Write-Host "Failed to create ZIP file" -ForegroundColor Red
}
