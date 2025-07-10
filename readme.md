# 🩸 D&D 5e – Martyr Class (Foundry VTT Module)

Adds a complete **Martyr** class to the D&D 5e system in Foundry VTT, built around a Vengeance / Mercy resource economy and Blood-Magic spell list.

---

## ✨ Features

|                           | Description |
|---------------------------|-------------|
| 🗡️ **Full 20-level Class** | All class features automated and ready to drag-and-drop. |
| 🌙 **Path of the Moon**   | Vengeance-based subclass focused on raw offense. |
| ☀️ **Path of the Sun**    | Mercy-based subclass focused on healing & protection. |
| ⚡ **Blood-Magic System**  | Spells consume Vengeance / Mercy points instead of spell slots. |
| 🎯 **Auto Resource Gain** | Points generated when you take or witness damage. |
| 🎮 **Enhanced UI**        | Dedicated Martyr panel and resource tracker on the character sheet. |

---

## 📥 Installation

1. **Foundry UI**  
   *System → Add-on Modules → Install Module*  
   Paste this manifest URL (or pick it from the browser):
2. **Enable the module** in *Manage Modules* for your world.  
3. **Import compendia** (`Martyr Class Features`, `Martyr Spells`, `Martyr Subclasses`).

---

## 🚀 Quick-start

1. Create or open a character.  
2. From the compendium, drag the **Martyr** class onto the sheet.  
3. At **3rd level**, choose either **Disciple of the Moon** or **Disciple of the Sun**.  
4. Use the **Martyr Control Panel** (button in the header) to track resources.  
5. Cast Blood-Magic spells—**no spell slots needed**, they spend points instead.

---

## 🔧 **Manual Class Creation (If Needed)**

If the Martyr class doesn't appear in your compendium after installation, you can create it manually:

1. **Open the Martyr Class Features compendium**
2. **Click "Create Item"** 
3. **Set Type to "Class"**
4. **Name it "Martyr"**
5. **Copy the following into the Description:**

```html
<p>The Martyr understands that suffering is the ultimate path to self-realization. They obtain their powers through a profound connection to either the Sun or the Moon, aligning with paths of Mercy or Vengeance.</p>

<h3>Hit Points</h3>
<ul>
<li><strong>Hit Dice:</strong> 1d10 per Martyr level</li>
<li><strong>Hit Points at 1st Level:</strong> 10 + your Constitution modifier</li>
<li><strong>Hit Points at Higher Levels:</strong> 1d10 (or 6) + your Constitution modifier per Martyr level after 1st</li>
</ul>

<h3>Proficiencies</h3>
<ul>
<li><strong>Armor:</strong> Light armor, Medium armor, Shields</li>
<li><strong>Weapons:</strong> Simple weapons, Greatsword, Maul, Heavy Crossbow</li>
<li><strong>Tools:</strong> None</li>
<li><strong>Saving Throws:</strong> Constitution, Wisdom</li>
<li><strong>Skills:</strong> Choose two from Athletics, Intimidation, Medicine, Persuasion, Religion, and Survival</li>
</ul>
```

6. **Set the following Class Details:**
   - **Identifier:** `martyr`
   - **Hit Die:** `d10`
   - **Primary Ability:** Constitution
   - **Saving Throws:** Constitution, Wisdom
   - **Skills:** Choose 2 from Athletics, Intimidation, Medicine, Persuasion, Religion, Survival

7. **Save the item**

The module will handle all the automation and features once you have the base class!

---

## ⚙️ Core Mechanics

### Vengeance / Mercy Points
| Resource | How you gain it | Cap |
|----------|-----------------|-----|
| **Vengeance**<br>(Moon) | ½ the damage **you** take (rounded up, max 7 / turn) | `Level × CON mod` |
| **Mercy**<br>(Sun) | ½ the damage an **ally** takes that you witness (reaction, max 7 / turn) | `Level × CON mod` |

### Blood-Magic Highlights
* No spell-slot progression—every spell costs points.  
* **16 unique spells** spanning all levels from 1st to 9th
* Signature spells: **Flesh Bolt**, **Bloodreign**, **Absolution**, **Vindicate** (and more).  
* Each spell scales with the points you invest and your character level.
* **Path-specific spells**: Some spells only available to Moon or Sun disciples

---

## 📋 Requirements

* **Foundry VTT** &nbsp;v11 or later  
* **D&D 5e System** &nbsp;v3.0.0 or later

> Works with most popular modules. Minor conflicts may occur with other custom-resource systems.

---

## 📚 Documentation

See **`docs/Installation Guide.md`** (included in the module) for detailed setup, FAQ, and troubleshooting tips.

---

## 🐞 Support & Feedback

Found a bug or want to suggest a feature?  
Please open an issue and include:

* Foundry version, D&D 5e system version, module version  
* Exact steps to reproduce  
* Any console errors (press **F12 → Console tab**)

> **Disclaimer:** This is a **home-brew** class. It is **not** affiliated with Wizards of the Coast or official D&D content.

---

## Changelog

### Version 1.1.0
- Added complete blood magic spell collection (16 spells total)
- Added missing spells: The Devil's Leverage, Crucifixion, Veil of Suffering, Dark Penance, Spiteful Maneuver, Flesh Storm, Absolution, Altar of Sacrifice, Deconstruct Flesh, Uncompromising Purity, Edge of Mortality
- Enhanced spell descriptions with proper mechanics
- Improved spell scaling and level requirements
- Updated module compatibility

### Version 1.0.0
- Initial release
- Complete Martyr class implementation
- Vengeance/Mercy resource system
- Basic blood magic spells
- Both subclasses (Moon and Sun)
- Automated resource management
- Interactive UI for resource control

---

### License

Distributed under the MIT License. See `LICENSE` for details.
