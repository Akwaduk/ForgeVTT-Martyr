// Martyr Class Module for Foundry VTT
// Implements Vengeance/Mercy resource system and blood magic

class MartyrResourceManager {
    static ID = 'dnd5e-martyr-class';
    
    static SETTINGS = {
        AUTO_CALCULATE_RESOURCES: 'auto-calculate-resources'
    };

    static initialize() {
        this.registerSettings();
        this.registerHooks();
        console.log("Martyr Class | Module initialized");
    }

    static registerSettings() {
        game.settings.register(this.ID, this.SETTINGS.AUTO_CALCULATE_RESOURCES, {
            name: "Auto-calculate Vengeance/Mercy",
            hint: "Automatically calculate Vengeance/Mercy points when damage is taken",
            scope: "world",
            config: true,
            type: Boolean,
            default: true
        });
    }

    static registerHooks() {
        // Hook for when actors take damage
        Hooks.on('preUpdateActor', this._onPreUpdateActor.bind(this));
        
        // Hook for when tokens take damage (for Sun Martyrs)
        Hooks.on('preUpdateToken', this._onPreUpdateToken.bind(this));
        
        // Hook for character sheet rendering
        Hooks.on('renderActorSheet5eCharacter', this._onRenderCharacterSheet.bind(this));
        
        // Hook for adding custom resources to character sheets
        Hooks.on('dnd5e.getActorSheetHeaderButtons', this._addMartyrControls.bind(this));
        
        // Hook for long rest
        Hooks.on('dnd5e.longRest', this._onLongRest.bind(this));
        
        // Hook for rendering chat messages with roll buttons
        Hooks.on('renderChatMessage', this._onRenderChatMessage.bind(this));
    }

    static _onPreUpdateActor(actor, updateData, options, userId) {
        if (!game.settings.get(this.ID, this.SETTINGS.AUTO_CALCULATE_RESOURCES)) return;
        if (!this._isMartyr(actor)) return;

        const currentHP = actor.system.attributes.hp.value;
        const newHP = updateData?.system?.attributes?.hp?.value;
        
        if (newHP !== undefined && newHP < currentHP) {
            const damage = currentHP - newHP;
            this._handleMartyrDamage(actor, damage);
        }
    }

    static _isMartyr(actor) {
        return actor.items.some(item => 
            item.type === 'class' && 
            item.name.toLowerCase().includes('martyr')
        );
    }

    static _getMartyrPath(actor) {
        const moonFeature = actor.items.find(item => 
            item.name.toLowerCase().includes('disciple of the moon')
        );
        const sunFeature = actor.items.find(item => 
            item.name.toLowerCase().includes('disciple of the sun')
        );
        
        if (moonFeature) return 'moon';
        if (sunFeature) return 'sun';
        return null;
    }

    static _handleMartyrDamage(actor, damage) {
        const path = this._getMartyrPath(actor);
        if (!path) return;

        const martyrLevel = this._getMartyrLevel(actor);
        const conMod = actor.system.abilities.con.mod;
        const maxPoints = martyrLevel * conMod;
        
        if (path === 'moon') {
            // Vengeance points for taking damage
            const vengeanceGain = Math.min(Math.floor(damage / 2), 7);
            this._addVengeancePoints(actor, vengeanceGain, maxPoints);
        }
        // Sun path gains Mercy from ally damage, handled differently
    }

    static _getMartyrLevel(actor) {
        const martyrClass = actor.items.find(item => 
            item.type === 'class' && 
            item.name.toLowerCase().includes('martyr')
        );
        return martyrClass?.system?.levels || 0;
    }

    static _addVengeancePoints(actor, points, maxPoints) {
        const currentVengeance = actor.getFlag(this.ID, 'vengeance') || 0;
        const newVengeance = Math.min(currentVengeance + points, maxPoints);
        
        actor.setFlag(this.ID, 'vengeance', newVengeance);
        
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<div class="martyr-resource">
                <h3>Vengeance Gained</h3>
                <p>Gained ${points} Vengeance points from suffering (${newVengeance}/${maxPoints})</p>
            </div>`
        });
    }

    static _addMercyPoints(actor, points, maxPoints) {
        const currentMercy = actor.getFlag(this.ID, 'mercy') || 0;
        const newMercy = Math.min(currentMercy + points, maxPoints);
        
        actor.setFlag(this.ID, 'mercy', newMercy);
        
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<div class="martyr-resource">
                <h3>Mercy Gained</h3>
                <p>Gained ${points} Mercy points from ally suffering (${newMercy}/${maxPoints})</p>
            </div>`
        });
    }

    static _onRenderCharacterSheet(sheet, html, data) {
        if (!this._isMartyr(sheet.actor)) return;

        this._addMartyrResourceDisplay(sheet, html, data);
    }

    static _addMartyrResourceDisplay(sheet, html, data) {
        const actor = sheet.actor;
        const path = this._getMartyrPath(actor);
        if (!path) return;

        const martyrLevel = this._getMartyrLevel(actor);
        const conMod = actor.system.abilities.con.mod;
        const maxPoints = martyrLevel * conMod;
        
        const currentPoints = path === 'moon' 
            ? actor.getFlag(this.ID, 'vengeance') || 0
            : actor.getFlag(this.ID, 'mercy') || 0;

        const resourceName = path === 'moon' ? 'Vengeance' : 'Mercy';
        
        // Find the resources section and add our custom resource
        const resourcesDiv = html.find('.tab[data-tab="details"] .resources');
        if (resourcesDiv.length) {
            const martyrResourceHtml = `
                <div class="form-group martyr-resource">
                    <label>${resourceName} Points</label>
                    <div class="form-fields">
                        <input type="number" name="flags.${this.ID}.${path === 'moon' ? 'vengeance' : 'mercy'}" 
                               value="${currentPoints}" min="0" max="${maxPoints}">
                        <span class="sep">/</span>
                        <span class="max">${maxPoints}</span>
                    </div>
                </div>
            `;
            resourcesDiv.append(martyrResourceHtml);
        }
    }

    static _addMartyrControls(buttons, sheet) {
        if (!this._isMartyr(sheet.actor)) return;

        buttons.unshift({
            label: "Martyr",
            class: "martyr-controls",
            icon: "fas fa-heart-broken",
            onclick: () => this._openMartyrControls(sheet.actor)
        });
    }

    static _openMartyrControls(actor) {
        const path = this._getMartyrPath(actor);
        const resourceName = path === 'moon' ? 'Vengeance' : 'Mercy';
        const currentPoints = path === 'moon' 
            ? actor.getFlag(this.ID, 'vengeance') || 0
            : actor.getFlag(this.ID, 'mercy') || 0;

        new Dialog({
            title: `Martyr ${resourceName} Controls`,
            content: `
                <div class="martyr-controls-dialog">
                    <h3>Current ${resourceName}: ${currentPoints}</h3>
                    <div class="form-group">
                        <label>Spend ${resourceName} Points:</label>
                        <input type="number" id="spend-points" min="0" max="${currentPoints}" value="0">
                        <button type="button" id="spend-btn">Spend</button>
                    </div>
                    <div class="form-group">
                        <label>Add ${resourceName} Points:</label>
                        <input type="number" id="add-points" min="0" value="0">
                        <button type="button" id="add-btn">Add</button>
                    </div>
                    <hr>
                    <div class="blood-magic-section">
                        <h4>Quick Blood Magic</h4>
                        <button type="button" class="blood-magic-btn" data-cost="5" data-name="Flesh Bolt">
                            Flesh Bolt (5)
                        </button>
                        <button type="button" class="blood-magic-btn" data-cost="10" data-name="Gabriel's Trumpet">
                            Gabriel's Trumpet (10)
                        </button>
                        <button type="button" class="blood-magic-btn" data-cost="30" data-name="Absolution">
                            Absolution (30)
                        </button>
                    </div>
                </div>
            `,
            buttons: {
                close: {
                    label: "Close"
                }
            },
            render: (html) => {
                html.find('#spend-btn').click(() => {
                    const spendAmount = parseInt(html.find('#spend-points').val()) || 0;
                    this._spendMartyrPoints(actor, spendAmount, path);
                });
                
                html.find('#add-btn').click(() => {
                    const addAmount = parseInt(html.find('#add-points').val()) || 0;
                    this._addMartyrPoints(actor, addAmount, path);
                });

                html.find('.blood-magic-btn').click((event) => {
                    const cost = parseInt(event.currentTarget.dataset.cost);
                    const spellName = event.currentTarget.dataset.name;
                    this._castBloodMagic(actor, spellName, cost, path);
                });
            }
        }).render(true);
    }

    static _spendMartyrPoints(actor, amount, path) {
        const flagName = path === 'moon' ? 'vengeance' : 'mercy';
        const currentPoints = actor.getFlag(this.ID, flagName) || 0;
        
        if (amount > currentPoints) {
            ui.notifications.warn(`Not enough ${path === 'moon' ? 'Vengeance' : 'Mercy'} points!`);
            return;
        }
        
        const newPoints = currentPoints - amount;
        actor.setFlag(this.ID, flagName, newPoints);
        
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<div class="martyr-resource">
                <h3>${path === 'moon' ? 'Vengeance' : 'Mercy'} Spent</h3>
                <p>Spent ${amount} points (${newPoints} remaining)</p>
            </div>`
        });
    }

    static _addMartyrPoints(actor, amount, path) {
        const martyrLevel = this._getMartyrLevel(actor);
        const conMod = actor.system.abilities.con.mod;
        const maxPoints = martyrLevel * conMod;
        
        const flagName = path === 'moon' ? 'vengeance' : 'mercy';
        const currentPoints = actor.getFlag(this.ID, flagName) || 0;
        const newPoints = Math.min(currentPoints + amount, maxPoints);
        
        actor.setFlag(this.ID, flagName, newPoints);
        
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<div class="martyr-resource">
                <h3>${path === 'moon' ? 'Vengeance' : 'Mercy'} Gained</h3>
                <p>Gained ${amount} points (${newPoints}/${maxPoints})</p>
            </div>`
        });
    }

    static _castBloodMagic(actor, spellName, cost, path) {
        const flagName = path === 'moon' ? 'vengeance' : 'mercy';
        const currentPoints = actor.getFlag(this.ID, flagName) || 0;
        
        if (cost > currentPoints) {
            ui.notifications.warn(`Not enough ${path === 'moon' ? 'Vengeance' : 'Mercy'} points for ${spellName}!`);
            return;
        }
        
        const newPoints = currentPoints - cost;
        actor.setFlag(this.ID, flagName, newPoints);
        
        // Create enhanced blood magic message with spell effects
        const spellEffects = this._getSpellEffects(spellName, actor, path);
        
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<div class="martyr-spell">
                <h3>Blood Magic: ${spellName}</h3>
                <p>Spent ${cost} ${path === 'moon' ? 'Vengeance' : 'Mercy'} points</p>
                <p>${newPoints} points remaining</p>
                <div class="spell-effects">
                    ${spellEffects}
                </div>
            </div>`
        });
    }

    static _getSpellEffects(spellName, actor, path) {
        const martyrLevel = this._getMartyrLevel(actor);
        const chosenMod = path === 'moon' ? actor.system.abilities.cha.mod : actor.system.abilities.wis.mod;
        
        switch(spellName) {
            case 'Flesh Bolt':
                const fleshBoltDice = martyrLevel >= 20 ? '4d8' : martyrLevel >= 11 ? '3d8' : '2d8';
                return `<p><strong>Ranged Spell Attack:</strong> ${fleshBoltDice} necrotic damage</p>
                        <p><strong>Healing:</strong> You regain ¼ of damage dealt</p>
                        <p><strong>Range:</strong> 80 feet</p>`;
            
            case "Gabriel's Trumpet":
                return `<p><strong>60-foot Cone:</strong> WIS save or 1d4 force damage + taunted</p>
                        <p><strong>Success:</strong> Taunted but no damage</p>
                        <p><strong>DC:</strong> ${8 + actor.system.attributes.prof + chosenMod}</p>`;
            
            case 'Absolution':
                return `<p><strong>Self:</strong> Take 6d10 lightning damage</p>
                        <p><strong>Enemies in 30 ft:</strong> WIS save or take force damage = ½ your lightning damage</p>
                        <p><strong>Failed save:</strong> Also pushed 20 ft and knocked prone</p>
                        <p><strong>DC:</strong> ${8 + actor.system.attributes.prof + chosenMod}</p>`;
            
            default:
                return '<p><em>Use the spell item for detailed effects.</em></p>';
        }
    }

    // Add ally damage tracking for Sun Martyrs
    static _onPreUpdateToken(token, updateData, options, userId) {
        const actor = token.actor;
        if (!actor || !this._isMartyr(actor)) return;
        
        const path = this._getMartyrPath(actor);
        if (path !== 'sun') return;
        
        const currentHP = actor.system.attributes.hp.value;
        const newHP = updateData?.actorData?.system?.attributes?.hp?.value;
        
        if (newHP !== undefined && newHP < currentHP) {
            const damage = currentHP - newHP;
            this._checkForNearbyMartyrSun(token, damage);
        }
    }

    static _checkForNearbyMartyrSun(damagedToken, damage) {
        const nearbyTokens = canvas.tokens.placeables.filter(t => {
            const distance = canvas.grid.measureDistance(damagedToken, t);
            return distance <= 30 && t.actor && this._isMartyr(t.actor) && this._getMartyrPath(t.actor) === 'sun';
        });

        nearbyTokens.forEach(martyrToken => {
            const mercyGain = Math.min(Math.floor(damage / 2), 7);
            const martyrLevel = this._getMartyrLevel(martyrToken.actor);
            const conMod = martyrToken.actor.system.abilities.con.mod;
            const maxPoints = martyrLevel * conMod;
            
            this._addMercyPoints(martyrToken.actor, mercyGain, maxPoints);
        });
    }

    // Enhanced resource calculation with level 20 handling
    static _calculateMaxPoints(actor) {
        const martyrLevel = this._getMartyrLevel(actor);
        const conMod = actor.system.abilities.con.mod;
        
        if (martyrLevel >= 20) {
            return 9999; // Unlimited at level 20
        }
        
        return martyrLevel * conMod;
    }

    // Add long rest resource reset
    static _onLongRest(actor) {
        if (!this._isMartyr(actor)) return;
        
        const path = this._getMartyrPath(actor);
        if (!path) return;
        
        const flagName = path === 'moon' ? 'vengeance' : 'mercy';
        actor.setFlag(this.ID, flagName, 0);
        
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<div class="martyr-resource">
                <h3>Long Rest</h3>
                <p>${path === 'moon' ? 'Vengeance' : 'Mercy'} points reset to 0</p>
            </div>`
        });
    }

    // Add chat message rendering for interactive rolls
    static _onRenderChatMessage(message, html, data) {
        if (!message.content.includes('martyr-spell')) return;
        
        html.find('.spell-roll-btn').click(async (event) => {
            const rollType = event.currentTarget.dataset.roll;
            const actorId = event.currentTarget.dataset.actor;
            const actor = game.actors.get(actorId);
            
            if (!actor) return;
            
            await this._performSpellRoll(actor, rollType);
        });
    }

    static async _performSpellRoll(actor, rollType) {
        const path = this._getMartyrPath(actor);
        const chosenMod = path === 'moon' ? actor.system.abilities.cha.mod : actor.system.abilities.wis.mod;
        const spellAttackBonus = actor.system.attributes.prof + chosenMod;
        const spellDC = 8 + actor.system.attributes.prof + chosenMod;
        
        let roll;
        let flavor;
        
        switch(rollType) {
            case 'flesh-bolt-attack':
                roll = await new Roll(`1d20 + ${spellAttackBonus}`).evaluate();
                flavor = "Flesh Bolt - Ranged Spell Attack";
                break;
            
            case 'flesh-bolt-damage':
                const martyrLevel = this._getMartyrLevel(actor);
                const dice = martyrLevel >= 20 ? '4d8' : martyrLevel >= 11 ? '3d8' : '2d8';
                roll = await new Roll(dice).evaluate();
                flavor = "Flesh Bolt - Necrotic Damage";
                break;
            
            case 'gabriels-trumpet-damage':
                roll = await new Roll('1d4').evaluate();
                flavor = "Gabriel's Trumpet - Force Damage";
                break;
            
            case 'absolution-self':
                roll = await new Roll('6d10').evaluate();
                flavor = "Absolution - Self Lightning Damage";
                break;
            
            default:
                return;
        }
        
        if (roll) {
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor }),
                flavor: flavor
            });
        }
    }
}

// Hook registration
Hooks.once('init', () => {
    MartyrResourceManager.initialize();
});

// Export for module compatibility
window.MartyrResourceManager = MartyrResourceManager;