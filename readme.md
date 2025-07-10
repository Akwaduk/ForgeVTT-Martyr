# D&D 5e Martyr Class for Foundry VTT

A comprehensive implementation of the Martyr class for D&D 5e in Foundry VTT. The Martyr is a unique class that gains power through suffering, channeling either Vengeance (Path of the Moon) or Mercy (Path of the Sun) to fuel their blood magic abilities.

## Features

### Core Mechanics
- **Vengeance/Mercy Resource System**: Dynamic point system that responds to damage
- **Blood Magic Spellcasting**: Unique spells powered by Vengeance or Mercy points
- **Automated Resource Management**: Points automatically gained when taking/witnessing damage
- **Interactive UI**: Custom dialogs for managing resources and casting spells

### Class Features
- **Hit Die**: d10
- **Primary Ability**: Constitution (for resource maximum)
- **Spellcasting Ability**: Charisma (Moon) or Wisdom (Sun)
- **Saving Throws**: Constitution, Wisdom
- **Skills**: Choose 2 from Athletics, Intimidation, Medicine, Persuasion, Religion, Survival

### Subclasses
- **Disciple of the Moon**: Focuses on Vengeance, dealing damage and intimidating foes
- **Disciple of the Sun**: Focuses on Mercy, healing allies and providing protection

## Installation

1. Download the latest release from the [Releases](https://github.com/Akwaduk/ForgeVTT-Martyr/releases) page
2. Install the module through Foundry VTT's module manager
3. Enable the module in your world
4. The Martyr class and features will be available in compendium packs

## Usage

### Creating a Martyr Character

1. Create a new character and add the Martyr class from the compendium
2. At 3rd level, choose your Mortal Devotion (Disciple of the Moon or Sun)
3. The module will automatically track your Vengeance or Mercy points
4. Use the Martyr controls button in the character sheet header to manage resources

### Resource Management

**Vengeance Points (Path of the Moon)**:
- Gained when YOU take damage (½ damage taken, max 7 per turn)
- Used to fuel aggressive blood magic spells
- Spellcasting ability: Charisma

**Mercy Points (Path of the Sun)**:
- Gained when ALLIES within 30 feet take damage (reaction, ½ damage taken, max 7 per turn)
- Used to fuel healing and protective magic
- Spellcasting ability: Wisdom

### Blood Magic Spells

The Martyr doesn't use traditional spell slots. Instead, blood magic spells cost Vengeance or Mercy points:

#### Low-Level Spells (1st-3rd level)
- **Flesh Bolt** (5 Vengeance): Ranged necrotic attack that heals you
- **Gabriel's Trumpet** (10 Vengeance): Cone of force damage + taunt
- **Eagleheart** (10 Mercy): Heal up to 3 allies while taking damage yourself
- **Bloodreign** (10 Vengeance): Outdoor-only area of bloody rain

#### High-Level Spells (6th-9th level)
- **Absolution** (30 Vengeance): Take lightning damage to deal force damage to enemies
- **Vindicate** (120 Vengeance): Ultimate judgment spell that can instantly kill enemies

### Automated Features

The module automatically handles:
- Resource point calculation when damage is taken
- Maximum point calculation (Level × Constitution modifier)
- Resource reset on long rest
- Proximity checking for Sun Martyrs (ally damage within 30 feet)

## Key Class Features by Level

| Level | Feature |
|-------|---------|
| 1st | Vengeance/Mercy Resource, Martyr's Insight |
| 2nd | Double-Edged Blade, Martyr Spellcasting |
| 3rd | Mortal Devotion, Retribution |
| 5th | Exact Vengeance/Merciful Patience |
| 7th | Crimson Omen/Radiant Omen |
| 9th | Improved Sufferance |
| 10th | Blood and Thunder/Sacrifice and Atonement |
| 13th | Indomitable Presence |
| 14th | Improved Retribution |
| 17th | Vindictive Divinity |
| 20th | Apocalyptic Affinity |

## Subclass Features

### Disciple of the Moon
- **Bonus Proficiency**: Heavy armor
- **Hellbent**: Resist death using Vengeance points
- **Bane of Sisyphus**: Gain temporary HP when killing enemies
- **Impending Conviction**: Spend Vengeance for Intimidation bonuses
- **Burden of Existence**: Revive allies with Vengeance points
- **Aspect of Death**: Instant kill enemies with fewer HP than your Vengeance

### Disciple of the Sun
- **Bonus Proficiency**: Medicine skill
- **Undertaker's Sigh**: Stabilize dying allies at 1 HP
- **Cusp of Greatness**: Healed allies can move without opportunity attacks
- **Forgiveness**: Spend Mercy to charm attackers
- **Heaviest Matter of the Universe**: Create slowing light sphere
- **Radiant Intervention**: Absorb damage for allies

## Configuration

The module includes the following settings:

- **Auto-calculate Vengeance/Mercy**: Automatically calculate resource points when damage is taken (default: enabled)

## Compatibility

- **Foundry VTT**: v11+ (verified on v12)
- **D&D 5e System**: v3.0.0+
- **Modules**: Compatible with most common D&D 5e modules

## Building from Source

1. Clone the repository
2. Run `.\build-module.ps1` in PowerShell
3. Install the generated ZIP file in Foundry VTT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This module is released under the MIT License.

## Credits

- Custom class design and implementation
- Icons from game-icons.net and Foundry VTT
- Special thanks to the Foundry VTT community for development resources

## Changelog

### Version 1.0.0
- Initial release
- Complete Martyr class implementation
- Vengeance/Mercy resource system
- Blood magic spells
- Both subclasses (Moon and Sun)
- Automated resource management
- Interactive UI for resource control
Import compendium content to start using the class
Quick Start
Create a new character
Add the "Martyr" class from the compendium
At 3rd level, choose "Disciple of the Moon" or "Disciple of the Sun"
Use the Martyr control panel (header button) to manage resources
Cast Blood Magic spells using Vengeance/Mercy points
Core Mechanics
Resource System
Vengeance (Moon): Gain points = ½ damage taken (max 7/turn)
Mercy (Sun): Gain points = ½ ally damage witnessed (reaction, max 7/turn)
Maximum: Martyr Level × Constitution Modifier
Blood Magic Spells
No spell slots required
Powered by Vengeance/Mercy points
Unique spells like Flesh Bolt, Bloodreign, and Vindicate
Scales with character level and resource expenditure
Requirements
Foundry VTT v11+
D&D 5e System v3.0.0+
Compatibility
Works with most other modules. May have minor conflicts with other custom resource management systems.

Documentation
See the Installation Guide for detailed setup instructions and troubleshooting.

Support
Found a bug or have a suggestion? Please create an issue with:

Foundry and module versions
Steps to reproduce
Console error logs (if applicable)
This module implements a custom class design and is not affiliated with official D&D content.

