# Installation Guide

## Installing the Martyr Class Module

### Method 1: Direct Download
1. Download the `dnd5e-martyr-class.zip` file from the releases
2. Open Foundry VTT and go to **Configuration** > **Add-on Modules**
3. Click **Install Module** at the bottom
4. Click **Browse** and select the downloaded ZIP file
5. Click **Install**

### Method 2: Module Browser (if available)
1. Open Foundry VTT and go to **Configuration** > **Add-on Modules**
2. Click **Install Module** at the bottom
3. Search for "Martyr Class" in the search bar
4. Click **Install** next to the module

### After Installation
1. Enable the module in your world's **Module Management**
2. The Martyr class and features will be available in compendium packs
3. You can now create Martyr characters using the class from the compendium

## First Time Setup

1. **Create a Character**: Make a new character and add the Martyr class
2. **Choose Starting Equipment**: The class provides starting equipment options
3. **Select Skills**: Choose 2 skills from the Martyr skill list
4. **At Level 3**: Choose your Mortal Devotion (Disciple of the Moon or Sun)
5. **Start Playing**: The module will automatically track your resources!

## Troubleshooting

**Module won't enable**: Make sure you're using Foundry VTT v11+ and D&D 5e system v3.0.0+

**Resources not tracking**: Check that the "Auto-calculate Vengeance/Mercy" setting is enabled in module settings

**Spells not appearing**: Make sure you've selected the Martyr class and are at least level 2

**Need help?**: Create an issue on the GitHub repository or ask in the Foundry VTT community
```
dnd5e-martyr-class/
├── module.json
├── scripts/
│   └── martyr-class.js
├── styles/
│   └── martyr.css
├── packs/
│   ├── class-features/
│   ├── spells/
│   └── subclasses/
└── README.md
```

## Features

### Core Mechanics
- **Vengeance Points** (Moon path): Gained when taking damage
- **Mercy Points** (Sun path): Gained when allies take damage
- **Blood Magic**: Spells that cost resource points instead of spell slots
- **Automatic Resource Tracking**: Points are calculated automatically when damage occurs

### Automation
- Automatic Vengeance point gain when Martyr takes damage
- Resource maximum calculation based on level × Constitution modifier
- Quick Blood Magic casting from character sheet
- Visual resource tracking on character sheets

### User Interface
- Custom resource display on character sheets
- Martyr control panel accessible from sheet header
- Quick Blood Magic spell buttons
- Visual feedback for resource expenditure

## Usage

### Setting Up a Martyr Character

1. **Create Character**: Start with a new character
2. **Add Class**: Drag the "Martyr" class from the compendium to your character
3. **Choose Path**: Add either "Disciple of the Moon" or "Disciple of the Sun" subclass at 3rd level
4. **Import Features**: Drag relevant class features from the compendium

### Resource Management

The module automatically tracks Vengeance/Mercy points:

- **Moon Path**: Points gained automatically when character takes damage
- **Sun Path**: Use the manual controls to add Mercy points when allies are damaged
- **Maximum**: Calculated as Martyr Level × Constitution Modifier
- **Spending**: Use the Martyr control panel or Blood Magic buttons

### Blood Magic Casting

1. **Via Control Panel**: Click the "Martyr" button in the character sheet header
2. **Quick Cast**: Use the Blood Magic buttons for common spells
3. **Manual**: Spend points manually and roll damage/effects

### Configuration

Access module settings via Configure Settings > Module Settings:

- **Auto-calculate Resources**: Toggle automatic Vengeance/Mercy point calculation
- **Resource Display**: Customize how resources appear on sheets

## Class Features by Level

| Level | Feature | Description |
|-------|---------|-------------|
| 1 | Vengeance/Mercy, Martyr's Insight | Resource system, skill proficiency |
| 2 | Double-Edged Blade, Spellcasting | Self-damage for bonus damage, Blood Magic |
| 3 | Mortal Devotion, Retribution | Choose Moon/Sun path, reaction ability |
| 4 | ASI | Ability Score Improvement |
| 5 | Exact Vengeance/Merciful Patience | Resource dump ability |
| 6 | Subclass Feature | Path-specific ability |
| 9 | Improved Sufferance | +1 resource point when gaining |
| 13 | Indomitable Presence | Mass taunt ability |
| 17 | Vindictive Divinity | Temporary divine power |
| 20 | Apocalyptic Affinity | Redirect damage from allies |

## Blood Magic Spells

### 1st Level (5-10 points)
- **Flesh Bolt**: Ranged necrotic attack with self-healing
- **Gabriel's Trumpet**: Cone area taunt with force damage
- **The Devil's Leverage**: Advantage on next attack, lose next reaction

### Higher Levels
- **Bloodreign** (3rd): Ongoing area damage outdoors
- **Absolution** (6th): Self-lightning damage, enemy force damage
- **Vindicate** (20th): Instant death to enemies who've dealt 50+ damage

## Troubleshooting

### Common Issues

**Resources not calculating automatically:**
- Check that "Auto-calculate Resources" is enabled in settings
- Ensure character has the Martyr class and appropriate subclass
- Verify Constitution modifier is correctly set

**Blood Magic not working:**
- Confirm you have sufficient Vengeance/Mercy points
- Check that the spell is from the Martyr compendium
- Use the manual spending option if automation fails

**Module not loading:**
- Verify all files are in the correct directory
- Check console for error messages
- Ensure D&D 5e system is up to date

### Manual Resource Management

If automatic tracking fails:
1. Click the "Martyr" button in character sheet header
2. Use "Add/Spend Points" controls
3. Track resources using the custom resource field

## Compatibility

- **Foundry VTT**: v11-12
- **D&D 5e System**: v3.0.0+
- **Other Modules**: Generally compatible, may conflict with other resource management modules

## Support

For issues or feature requests:
1. Check the troubleshooting section
2. Verify you're using supported versions
3. Report bugs with console error logs
4. Suggest improvements via GitHub issues

## Credits

Based on the custom Martyr class design, this module implements:
- Unique resource management system
- Blood Magic spellcasting
- Path-based progression (Moon/Sun)
- Automated damage tracking
- Custom UI elements

## Changelog

### Version 1.0.0
- Initial release
- Full Martyr class implementation
- Automated resource tracking
- Blood Magic spell compendium
- Custom UI controls
- Both subclass paths included