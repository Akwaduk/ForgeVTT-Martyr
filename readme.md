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

## ⚙️ Core Mechanics

### Vengeance / Mercy Points
| Resource | How you gain it | Cap |
|----------|-----------------|-----|
| **Vengeance**<br>(Moon) | ½ the damage **you** take (rounded up, max 7 / turn) | `Level × CON mod` |
| **Mercy**<br>(Sun) | ½ the damage an **ally** takes that you witness (reaction, max 7 / turn) | `Level × CON mod` |

### Blood-Magic Highlights
* No spell-slot progression—every spell costs points.  
* Signature spells: **Flesh Bolt**, **Bloodreign**, **Vindicate** (and more).  
* Each spell scales with the points you invest and your character level.

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

### License

Distributed under the MIT License. See `LICENSE` for details.
