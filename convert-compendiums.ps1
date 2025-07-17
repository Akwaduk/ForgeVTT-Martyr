# PowerShell script to convert .db files to individual JSON files
# This converts Foundry VTT compendium data from old format to new format

function Convert-CompendiumDB {
    param(
        [string]$DbPath,
        [string]$OutputFolder
    )
    
    Write-Host "Converting $DbPath to $OutputFolder..."
    
    # Ensure output folder exists
    if (!(Test-Path $OutputFolder)) {
        New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null
    }
    
    # Read the .db file
    $content = Get-Content -Path $DbPath -Raw
    
    # Parse as JSON array
    $items = ConvertFrom-Json $content
    
    # Create individual files for each item
    $dbEntries = @()
    foreach ($item in $items) {
        $filename = "$($item._id).json"
        $filepath = Join-Path $OutputFolder $filename
        
        # Convert item to JSON with proper formatting
        $item | ConvertTo-Json -Depth 10 | Out-File -FilePath $filepath -Encoding UTF8
        
        Write-Host "  Created: $filename"
        
        # Create database entry
        $dbEntry = @{
            name = $item.name
            type = $item.type
            _id = $item._id
            sort = $item.sort
            ownership = $item.ownership
        }
        $dbEntries += $dbEntry
    }
    
    # Create _db.json file
    $dbContent = @{
        name = (Get-Item $OutputFolder).Name -replace '-', ' ' | ForEach-Object { (Get-Culture).TextInfo.ToTitleCase($_) }
        label = (Get-Item $OutputFolder).Name -replace '-', ' ' | ForEach-Object { (Get-Culture).TextInfo.ToTitleCase($_) }
        entries = $dbEntries
    }
    
    $dbPath = Join-Path $OutputFolder "_db.json"
    $dbContent | ConvertTo-Json -Depth 10 | Out-File -FilePath $dbPath -Encoding UTF8
    
    Write-Host "  Created: _db.json with $($items.Count) entries"
}

# Convert all compendium packs
Write-Host "Starting compendium conversion..."

# Class Features
if (Test-Path "packs/class-features.db") {
    Convert-CompendiumDB -DbPath "packs/class-features.db" -OutputFolder "packs/class-features"
}

# Classes
if (Test-Path "packs/classes.db") {
    Convert-CompendiumDB -DbPath "packs/classes.db" -OutputFolder "packs/classes"
}

# Spells
if (Test-Path "packs/spells.db") {
    Convert-CompendiumDB -DbPath "packs/spells.db" -OutputFolder "packs/spells"
}

# Subclasses
if (Test-Path "packs/subclasses.db") {
    Convert-CompendiumDB -DbPath "packs/subclasses.db" -OutputFolder "packs/subclasses"
}

Write-Host "Conversion complete!"
