# 🩸 D&D 5e – Martyr Class (Foundry VTT Module)

Adds a complete **Martyr** class to the D&D 5e system in Foundry VTT, built around a Vengeance / Mercy resource economy and Blood-Magic spell list.

---

## ✨ Features

|                           | Description |
|---------------------------|-------------|
| 🗡️ **Full 20-level Class** | Complete class with automated level progression and interactive features. |
| 🌙 **Path of the Moon**   | Vengeance-based subclass focused on raw offense and suffering. |
| ☀️ **Path of the Sun**    | Mercy-based subclass focused on healing & protection. |
| ⚡ **Blood-Magic System**  | 20+ unique spells that consume Vengeance / Mercy points instead of spell slots. |
| 🎯 **Auto Resource Gain** | Points generated automatically when you take or witness damage. |
| 🎮 **Enhanced UI**        | Dedicated Martyr control panel and resource tracker on character sheets. |
| 📈 **Level Progression**  | Automatic feature granting and interactive level-up process. |
| 🔧 **Full Automation**    | Automated spell costs, resource management, and feature uses. |

---

## 🔧 **Foundry VTT v13 Compatibility**

This module is specifically designed for **Foundry VTT v13** and **D&D 5e System v4.0+**. Key features include:

- Native integration with Foundry v13's advancement system
- Compatible with modern D&D 5e system architecture
- Optimized performance and UI responsiveness
- Full support for character import/export
- Seamless integration with other popular modules

---

## 📥 Installation

### Method 1: Foundry UI (Recommended)
1. **Foundry UI**  
   *System → Add-on Modules → Install Module*  
   Paste this manifest URL:
   ```
   https://raw.githubusercontent.com/Akwaduk/ForgeVTT-Martyr/refs/heads/master/module.json
   ```

2. **Enable the module** in *Game Settings → Manage Modules* for your world.  

3. **Import compendia** by clicking on each compendium pack:
   - `Martyr Classes` - The main Martyr class
   - `Martyr Class Features` - All class features (1st-20th level)
   - `Martyr Subclasses` - Disciple of the Moon & Sun
   - `Martyr Blood Magic` - Complete spell collection

### Method 2: Manual Installation
1. Download the latest release ZIP file
2. Extract to your Foundry `Data/modules/` directory
3. Restart Foundry VTT and enable the module

---

## 🚀 Quick-start Guide

### Creating a Martyr Character

1. **Create a new character** in your world.
2. **Add the Martyr class** from the *Martyr Classes* compendium.
3. **Configure proficiencies** and starting equipment as per the class description.
4. **At 3rd level**, choose your path:
   - **Disciple of the Moon** (Vengeance/Charisma) from *Martyr Subclasses*
   - **Disciple of the Sun** (Mercy/Wisdom) from *Martyr Subclasses*

### Using the Martyr System

1. **Open the Martyr Control Panel** - Click the 🩸 button in the character sheet header.
2. **Resource Management** - Your Vengeance/Mercy points are tracked automatically.
3. **Cast Blood Magic** - Spells from the *Martyr Blood Magic* compendium use points instead of slots.
4. **Level Up** - Features are granted automatically as you advance levels.

---

## ⚙️ Core Mechanics

### Vengeance / Mercy Point System

| Resource Type | How You Gain Points | Resource Cap | Spellcasting Stat |
|---------------|-------------------|-------------|-------------------|
| **Vengeance** (Moon) | ½ damage **you** take (max 7/turn) | `Level × CON modifier` | Charisma |
| **Mercy** (Sun) | ½ damage **allies** take that you witness (reaction, max 7/turn) | `Level × CON modifier` | Wisdom |

**At Level 20:** Resource cap becomes unlimited (999)

### Blood Magic Spell Costs

| Spell Tier | Level Requirement | Point Cost | Examples |
|------------|------------------|------------|----------|
| I | 1st-2nd level | 5-10 pts | Flesh Bolt, Eagleheart |
| II | 3rd level | 10-15 pts | Bloodreign |
| III | 4th-5th level | 15-20 pts | Spiteful Maneuver, Flesh Storm |
| IV | 6th level | 30 pts | Absolution |
| V | 7th-9th level | 40 pts | Altar of Sacrifice, Ghosts of War |
| VI | 12th-16th level | 60 pts | Uncompromising Purity, Decauterize |
| VII | 18th level | 80 pts | Edge of Mortality |
| VIII | 20th level | 120 pts | **Vindicate** |

---

## 🎯 Key Class Features

### Core Features by Level

| Level | Feature | Description |
|-------|---------|-------------|
| 1st | Vengeance/Mercy, Martyr's Insight | Resource system + skill proficiency |
| 2nd | Double-Edged Blade, Blood Magic | Self-damage for bonus damage + spellcasting |
| 3rd | Mortal Devotion, Retribution | Choose path + reaction damage/healing |
| 5th | Exact Vengeance/Merciful Patience | Burst spending of all points |
| 9th | Improved Sufferance | +1 point when gaining resources |
| 10th | Blood and Thunder/Sacrifice and Atonement | AoE effects when spending points |
| 13th | Indomitable Presence | Mass taunt ability |
| 17th | Vindictive Divinity | 1-minute power mode |
| 20th | Apocalyptic Affinity | Redirect damage from allies to self |

### Path-Specific Features

#### Disciple of the Moon (Vengeance)
- **Heavy Armor Proficiency** at 3rd level
- **Hellbent** - Survive death with Vengeance points
- **Bane of Sisyphus** - Temporary HP from kills
- **Aspect of Death** - Instant kill ability at 18th level

#### Disciple of the Sun (Mercy)
- **Medicine Proficiency** at 3rd level  
- **Undertaker's Sigh** - Stabilize dying allies
- **Cusp of Greatness** - Movement bonus after healing
- **Radiant Intervention** - Absorb ally damage at 18th level

---

## 🔮 Notable Blood Magic Spells

### Low-Level Favorites
- **Flesh Bolt** *(5 pts)* - Necrotic projectile that heals you
- **Gabriel's Trumpet** *(10 pts)* - AoE taunt with force damage
- **Eagleheart** *(10 pts)* - Multi-target healing (Sun only)
- **Bloodreign** *(10 pts)* - Persistent AoE damage field (Moon only)

### High-Level Devastation
- **Absolution** *(30 pts)* - Self-lightning that explodes outward
- **Altar of Sacrifice** *(40 pts)* - Conjure sacrificial pillar
- **Vindicate** *(120 pts)* - Celestial judgment (requires visible sun/moon)

---

## 🎮 User Interface Guide

### Martyr Control Panel
Access via the 🩸 button on character sheets:

- **Resource Tracker** - Current/max points with visual bar
- **Quick Adjustments** - ±1, ±5 point buttons
- **Direct Input** - Set exact point values
- **Feature Actions** - Use Retribution, Exact Vengeance, etc.
- **Rest Management** - Handle point limits after rests

### Character Sheet Integration
- **Resource Display** - Points shown in the counters section
- **Blood Magic Indicators** - Spells marked with 🩸 icon
- **Automatic Costs** - Point deduction when casting spells
- **Feature Tracking** - Uses per rest automatically managed

---

## ⚙️ Module Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Enable Automatic Resource Gain** | Auto-grant points when taking/witnessing damage | ✅ On |
| **Show Resource Tracker** | Display resource counter in character sheet | ✅ On |
| **Enable Blood Magic Automation** | Auto-deduct points for spell costs | ✅ On |
| **Enable Level Progression** | Auto-grant features when leveling up | ✅ On |

---

## 📋 Requirements

* **Foundry VTT** v13 or later  
* **D&D 5e System** v4.0.0 or later

> **Compatibility:** Works with most popular modules. Minor conflicts may occur with other custom-resource systems.

---

## 🔧 Advanced Features

### Spell Automation
- Point costs automatically deducted when casting
- Path restrictions enforced (Moon/Sun only spells)
- Resource availability checked before casting
- Visual feedback for successful/failed casts

### Level Progression
- Features granted automatically at appropriate levels
- Subclass features integrated seamlessly  
- Resource maximums updated based on Constitution
- Spell learning prompts at level-up

### Combat Integration
- Automatic Vengeance point gain from damage
- Mercy point dialogs when allies take damage
- Retribution triggers for reaction-based defense
- Double-Edged Blade integration with attack rolls

---

## 🐞 Troubleshooting

### Common Issues

**Q: Compendiums appear empty after installation**
A: Refresh your browser (F5) and re-import the compendium packs.

**Q: Resource points not tracking automatically** 
A: Check that "Enable Automatic Resource Gain" is enabled in module settings.

**Q: Blood Magic spells still consuming spell slots**
A: Ensure "Enable Blood Magic Automation" is enabled and the spells are from the Martyr compendium.

**Q: Features not granted at level up**
A: Verify the character has the Martyr class and "Enable Level Progression" is on.

### Debug Information
Enable debug logging by adding this to your browser console:
```javascript
CONFIG.debug.dnd5e = true;
```

### Support
Found a bug or need help? Please include:
- Foundry VTT version
- D&D 5e system version  
- Module version
- Browser console errors (F12 → Console)
- Steps to reproduce the issue

---

## 📚 Documentation

For detailed class mechanics, spell descriptions, and advanced usage:
- See **`docs/class-doc.md`** (included in the module)
- Check the **Installation Guide** in the docs folder
- Review the **Quick Reference** guide for mechanics summary

---

Plea## 🎲 Design Philosophy

The Martyr class embodies the concept that **power comes through sacrifice**. Whether channeling the brutal justice of the Moon or the redemptive light of the Sun, Martyrs transform suffering into strength. The Blood Magic system replaces traditional spell slots with a dynamic resource that fluctuates based on combat circumstances, creating engaging tactical decisions about when to endure pain for power.

---

## Changelog

### Version 2.0.0 (Latest)
- 🔄 **MAJOR UPGRADE**: Full Foundry VTT v13 compatibility
- ✨ **NEW**: Complete automation system with resource tracking
- 🎮 **ENHANCED**: Interactive Martyr control panel
- 📈 **ADDED**: Automatic level progression and feature granting
- 🔮 **EXPANDED**: Complete Blood Magic spell collection (20+ spells)
- 🎯 **IMPROVED**: Subclass integration with automatic path detection
- 🛠️ **OPTIMIZED**: Performance improvements and modern code architecture
- 📱 **RESPONSIVE**: Mobile-friendly UI design

### Version 1.4.0
- 🔄 **MAJOR CHANGE**: Converted to NeDB format (.db files) for better Foundry VTT compatibility
- 📁 **SIMPLIFIED**: Using single-file database format instead of folder structure
- 🎯 **FOCUSED**: Starting with essential content (1 class + 6 features) to test import
- ✅ **TESTED**: Using the actual format that Foundry VTT expects for compendium data

---

### License

Distributed under the MIT License. See `LICENSE` for details.

> **Disclaimer:** This is a **home-brew** class. It is **not** affiliated with Wizards of the Coast or official D&D content.
