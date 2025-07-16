$packFolders = @("classes", "class-features", "spells", "subclasses")

foreach ($folder in $packFolders) {
    $dbPath = "packs\$folder\_db.json"
    if (Test-Path $dbPath) {
        Write-Host "Processing $dbPath"
        
        # Read the current _db.json
        $currentContent = Get-Content $dbPath -Raw | ConvertFrom-Json
        
        # Extract entries array or convert single object
        $entries = @()
        if ($currentContent.entries) {
            $entries = $currentContent.entries
        } elseif ($currentContent.name) {
            $entries = @($currentContent)
        }
        
        # Convert to proper v13 format
        $newEntries = @()
        foreach ($entry in $entries) {
            $newEntry = @{
                "_id" = $entry._id
                "name" = $entry.name
                "type" = $entry.type
                "sort" = $entry.sort
                "_stats" = @{
                    "systemId" = "dnd5e"
                    "systemVersion" = "3.0.0"
                    "coreVersion" = "13.291"
                    "createdTime" = 1735776000000
                    "modifiedTime" = 1735776000000
                    "lastModifiedBy" = "foundryuserid"
                }
            }
            $newEntries += $newEntry
        }
        
        # Write the new format
        $newEntries | ConvertTo-Json -Depth 10 | Out-File -FilePath $dbPath -Encoding UTF8
        Write-Host "Updated $dbPath"
    }
}

Write-Host "All _db.json files updated for Foundry v13 format"
