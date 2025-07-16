# Script to rename pack files to match their _id values

$packFolders = @("classes", "class-features", "spells", "subclasses")

foreach ($folder in $packFolders) {
    $packPath = "packs\$folder"
    Write-Host "Processing $packPath"
    
    # Get all JSON files except _db.json
    $jsonFiles = Get-ChildItem "$packPath\*.json" | Where-Object { $_.Name -ne "_db.json" }
    
    foreach ($file in $jsonFiles) {
        try {
            # Read the JSON file
            $content = Get-Content $file.FullName -Raw | ConvertFrom-Json
            
            if ($content._id) {
                $expectedFileName = "$($content._id).json"
                $expectedPath = Join-Path $packPath $expectedFileName
                
                # Only rename if different
                if ($file.Name -ne $expectedFileName) {
                    Write-Host "  Renaming $($file.Name) to $expectedFileName"
                    Move-Item $file.FullName $expectedPath -Force
                } else {
                    Write-Host "  $($file.Name) already correctly named"
                }
            } else {
                Write-Host "  WARNING: $($file.Name) has no _id field"
            }
        } catch {
            Write-Host "  ERROR processing $($file.Name): $($_.Exception.Message)"
        }
    }
}

Write-Host "Filename alignment complete!"
