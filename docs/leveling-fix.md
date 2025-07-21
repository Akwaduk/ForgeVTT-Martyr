# Martyr Class Leveling Fix - Documentation

## Issue Resolution

The issue was that the Martyr class's base skills and subclass features were not being granted automatically during the Foundry VTT level-up process. This was due to the class advancement configuration being incomplete.

## Root Cause

The `martyr-classes.db` compendium only contained basic D&D 5e advancement entries (Hit Points, ASI) but was missing **ItemGrant** advancement entries for class-specific features. While the features existed in `martyr-class-features.db`, they weren't being automatically granted because Foundry VTT v13+ expects these to be defined in the class advancement configuration.

The progression script (`martyr-progression.js`) was attempting to handle feature granting via hooks, but this approach was incomplete and didn't integrate properly with Foundry's advancement system.

## Solution Implemented

### 1. Added Missing Class Features
Created 7 missing class features (martyrfeat007-013) that were referenced in the progression script:
- Exact Vengeance / Merciful Patience (Level 5)
- Improved Sufferance (Level 9)
- Blood and Thunder / Sacrifice and Atonement (Level 10)
- Indomitable Presence (Level 13)
- Improved Retribution (Level 14)
- Vindictive Divinity (Level 17)
- Apocalyptic Affinity (Level 20)

### 2. Updated Class Advancement Configuration
Added comprehensive ItemGrant and ItemChoice entries for:
- **Level 1**: Skill selection (2 from 6 options), Vengeance/Mercy resource system, Martyr's Insight
- **Level 2**: Double-Edged Blade, Martyr Spellcasting
- **Level 3**: Mortal Devotion info, Retribution, Subclass selection
- **Levels 4-20**: All remaining class features and ASIs

### 3. Improved Integration
- Set proper spellcasting progression to "none" (uses Blood Magic system)
- Updated subclass selection to use proper ItemChoice advancement
- Simplified progression script to focus on resource management

## How It Works Now

1. **Character Creation**: Players select Martyr class and get proper proficiencies
2. **Level 1**: Automatic skill selection dialog, Vengeance/Mercy system, Martyr's Insight granted
3. **Level 2**: Double-Edged Blade and Spellcasting features granted automatically
4. **Level 3**: Subclass selection dialog appears, Retribution feature granted
5. **Higher Levels**: All class features granted automatically at appropriate levels

## Files Modified

- `packs/martyr-classes.db` - Updated class advancement configuration
- `packs/martyr-class-features.db` - Added missing class features
- `scripts/martyr-progression.js` - Simplified to work with advancement system

## Testing

The fix has been validated to ensure:
- All 15 levels with features have proper advancement entries
- All 13 class features exist in the compendium
- Both subclasses are properly configured
- Skill selection works at level 1
- Subclass selection works at level 3

## Result

Players can now level up Martyr characters using Foundry VTT's native advancement system, and all class features, skills, and subclass abilities will be granted automatically without manual intervention.