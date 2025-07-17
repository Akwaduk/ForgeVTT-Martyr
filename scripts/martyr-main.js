/**
 * Martyr Class Module for Foundry VTT D&D 5e
 * Implements the Martyr class with Vengeance/Mercy resource system and Blood Magic
 */

// Module configuration
const MARTYR_MODULE = {
    ID: "dnd5e-martyr-class",
    NAME: "Martyr Class",
    VERSION: "2.0.0"
};

// Resource types
const RESOURCE_TYPES = {
    VENGEANCE: "vengeance",
    MERCY: "mercy"
};

// Path types
const PATHS = {
    MOON: "moon",
    SUN: "sun"
};

/**
 * Initialize the module
 */
Hooks.once("init", function() {
    console.log(`${MARTYR_MODULE.NAME} | Initializing module v${MARTYR_MODULE.VERSION}`);
    
    // Register module settings
    registerSettings();
    
    // Register custom item types and properties
    registerCustomProperties();
    
    // Register Handlebars helpers
    registerHandlebarsHelpers();
    
    console.log(`${MARTYR_MODULE.NAME} | Initialization complete`);
});

/**
 * Setup hooks for when the module is ready
 */
Hooks.once("ready", function() {
    console.log(`${MARTYR_MODULE.NAME} | Module ready`);
    
    // Initialize UI components
    initializeUI();
    
    // Setup automatic resource tracking
    setupResourceTracking();
});

/**
 * Register module settings
 */
function registerSettings() {
    game.settings.register(MARTYR_MODULE.ID, "enableAutomaticResourceGain", {
        name: "Enable Automatic Resource Gain",
        hint: "Automatically grant Vengeance/Mercy points when taking/witnessing damage",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });
    
    game.settings.register(MARTYR_MODULE.ID, "showResourceTracker", {
        name: "Show Resource Tracker",
        hint: "Display the Martyr resource tracker in the UI",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });
    
    game.settings.register(MARTYR_MODULE.ID, "enableBloodMagicAutomation", {
        name: "Enable Blood Magic Automation",
        hint: "Automatically handle point costs for Blood Magic spells",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });
}

/**
 * Register custom properties for items and actors
 */
function registerCustomProperties() {
    // Add Martyr-specific properties to actor data
    Object.defineProperty(CONFIG.Actor.documentClass.prototype, "martyrPath", {
        get() {
            return this.getFlag(MARTYR_MODULE.ID, "path") || null;
        },
        set(value) {
            return this.setFlag(MARTYR_MODULE.ID, "path", value);
        }
    });
    
    Object.defineProperty(CONFIG.Actor.documentClass.prototype, "vengeancePoints", {
        get() {
            return this.getFlag(MARTYR_MODULE.ID, "vengeance") || 0;
        },
        set(value) {
            return this.setFlag(MARTYR_MODULE.ID, "vengeance", Math.max(0, value));
        }
    });
    
    Object.defineProperty(CONFIG.Actor.documentClass.prototype, "mercyPoints", {
        get() {
            return this.getFlag(MARTYR_MODULE.ID, "mercy") || 0;
        },
        set(value) {
            return this.setFlag(MARTYR_MODULE.ID, "mercy", Math.max(0, value));
        }
    });
    
    // Add Blood Magic properties to items
    Object.defineProperty(CONFIG.Item.documentClass.prototype, "isBloodMagic", {
        get() {
            return this.getFlag(MARTYR_MODULE.ID, "isBloodMagic") || false;
        },
        set(value) {
            return this.setFlag(MARTYR_MODULE.ID, "isBloodMagic", value);
        }
    });
    
    Object.defineProperty(CONFIG.Item.documentClass.prototype, "bloodMagicCost", {
        get() {
            return this.getFlag(MARTYR_MODULE.ID, "bloodMagicCost") || 0;
        },
        set(value) {
            return this.setFlag(MARTYR_MODULE.ID, "bloodMagicCost", value);
        }
    });
    
    Object.defineProperty(CONFIG.Item.documentClass.prototype, "bloodMagicType", {
        get() {
            return this.getFlag(MARTYR_MODULE.ID, "bloodMagicType") || "both";
        },
        set(value) {
            return this.setFlag(MARTYR_MODULE.ID, "bloodMagicType", value);
        }
    });
}

/**
 * Register Handlebars helpers
 */
function registerHandlebarsHelpers() {
    Handlebars.registerHelper("martyrPath", function(actor) {
        return actor.martyrPath || "None";
    });
    
    Handlebars.registerHelper("martyrPoints", function(actor) {
        if (actor.martyrPath === PATHS.MOON) {
            return actor.vengeancePoints;
        } else if (actor.martyrPath === PATHS.SUN) {
            return actor.mercyPoints;
        }
        return 0;
    });
    
    Handlebars.registerHelper("martyrMaxPoints", function(actor) {
        if (!actor.martyrPath) return 0;
        const level = actor.system?.details?.level || 1;
        const conMod = actor.system?.abilities?.con?.mod || 0;
        return level >= 20 ? 999 : level * Math.max(1, conMod);
    });
}

/**
 * Initialize UI components
 */
function initializeUI() {
    // Add Martyr control panel button to character sheet header
    Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {
        if (!isMartyr(app.actor)) return;
        
        addMartyrControlButton(app, html);
        addResourceDisplay(app, html);
    });
    
    // Modify spell casting for Blood Magic
    Hooks.on("renderItemSheet5e", (app, html, data) => {
        if (app.item.isBloodMagic) {
            addBloodMagicControls(app, html);
        }
    });
}

/**
 * Setup automatic resource tracking
 */
function setupResourceTracking() {
    if (!game.settings.get(MARTYR_MODULE.ID, "enableAutomaticResourceGain")) return;
    
    // Track damage taken for Vengeance points
    Hooks.on("updateActor", (actor, updateData, options, userId) => {
        if (!isMartyr(actor) || actor.martyrPath !== PATHS.MOON) return;
        
        const hpChange = updateData.system?.attributes?.hp?.value;
        if (hpChange !== undefined) {
            const currentHp = actor.system.attributes.hp.value;
            const previousHp = currentHp - (hpChange - currentHp);
            
            if (currentHp < previousHp) {
                const damage = previousHp - currentHp;
                grantVengeancePoints(actor, damage);
            }
        }
    });
    
    // Track ally damage for Mercy points (requires manual trigger due to reaction nature)
    Hooks.on("preUpdateActor", (actor, updateData, options, userId) => {
        if (!updateData.system?.attributes?.hp?.value) return;
        
        const damage = (actor.system.attributes.hp.value || 0) - updateData.system.attributes.hp.value;
        if (damage <= 0) return;
        
        // Find nearby Martyrs of the Sun
        const martyrs = game.actors.contents.filter(a => 
            isMartyr(a) && 
            a.martyrPath === PATHS.SUN && 
            a.id !== actor.id
        );
        
        martyrs.forEach(martyr => {
            // In a real implementation, you'd check distance
            // For now, we'll assume they're in range and show a dialog
            if (game.user.character?.id === martyr.id) {
                showMercyPointDialog(martyr, damage);
            }
        });
    });
}

/**
 * Check if an actor is a Martyr
 */
function isMartyr(actor) {
    if (!actor || actor.type !== "character") return false;
    
    const classes = actor.items.filter(i => i.type === "class");
    return classes.some(cls => cls.name.toLowerCase().includes("martyr"));
}

/**
 * Grant Vengeance points to a Martyr
 */
function grantVengeancePoints(actor, damage) {
    const pointsGained = Math.min(7, Math.ceil(damage / 2));
    const currentPoints = actor.vengeancePoints;
    const maxPoints = getMaxResourcePoints(actor);
    const newPoints = Math.min(maxPoints, currentPoints + pointsGained);
    
    actor.vengeancePoints = newPoints;
    
    if (pointsGained > 0) {
        ui.notifications.info(`${actor.name} gained ${pointsGained} Vengeance points from suffering!`);
    }
}

/**
 * Show dialog for granting Mercy points
 */
function showMercyPointDialog(martyr, damage) {
    const pointsAvailable = Math.min(7, Math.ceil(damage / 2));
    
    new Dialog({
        title: "Grant Mercy Points",
        content: `<p>An ally has taken ${damage} damage. Grant ${pointsAvailable} Mercy points?</p>`,
        buttons: {
            yes: {
                icon: '<i class="fas fa-heart"></i>',
                label: "Grant Mercy",
                callback: () => grantMercyPoints(martyr, pointsAvailable)
            },
            no: {
                icon: '<i class="fas fa-times"></i>',
                label: "No",
                callback: () => {}
            }
        },
        default: "yes"
    }).render(true);
}

/**
 * Grant Mercy points to a Martyr
 */
function grantMercyPoints(actor, points) {
    const currentPoints = actor.mercyPoints;
    const maxPoints = getMaxResourcePoints(actor);
    const newPoints = Math.min(maxPoints, currentPoints + points);
    
    actor.mercyPoints = newPoints;
    
    if (points > 0) {
        ui.notifications.info(`${actor.name} gained ${points} Mercy points from witnessing suffering!`);
    }
}

/**
 * Get maximum resource points for a Martyr
 */
function getMaxResourcePoints(actor) {
    const level = actor.system?.details?.level || 1;
    const conMod = actor.system?.abilities?.con?.mod || 0;
    
    if (level >= 20) return 999; // Unlimited at level 20
    return level * Math.max(1, conMod);
}

/**
 * Add Martyr control button to character sheet
 */
function addMartyrControlButton(app, html) {
    const headerButtons = html.find('.header-buttons');
    if (headerButtons.length === 0) return;
    
    const button = $(`
        <button type="button" class="martyr-control-panel">
            <i class="fas fa-heart-broken"></i>
            Martyr Panel
        </button>
    `);
    
    button.click(() => showMartyrControlPanel(app.actor));
    headerButtons.prepend(button);
}

/**
 * Add resource display to character sheet
 */
function addResourceDisplay(app, html) {
    if (!game.settings.get(MARTYR_MODULE.ID, "showResourceTracker")) return;
    
    const resourcesSection = html.find('.counters');
    if (resourcesSection.length === 0) return;
    
    const path = app.actor.martyrPath;
    if (!path) return;
    
    const resourceName = path === PATHS.MOON ? "Vengeance" : "Mercy";
    const currentPoints = path === PATHS.MOON ? app.actor.vengeancePoints : app.actor.mercyPoints;
    const maxPoints = getMaxResourcePoints(app.actor);
    
    const resourceHtml = $(`
        <div class="counter martyr-resource">
            <h4>${resourceName}</h4>
            <div class="counter-value">
                <input type="number" value="${currentPoints}" max="${maxPoints}" min="0" 
                       class="martyr-points-input" data-type="${path}">
                <span class="sep"> / </span>
                <span class="max">${maxPoints}</span>
            </div>
        </div>
    `);
    
    resourceHtml.find('.martyr-points-input').change((event) => {
        const newValue = parseInt(event.target.value) || 0;
        if (path === PATHS.MOON) {
            app.actor.vengeancePoints = newValue;
        } else {
            app.actor.mercyPoints = newValue;
        }
    });
    
    resourcesSection.append(resourceHtml);
}

/**
 * Show Martyr control panel
 */
function showMartyrControlPanel(actor) {
    const path = actor.martyrPath;
    const resourceName = path === PATHS.MOON ? "Vengeance" : "Mercy";
    const currentPoints = path === PATHS.MOON ? actor.vengeancePoints : actor.mercyPoints;
    const maxPoints = getMaxResourcePoints(actor);
    
    new Dialog({
        title: `Martyr Control Panel - ${actor.name}`,
        content: `
            <div class="martyr-panel">
                <h3>Path: ${path === PATHS.MOON ? "Moon (Vengeance)" : "Sun (Mercy)"}</h3>
                <div class="resource-controls">
                    <h4>${resourceName} Points</h4>
                    <div class="counter-controls">
                        <button type="button" class="adjust-points" data-adjustment="-1">-1</button>
                        <button type="button" class="adjust-points" data-adjustment="-5">-5</button>
                        <span class="current-points">${currentPoints} / ${maxPoints}</span>
                        <button type="button" class="adjust-points" data-adjustment="1">+1</button>
                        <button type="button" class="adjust-points" data-adjustment="5">+5</button>
                    </div>
                    <input type="number" class="direct-set" value="${currentPoints}" min="0" max="${maxPoints}">
                    <button type="button" class="set-points">Set</button>
                </div>
                <div class="quick-actions">
                    <h4>Quick Actions</h4>
                    <button type="button" class="rest-action" data-rest="short">Short Rest</button>
                    <button type="button" class="rest-action" data-rest="long">Long Rest</button>
                    <button type="button" class="retribution-action">Use Retribution</button>
                </div>
            </div>
        `,
        buttons: {
            close: {
                icon: '<i class="fas fa-times"></i>',
                label: "Close"
            }
        },
        render: (html) => {
            // Add event listeners
            html.find('.adjust-points').click((event) => {
                const adjustment = parseInt(event.target.dataset.adjustment);
                adjustPoints(actor, adjustment);
                updatePanelDisplay(html, actor);
            });
            
            html.find('.set-points').click((event) => {
                const newValue = parseInt(html.find('.direct-set').val()) || 0;
                setPoints(actor, newValue);
                updatePanelDisplay(html, actor);
            });
            
            html.find('.rest-action').click((event) => {
                const restType = event.target.dataset.rest;
                handleRest(actor, restType);
                updatePanelDisplay(html, actor);
            });
            
            html.find('.retribution-action').click(() => {
                useRetribution(actor);
            });
        }
    }).render(true);
}

/**
 * Adjust resource points
 */
function adjustPoints(actor, adjustment) {
    const path = actor.martyrPath;
    const maxPoints = getMaxResourcePoints(actor);
    
    if (path === PATHS.MOON) {
        const newValue = Math.max(0, Math.min(maxPoints, actor.vengeancePoints + adjustment));
        actor.vengeancePoints = newValue;
    } else if (path === PATHS.SUN) {
        const newValue = Math.max(0, Math.min(maxPoints, actor.mercyPoints + adjustment));
        actor.mercyPoints = newValue;
    }
}

/**
 * Set resource points directly
 */
function setPoints(actor, value) {
    const path = actor.martyrPath;
    const maxPoints = getMaxResourcePoints(actor);
    const clampedValue = Math.max(0, Math.min(maxPoints, value));
    
    if (path === PATHS.MOON) {
        actor.vengeancePoints = clampedValue;
    } else if (path === PATHS.SUN) {
        actor.mercyPoints = clampedValue;
    }
}

/**
 * Handle rest actions
 */
function handleRest(actor, restType) {
    if (restType === "long") {
        // Clear excess points on long rest
        const maxPoints = getMaxResourcePoints(actor);
        const path = actor.martyrPath;
        
        if (path === PATHS.MOON && actor.vengeancePoints > maxPoints) {
            actor.vengeancePoints = maxPoints;
            ui.notifications.info("Excess Vengeance points fade after a long rest.");
        } else if (path === PATHS.SUN && actor.mercyPoints > maxPoints) {
            actor.mercyPoints = maxPoints;
            ui.notifications.info("Excess Mercy points fade after a long rest.");
        }
    }
}

/**
 * Update panel display
 */
function updatePanelDisplay(html, actor) {
    const path = actor.martyrPath;
    const currentPoints = path === PATHS.MOON ? actor.vengeancePoints : actor.mercyPoints;
    const maxPoints = getMaxResourcePoints(actor);
    
    html.find('.current-points').text(`${currentPoints} / ${maxPoints}`);
    html.find('.direct-set').val(currentPoints);
}

/**
 * Use Retribution ability
 */
function useRetribution(actor) {
    new Dialog({
        title: "Use Retribution",
        content: `
            <p>Spend Vengeance/Mercy points to activate Retribution:</p>
            <div>
                <label for="points-spent">Points to spend (max 5):</label>
                <input type="number" id="points-spent" min="1" max="5" value="1">
            </div>
            <div>
                <label for="target-type">Effect:</label>
                <select id="target-type">
                    <option value="damage">Deal necrotic damage (Moon)</option>
                    <option value="heal">Heal target (Sun)</option>
                </select>
            </div>
        `,
        buttons: {
            use: {
                icon: '<i class="fas fa-bolt"></i>',
                label: "Use Retribution",
                callback: (html) => {
                    const points = parseInt(html.find('#points-spent').val()) || 1;
                    const effectType = html.find('#target-type').val();
                    
                    const path = actor.martyrPath;
                    const currentPoints = path === PATHS.MOON ? actor.vengeancePoints : actor.mercyPoints;
                    
                    if (currentPoints < points) {
                        ui.notifications.warn("Not enough points!");
                        return;
                    }
                    
                    // Spend the points
                    if (path === PATHS.MOON) {
                        actor.vengeancePoints = currentPoints - points;
                    } else {
                        actor.mercyPoints = currentPoints - points;
                    }
                    
                    ui.notifications.info(`Retribution activated! ${effectType === 'damage' ? 'Deal' : 'Heal'} ${points} points.`);
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
 * Add Blood Magic controls to spell sheets
 */
function addBloodMagicControls(app, html) {
    const descriptionTab = html.find('.tab[data-tab="description"]');
    if (descriptionTab.length === 0) return;
    
    const cost = app.item.bloodMagicCost;
    const type = app.item.bloodMagicType;
    
    const bloodMagicHtml = $(`
        <div class="blood-magic-controls">
            <h3>Blood Magic Properties</h3>
            <div class="form-group">
                <label>Point Cost:</label>
                <input type="number" name="flags.${MARTYR_MODULE.ID}.bloodMagicCost" value="${cost}" min="0">
            </div>
            <div class="form-group">
                <label>Resource Type:</label>
                <select name="flags.${MARTYR_MODULE.ID}.bloodMagicType">
                    <option value="both" ${type === 'both' ? 'selected' : ''}>Both</option>
                    <option value="vengeance" ${type === 'vengeance' ? 'selected' : ''}>Vengeance Only</option>
                    <option value="mercy" ${type === 'mercy' ? 'selected' : ''}>Mercy Only</option>
                </select>
            </div>
        </div>
    `);
    
    descriptionTab.append(bloodMagicHtml);
}

/**
 * Handle Blood Magic spell casting
 */
Hooks.on("dnd5e.preUseItem", (item, config, options) => {
    if (!item.isBloodMagic || !game.settings.get(MARTYR_MODULE.ID, "enableBloodMagicAutomation")) return true;
    
    const actor = item.actor;
    if (!isMartyr(actor)) return true;
    
    const cost = item.bloodMagicCost;
    const bloodMagicType = item.bloodMagicType;
    const path = actor.martyrPath;
    
    // Check if the spell can be cast with current path
    if (bloodMagicType === "vengeance" && path !== PATHS.MOON) {
        ui.notifications.error("This spell requires the Path of the Moon!");
        return false;
    }
    
    if (bloodMagicType === "mercy" && path !== PATHS.SUN) {
        ui.notifications.error("This spell requires the Path of the Sun!");
        return false;
    }
    
    // Check if actor has enough points
    const currentPoints = path === PATHS.MOON ? actor.vengeancePoints : actor.mercyPoints;
    if (currentPoints < cost) {
        ui.notifications.error(`Not enough ${path === PATHS.MOON ? 'Vengeance' : 'Mercy'} points! Need ${cost}, have ${currentPoints}.`);
        return false;
    }
    
    // Spend the points
    if (path === PATHS.MOON) {
        actor.vengeancePoints = currentPoints - cost;
        ui.notifications.info(`Spent ${cost} Vengeance points to cast ${item.name}`);
    } else {
        actor.mercyPoints = currentPoints - cost;
        ui.notifications.info(`Spent ${cost} Mercy points to cast ${item.name}`);
    }
    
    return true;
});

// Export for use in other scripts
window.MartyrModule = {
    MARTYR_MODULE,
    RESOURCE_TYPES,
    PATHS,
    isMartyr,
    grantVengeancePoints,
    grantMercyPoints,
    getMaxResourcePoints
};

console.log(`${MARTYR_MODULE.NAME} | Module loaded successfully`);
