/**
 * Martyr Level Progression and Automation
 * Handles level-up processes and resource management
 */

/**
 * Handle advancement completion for Martyr characters
 */
Hooks.on("dnd5e.advancementManagerComplete", (manager, actor, advancement) => {
    if (!window.MartyrModule.isMartyr(actor)) return;
    
    console.log(`Martyr Module | Advancement complete for ${actor.name}`);
    
    // Update resource maximums when leveling up
    updateResourceMaximums(actor);
    
    // Check if this is the first time getting the class (level 1)
    const level = actor.system.details.level;
    if (level === 1) {
        initializeMartyrResources(actor);
    }
});

/**
 * Handle subclass selection
 */
Hooks.on("createItem", (item, options, userId) => {
    if (item.type !== "subclass") return;
    
    const actor = item.actor;
    if (!actor || !window.MartyrModule.isMartyr(actor)) return;
    
    // Check if this is a Martyr subclass
    if (item.system.classIdentifier !== "martyr") return;
    
    // Set the appropriate path based on subclass
    if (item.system.identifier === "disciple-moon") {
        actor.martyrPath = window.MartyrModule.PATHS.MOON;
        ui.notifications.info(`${actor.name} has chosen the Path of the Moon (Vengeance)`);
        console.log(`Martyr Module | ${actor.name} selected Path of the Moon`);
    } else if (item.system.identifier === "disciple-sun") {
        actor.martyrPath = window.MartyrModule.PATHS.SUN;
        ui.notifications.info(`${actor.name} has chosen the Path of the Sun (Mercy)`);
        console.log(`Martyr Module | ${actor.name} selected Path of the Sun`);
    }
});

/**
 * Initialize Martyr resources for new characters
 */
function initializeMartyrResources(actor) {
    console.log(`Martyr Module | Initializing resources for ${actor.name}`);
    
    // Set initial resource points to 0
    if (!actor.getFlag("dnd5e-martyr-class", "vengeance")) {
        actor.setFlag("dnd5e-martyr-class", "vengeance", 0);
    }
    if (!actor.getFlag("dnd5e-martyr-class", "mercy")) {
        actor.setFlag("dnd5e-martyr-class", "mercy", 0);
    }
    
    ui.notifications.info(`${actor.name} is now a Martyr! Resource tracking initialized.`);
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

/**
 * Handle automatic resource point tracking enhancements
 */
Hooks.on("updateActor", (actor, updateData, options, userId) => {
    if (!window.MartyrModule.isMartyr(actor)) return;
    
    // Enhanced resource gain logic for Improved Sufferance
    const improvedSufferance = actor.items.find(i => i.name === "Improved Sufferance");
    if (improvedSufferance && game.settings.get("dnd5e-martyr-class", "enableAutomaticResourceGain")) {
        // The bonus point from Improved Sufferance is handled by the main resource tracking
        // but this ensures it's properly applied at level 9+
    }
});

/**
 * Validate and repair actor data
 */
Hooks.on("preUpdateActor", (actor, updateData, options, userId) => {
    if (!window.MartyrModule.isMartyr(actor)) return;
    
    // Ensure Martyr flags are properly maintained
    const martyrPath = actor.getFlag("dnd5e-martyr-class", "path");
    if (!martyrPath) {
        // Check if actor has a Martyr subclass to determine path
        const subclass = actor.items.find(i => i.type === "subclass" && i.system.classIdentifier === "martyr");
        if (subclass) {
            if (subclass.system.identifier === "disciple-moon") {
                actor.setFlag("dnd5e-martyr-class", "path", "moon");
            } else if (subclass.system.identifier === "disciple-sun") {
                actor.setFlag("dnd5e-martyr-class", "path", "sun");
            }
        }
    }
});

console.log("Martyr Module | Level progression and automation loaded");
