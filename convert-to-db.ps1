# Convert folder-based packs to single .db files for v13
Write-Host "Converting packs to .db files..."

$packFolders = @("classes", "class-features", "spells", "subclasses")

foreach ($folder in $packFolders) {
    $packPath = "packs\$folder"
    $dbFilePath = "packs\$folder.db"
    
    Write-Host "Processing $packPath -> $dbFilePath"
    
    # Read all individual JSON files
    $allItems = @()
    $jsonFiles = Get-ChildItem "$packPath\*.json" | Where-Object { $_.Name -ne "_db.json" }
    
    foreach ($file in $jsonFiles) {
        try {
            $content = Get-Content $file.FullName -Raw | ConvertFrom-Json
            $allItems += $content
            Write-Host "  Added $($content.name)"
        } catch {
            Write-Host "  ERROR reading $($file.Name): $($_.Exception.Message)"
        }
    }
    
    # Write to single .db file
    if ($allItems.Count -gt 0) {
        $allItems | ConvertTo-Json -Depth 20 | Out-File -FilePath $dbFilePath -Encoding UTF8
        Write-Host "  Created $dbFilePath with $($allItems.Count) items"
    }
}

Write-Host "Conversion complete!"
