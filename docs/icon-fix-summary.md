# Icon Path Fix Summary

## Issue
The Martyr module had broken icon files on install due to using external icon pack paths that aren't included with standard Foundry VTT installations.

## Solution
All icon paths have been updated to use D&D 5e system icons that are guaranteed to be available in Foundry VTT v13.

## Changes Made
- **Total icons fixed**: 16 across 4 pack files
- **Classes**: 1 icon → `systems/dnd5e/icons/svg/items/class.svg`
- **Spells**: 7 icons → `systems/dnd5e/icons/svg/items/spell.svg`
- **Class Features**: 6 icons → `systems/dnd5e/icons/svg/items/feat.svg`
- **Subclasses**: 2 icons → `systems/dnd5e/icons/svg/items/subclass.svg`

## Verification
- All pack files maintain JSON integrity
- All icons now use system-guaranteed paths
- Compatible with Foundry VTT v13 and D&D 5e system

## Testing
The module should now install without broken icons on any standard Foundry VTT v13 installation with the D&D 5e system.