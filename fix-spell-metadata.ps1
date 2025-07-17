# PowerShell script to add required metadata to all compendium JSON files

# Define the metadata template
$metadataTemplate = @'
  "ownership": {
    "default": 0,
    "PLAYER": 2,
    "ASSISTANT": 3
  },
  "flags": {},
  "_stats": {
    "systemId": "dnd5e",
    "systemVersion": "3.3.1",
    "coreVersion": "12.331",
    "createdTime": 1736445600000,
    "modifiedTime": 1736445600000,
    "lastModifiedBy": "martyrmodule"
  },
  "folder": null
'@

# Read the spells database to get IDs and sort orders
$spellsDb = Get-Content "packs\spells\_db.json" | ConvertFrom-Json

# Process each spell file
foreach ($entry in $spellsDb.entries) {
    $filename = "$($entry._id).json"
    $filepath = "packs\spells\$filename"
    
    if (Test-Path $filepath) {
        Write-Host "Processing $filename..."
        
        # Read the file content
        $content = Get-Content $filepath -Raw
        
        # Remove the closing brace and any trailing whitespace
        $content = $content.TrimEnd().TrimEnd('}').TrimEnd()
        
        # Add the metadata and new closing brace
        $newContent = @"
$content,
$metadataTemplate,
  "sort": $($entry.sort),
  "_id": "$($entry._id)"
}
"@
        
        # Write back to file
        Set-Content $filepath $newContent -NoNewline
    }
    else {
        Write-Warning "File not found: $filepath"
    }
}

Write-Host "Spell files updated successfully!"
