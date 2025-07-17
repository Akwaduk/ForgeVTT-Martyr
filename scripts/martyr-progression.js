/**
 * Martyr Level Progression and Automation
 * Handles automatic feature granting and level-up processes
 */

/**
 * Handle level progression for Martyr characters
 */
Hooks.on("dnd5e.advancementManagerComplete", (manager, actor, advancement) => {
    if (!window.MartyrModule.isMartyr(actor)) return;
    
    const newLevel = actor.system.details.level;
    grantMartyrFeatures(actor, newLevel);
});

/**
 * Grant appropriate Martyr features based on level
 */
async function grantMartyrFeatures(actor, level) {
    console.log(`Martyr Module | Checking features for level ${level}`);
    
    const featuresDB = {
        1: ["martyrfeat001", "martyrfeat002"], // Vengeance/Mercy, Insight
        2: ["martyrfeat003", "martyrfeat004"], // Double-Edged Blade, Spellcasting
        3: ["martyrfeat005", "martyrfeat006"], // Mortal Devotion, Retribution
        5: ["martyrfeat007"], // Exact Vengeance/Merciful Patience
        9: ["martyrfeat008"], // Improved Sufferance
        10: ["martyrfeat009"], // Blood and Thunder/Sacrifice and Atonement
        13: ["martyrfeat010"], // Indomitable Presence
        14: ["martyrfeat011"], // Improved Retribution
        17: ["martyrfeat012"], // Vindictive Divinity
        20: ["martyrfeat013"]  // Apocalyptic Affinity
    };
    
    const featuresToGrant = featuresDB[level];
    if (!featuresToGrant) return;
    
    for (const featureId of featuresToGrant) {
        await grantFeatureFromCompendium(actor, featureId);
    }
    
    // Update resource maximums
    updateResourceMaximums(actor);
}

/**
 * Grant a specific feature from the compendium
 */
async function grantFeatureFromCompendium(actor, featureId) {
    try {
        const pack = game.packs.get("dnd5e-martyr-class.martyr-class-features");
        if (!pack) {
            console.warn("Martyr Module | Class features compendium not found");
            return;
        }
        
        const featureIndex = await pack.getIndex();
        const featureEntry = featureIndex.find(e => e._id === featureId);
        
        if (!featureEntry) {
            console.warn(`Martyr Module | Feature ${featureId} not found in compendium`);
            return;
        }
        
        const feature = await pack.getDocument(featureId);
        if (!feature) {
            console.warn(`Martyr Module | Could not load feature ${featureId}`);
            return;
        }
        
        // Check if actor already has this feature
        const existingFeature = actor.items.find(i => i.name === feature.name);
        if (existingFeature) {
            console.log(`Martyr Module | Actor already has feature: ${feature.name}`);
            return;
        }
        
        // Add the feature to the actor
        await actor.createEmbeddedDocuments("Item", [feature.toObject()]);
        ui.notifications.info(`Added Martyr feature: ${feature.name}`);
        
    } catch (error) {
        console.error(`Martyr Module | Error granting feature ${featureId}:`, error);
    }
}

/**
 * Update resource maximums based on level and Constitution
 */
function updateResourceMaximums(actor) {
    const maxPoints = window.MartyrModule.getMaxResourcePoints(actor);
    const currentVengeance = actor.vengeancePoints;
    const currentMercy = actor.mercyPoints;
    
    // Cap current points to new maximum if they exceed it (unless level 20)
    const level = actor.system?.details?.level || 1;
    if (level < 20) {
        if (currentVengeance > maxPoints) {
            actor.vengeancePoints = maxPoints;
        }
        if (currentMercy > maxPoints) {
            actor.mercyPoints = maxPoints;
        }
    }
    
    console.log(`Martyr Module | Updated resource maximum to ${maxPoints} for ${actor.name}`);
}

/**
 * Handle subclass selection automation
 */
Hooks.on("createItem", (item, options, userId) => {
    if (item.type !== "subclass" || !item.system.classIdentifier === "martyr") return;
    
    const actor = item.actor;
    if (!actor || !window.MartyrModule.isMartyr(actor)) return;
    
    // Set the appropriate path based on subclass
    if (item.system.identifier === "disciple-moon") {
        actor.martyrPath = window.MartyrModule.PATHS.MOON;
        ui.notifications.info(`${actor.name} has chosen the Path of the Moon (Vengeance)`);
    } else if (item.system.identifier === "disciple-sun") {
        actor.martyrPath = window.MartyrModule.PATHS.SUN;
        ui.notifications.info(`${actor.name} has chosen the Path of the Sun (Mercy)`);
    }
});

/**
 * Enhanced spell slot tracking replacement for Blood Magic
 */
Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {
    if (!window.MartyrModule.isMartyr(app.actor)) return;
    
    // Hide traditional spell slots section if it exists
    const spellSlotsSection = html.find('.spell-slots');
    if (spellSlotsSection.length > 0) {
        spellSlotsSection.hide();
        
        // Add Blood Magic explanation
        const bloodMagicInfo = $(`
            <div class="blood-magic-info">
                <h4>Blood Magic System</h4>
                <p>This Martyr uses Vengeance/Mercy points instead of spell slots.</p>
                <p>Use the Martyr Panel to manage your resources.</p>
            </div>
        `);
        spellSlotsSection.after(bloodMagicInfo);
    }
});

/**
 * Automatic spell learning based on level
 */
async function updateMartyrSpells(actor, level) {
    const spellsKnown = getMartyrSpellsKnownForLevel(level);
    const currentSpells = actor.items.filter(i => i.type === "spell" && i.getFlag("dnd5e-martyr-class", "isBloodMagic"));
    
    if (currentSpells.length >= spellsKnown) return;
    
    // Offer spell selection dialog
    showSpellSelectionDialog(actor, spellsKnown - currentSpells.length);
}

/**
 * Get number of spells known for Martyr level
 */
function getMartyrSpellsKnownForLevel(level) {
    const spellProgression = {
        1: 0, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10,
        11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20
    };
    return spellProgression[level] || 0;
}

/**
 * Show spell selection dialog
 */
async function showSpellSelectionDialog(actor, spellsToSelect) {
    const pack = game.packs.get("dnd5e-martyr-class.martyr-spells");
    if (!pack) return;
    
    const spellIndex = await pack.getIndex();
    const availableSpells = [];
    
    // Get spells the actor can learn based on level
    const martyrLevel = actor.system.details.level;
    for (const spellEntry of spellIndex) {
        const spell = await pack.getDocument(spellEntry._id);
        if (canLearnSpell(actor, spell, martyrLevel)) {
            availableSpells.push(spell);
        }
    }
    
    if (availableSpells.length === 0) {
        ui.notifications.info("No new spells available to learn.");
        return;
    }
    
    // Create spell selection dialog
    const spellOptions = availableSpells.map(spell => 
        `<option value="${spell.id}">${spell.name} (Level ${spell.system.level})</option>`
    ).join('');
    
    new Dialog({
        title: "Learn Martyr Spells",
        content: `
            <p>Select ${spellsToSelect} spell(s) to learn:</p>
            <div class="spell-selection">
                ${Array(spellsToSelect).fill().map((_, i) => `
                    <div class="form-group">
                        <label>Spell ${i + 1}:</label>
                        <select name="spell${i}">${spellOptions}</select>
                    </div>
                `).join('')}
            </div>
        `,
        buttons: {
            learn: {
                icon: '<i class="fas fa-magic"></i>',
                label: "Learn Spells",
                callback: async (html) => {
                    const selectedSpells = [];
                    for (let i = 0; i < spellsToSelect; i++) {
                        const spellId = html.find(`[name="spell${i}"]`).val();
                        if (spellId) {
                            const spell = availableSpells.find(s => s.id === spellId);
                            if (spell) selectedSpells.push(spell.toObject());
                        }
                    }
                    
                    if (selectedSpells.length > 0) {
                        await actor.createEmbeddedDocuments("Item", selectedSpells);
                        ui.notifications.info(`Learned ${selectedSpells.length} new spell(s)!`);
                    }
                }
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel"
            }
        }
    }).render(true);
}

/**
 * Check if actor can learn a specific spell
 */
function canLearnSpell(actor, spell, martyrLevel) {
    // Check if actor already knows this spell
    const existingSpell = actor.items.find(i => i.name === spell.name);
    if (existingSpell) return false;
    
    // Check spell level requirements based on Martyr level
    const spellLevel = spell.system.level;
    const requiredLevel = getRequiredLevelForSpellLevel(spellLevel);
    if (martyrLevel < requiredLevel) return false;
    
    // Check path restrictions
    const pathRestriction = spell.getFlag("dnd5e-martyr-class", "pathRestriction");
    const actorPath = actor.martyrPath;
    
    if (pathRestriction === "moon" && actorPath !== window.MartyrModule.PATHS.MOON) return false;
    if (pathRestriction === "sun" && actorPath !== window.MartyrModule.PATHS.SUN) return false;
    
    return true;
}

/**
 * Get required Martyr level for spell level
 */
function getRequiredLevelForSpellLevel(spellLevel) {
    const requirements = {
        1: 2,  // 1st level spells at Martyr level 2
        2: 2,  // 2nd level spells at Martyr level 2
        3: 3,  // 3rd level spells at Martyr level 3
        4: 4,  // 4th level spells at Martyr level 4
        5: 5,  // 5th level spells at Martyr level 5
        6: 6,  // 6th level spells at Martyr level 6
        7: 7,  // 7th level spells at Martyr level 7
        8: 8,  // 8th level spells at Martyr level 8
        9: 9   // 9th level spells at Martyr level 9
    };
    return requirements[spellLevel] || 20;
}

/**
 * Handle rest recovery for Martyrs
 */
Hooks.on("dnd5e.restCompleted", (actor, data) => {
    if (!window.MartyrModule.isMartyr(actor)) return;
    
    if (data.longRest) {
        // Long rest: remove excess points
        const maxPoints = window.MartyrModule.getMaxResourcePoints(actor);
        let changed = false;
        
        if (actor.vengeancePoints > maxPoints) {
            actor.vengeancePoints = maxPoints;
            changed = true;
        }
        
        if (actor.mercyPoints > maxPoints) {
            actor.mercyPoints = maxPoints;
            changed = true;
        }
        
        if (changed) {
            ui.notifications.info("Excess Martyr points have faded after the long rest.");
        }
        
        // Reset uses of class features
        resetMartyrFeatureUses(actor);
    }
});

/**
 * Reset uses of Martyr class features
 */
function resetMartyrFeatureUses(actor) {
    const martyrFeatures = actor.items.filter(i => 
        i.getFlag("dnd5e-martyr-class", "isMartyFeature") && 
        i.system.uses?.per === "lr"
    );
    
    const updates = martyrFeatures.map(feature => ({
        _id: feature.id,
        "system.uses.value": feature.system.uses.max
    }));
    
    if (updates.length > 0) {
        actor.updateEmbeddedDocuments("Item", updates);
    }
}

/**
 * Enhance damage rolls for Double-Edged Blade
 */
Hooks.on("dnd5e.rollAttack", (item, roll, amountRolled) => {
    const actor = item.actor;
    if (!window.MartyrModule.isMartyr(actor)) return;
    
    // Check if Double-Edged Blade should be offered
    const doubleEdgedBlade = actor.items.find(i => i.name === "Double-Edged Blade");
    if (!doubleEdgedBlade) return;
    
    // Check if already used this turn (implement turn tracking as needed)
    // For now, always offer the option
    
    new Dialog({
        title: "Use Double-Edged Blade?",
        content: `<p>Use Double-Edged Blade to enhance this attack?</p><p>You will take ${actor.system.abilities.con.mod || 1} damage but add your Chosen modifier to damage if the attack hits.</p>`,
        buttons: {
            yes: {
                icon: '<i class="fas fa-sword"></i>',
                label: "Use Feature",
                callback: () => {
                    const conMod = actor.system.abilities.con.mod || 1;
                    const damageType = actor.martyrPath === window.MartyrModule.PATHS.MOON ? "necrotic" : "radiant";
                    
                    // Apply self-damage
                    const currentHp = actor.system.attributes.hp.value;
                    actor.update({"system.attributes.hp.value": Math.max(0, currentHp - conMod)});
                    
                    ui.notifications.info(`Double-Edged Blade activated! You take ${conMod} ${damageType} damage.`);
                    
                    // The damage bonus will need to be added manually to the damage roll
                    // or through an active effect system
                }
            },
            no: {
                icon: '<i class="fas fa-times"></i>',
                label: "No"
            }
        }
    }).render(true);
});

console.log("Martyr Module | Level progression and automation loaded");
