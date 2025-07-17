/**
 * Martyr UI Application - Interactive Control Panel
 * Provides a dedicated application window for managing Martyr resources
 */

export class MartyrControlPanel extends Application {
    constructor(actor, options = {}) {
        super(options);
        this.actor = actor;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "martyr-control-panel",
            classes: ["martyr", "control-panel"],
            template: "modules/dnd5e-martyr-class/templates/martyr-control-panel.hbs",
            width: 400,
            height: 600,
            minimizable: true,
            resizable: true,
            title: "Martyr Control Panel"
        });
    }

    get title() {
        return `${game.i18n.localize("MARTYR.UI.ControlPanel")} - ${this.actor.name}`;
    }

    getData() {
        const data = super.getData();
        const actor = this.actor;
        const path = actor.getFlag("dnd5e-martyr-class", "path");
        
        // Copy actor data and add martyrPath for template compatibility
        data.actor = foundry.utils.duplicate(actor);
        data.actor.martyrPath = path;
        data.martyrPath = path;
        
        // Calculate resource points
        data.currentPoints = path === "moon" ? 
            actor.getFlag("dnd5e-martyr-class", "vengeance") || 0 :
            actor.getFlag("dnd5e-martyr-class", "mercy") || 0;
        data.maxPoints = this.getMaxResourcePoints(actor);
        data.resourcePercentage = data.maxPoints > 0 ? Math.round((data.currentPoints / data.maxPoints) * 100) : 0;
        
        // Get feature uses
        data.retributionUses = this.getFeatureUses(actor, "Retribution");
        data.exactVengeanceUses = this.getFeatureUses(actor, "Exact Vengeance") || 
                                 this.getFeatureUses(actor, "Merciful Patience");
        data.vindictiveDivinityUses = this.getFeatureUses(actor, "Vindictive Divinity");
        
        return data;
    }

    getMaxResourcePoints(actor) {
        const level = actor.system?.details?.level || 1;
        const conMod = actor.system?.abilities?.con?.mod || 0;
        return level >= 20 ? 999 : level * Math.max(1, conMod);
    }

    getFeatureUses(actor, featureName) {
        const feature = actor.items.find(i => i.name === featureName);
        if (!feature) return 0;
        return feature.system?.uses?.value || 0;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Resource adjustment buttons
        html.find('.adjust-btn').click(this._onAdjustPoints.bind(this));
        html.find('.set-btn').click(this._onSetPoints.bind(this));
        
        // Action buttons
        html.find('[data-action="retribution"]').click(this._onUseRetribution.bind(this));
        html.find('[data-action="exact-vengeance"]').click(this._onUseExactVengeance.bind(this));
        html.find('[data-action="vindictive-divinity"]').click(this._onUseVindictiveDivinity.bind(this));
        
        // Rest buttons
        html.find('.rest-btn').click(this._onRest.bind(this));
        
        // Close button
        html.find('[data-action="close"]').click(() => this.close());
    }

    async _onAdjustPoints(event) {
        const amount = parseInt(event.currentTarget.dataset.amount);
        const path = this.actor.getFlag("dnd5e-martyr-class", "path");
        const currentPoints = path === "moon" ? 
            this.actor.getFlag("dnd5e-martyr-class", "vengeance") || 0 :
            this.actor.getFlag("dnd5e-martyr-class", "mercy") || 0;
        
        const maxPoints = this.getMaxResourcePoints(this.actor);
        const newPoints = Math.max(0, Math.min(maxPoints, currentPoints + amount));
        
        const flagKey = path === "moon" ? "vengeance" : "mercy";
        await this.actor.setFlag("dnd5e-martyr-class", flagKey, newPoints);
        
        this.render();
    }

    async _onSetPoints(event) {
        const input = event.currentTarget.parentElement.querySelector('.points-input');
        const newValue = parseInt(input.value) || 0;
        const maxPoints = this.getMaxResourcePoints(this.actor);
        const clampedValue = Math.max(0, Math.min(maxPoints, newValue));
        
        const path = this.actor.getFlag("dnd5e-martyr-class", "path");
        const flagKey = path === "moon" ? "vengeance" : "mercy";
        await this.actor.setFlag("dnd5e-martyr-class", flagKey, clampedValue);
        
        this.render();
    }

    _onUseRetribution(event) {
        new Dialog({
            title: game.i18n.localize("MARTYR.Dialogs.RetributionTitle"),
            content: `
                <form>
                    <div class="form-group">
                        <label>${game.i18n.localize("MARTYR.Dialogs.PointsToSpend").replace("{max}", "5")}</label>
                        <input type="number" name="points" min="1" max="5" value="1">
                    </div>
                    <div class="form-group">
                        <label>${game.i18n.localize("MARTYR.Dialogs.Effect")}</label>
                        <select name="effect">
                            <option value="damage">${game.i18n.localize("MARTYR.Dialogs.DealDamage")}</option>
                            <option value="heal">${game.i18n.localize("MARTYR.Dialogs.HealTarget")}</option>
                        </select>
                    </div>
                </form>
            `,
            buttons: {
                use: {
                    icon: '<i class="fas fa-bolt"></i>',
                    label: game.i18n.localize("MARTYR.Features.Retribution"),
                    callback: (html) => this._executeRetribution(html)
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("MARTYR.UI.Cancel")
                }
            }
        }).render(true);
    }

    async _executeRetribution(html) {
        const formData = new FormData(html.find('form')[0]);
        const points = parseInt(formData.get('points')) || 1;
        const effect = formData.get('effect');
        
        const path = this.actor.getFlag("dnd5e-martyr-class", "path");
        const currentPoints = path === "moon" ? 
            this.actor.getFlag("dnd5e-martyr-class", "vengeance") || 0 :
            this.actor.getFlag("dnd5e-martyr-class", "mercy") || 0;
        
        if (currentPoints < points) {
            ui.notifications.warn(game.i18n.localize("MARTYR.Errors.InsufficientPoints"));
            return;
        }
        
        // Spend points
        const flagKey = path === "moon" ? "vengeance" : "mercy";
        await this.actor.setFlag("dnd5e-martyr-class", flagKey, currentPoints - points);
        
        // Use feature
        const retribution = this.actor.items.find(i => i.name === "Retribution");
        if (retribution && retribution.system.uses.value > 0) {
            await retribution.update({"system.uses.value": retribution.system.uses.value - 1});
        }
        
        const effectText = effect === "damage" ? 
            game.i18n.localize("MARTYR.Dialogs.DealDamage") : 
            game.i18n.localize("MARTYR.Dialogs.HealTarget");
        
        ui.notifications.info(
            game.i18n.localize("MARTYR.Notifications.RetributionActivated")
                .replace("{effect}", effectText)
                .replace("{points}", points)
        );
        
        this.render();
    }

    _onUseExactVengeance(event) {
        const path = this.actor.getFlag("dnd5e-martyr-class", "path");
        const currentPoints = path === "moon" ? 
            this.actor.getFlag("dnd5e-martyr-class", "vengeance") || 0 :
            this.actor.getFlag("dnd5e-martyr-class", "mercy") || 0;
        
        if (currentPoints < 10) {
            ui.notifications.warn("Need at least 10 points to use this feature!");
            return;
        }
        
        const featureName = path === "moon" ? "Exact Vengeance" : "Merciful Patience";
        const feature = this.actor.items.find(i => i.name === featureName);
        
        if (!feature || feature.system.uses.value <= 0) {
            ui.notifications.warn("No uses of this feature remaining!");
            return;
        }
        
        new Dialog({
            title: `Use ${featureName}`,
            content: `<p>Spend all ${currentPoints} points for ${Math.floor(currentPoints/2)} additional ${path === "moon" ? "damage" : "healing"}?</p>`,
            buttons: {
                use: {
                    icon: '<i class="fas fa-magic"></i>',
                    label: "Use Feature",
                    callback: async () => {
                        const flagKey = path === "moon" ? "vengeance" : "mercy";
                        await this.actor.setFlag("dnd5e-martyr-class", flagKey, 0);
                        await feature.update({"system.uses.value": feature.system.uses.value - 1});
                        ui.notifications.info(`${featureName} activated for ${Math.floor(currentPoints/2)} bonus ${path === "moon" ? "damage" : "healing"}!`);
                        this.render();
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel"
                }
            }
        }).render(true);
    }

    _onUseVindictiveDivinity(event) {
        const feature = this.actor.items.find(i => i.name === "Vindictive Divinity");
        if (!feature || feature.system.uses.value <= 0) {
            ui.notifications.warn("No uses of Vindictive Divinity remaining!");
            return;
        }
        
        new Dialog({
            title: "Vindictive Divinity",
            content: "<p>Activate Vindictive Divinity for 1 minute of enhanced power?</p>",
            buttons: {
                activate: {
                    icon: '<i class="fas fa-crown"></i>',
                    label: "Activate",
                    callback: async () => {
                        await feature.update({"system.uses.value": feature.system.uses.value - 1});
                        ui.notifications.info("Vindictive Divinity activated! You gain enhanced power for 1 minute.");
                        this.render();
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel"
                }
            }
        }).render(true);
    }

    async _onRest(event) {
        const restType = event.currentTarget.dataset.rest;
        
        if (restType === "long") {
            const maxPoints = this.getMaxResourcePoints(this.actor);
            const path = this.actor.getFlag("dnd5e-martyr-class", "path");
            const currentPoints = path === "moon" ? 
                this.actor.getFlag("dnd5e-martyr-class", "vengeance") || 0 :
                this.actor.getFlag("dnd5e-martyr-class", "mercy") || 0;
            
            if (currentPoints > maxPoints) {
                const flagKey = path === "moon" ? "vengeance" : "mercy";
                await this.actor.setFlag("dnd5e-martyr-class", flagKey, maxPoints);
                ui.notifications.info("Excess points fade after a long rest.");
            }
            
            // Reset feature uses
            const features = this.actor.items.filter(i => 
                i.getFlag("dnd5e-martyr-class", "isMartyFeature") && 
                i.system.uses?.per === "lr"
            );
            
            for (const feature of features) {
                await feature.update({"system.uses.value": feature.system.uses.max});
            }
        }
        
        this.render();
    }
}

// Export for global access
window.MartyrControlPanel = MartyrControlPanel;
