import { adnd2n } from "../config.js";

export default class Adnd2nCombat extends Combat {
    _sortCombatants(a, b) {
        const initA = Number.isNumeric(a.initiative) ? a.initiative : 9999;
        const initB = Number.isNumeric(b.initiative) ? b.initiative : 9999;
        
        let initDifference = initA - initB;
        if (initDifference != 0){
            return initDifference;
        }
        else {
            return a.tokenId - b.tokenId;
        }
    }

    _prepareCombatant(c, scene, players, settings = {}) {
        let combatant = super._prepareCombatant(c, scene, players, settings);
        combatant.flags.speed = Number.isNumeric(combatant.flags.speed) ? Number(combatant.flags.speed) : adnd2n.combat.defaultSpeed;
        return combatant;
    }

    async _pushHistory(data) {
        let turnHistory = this.getFlag("adnd2n", "turnHistory").slice();
        turnHistory.push(data);
        return this.setFlag("adnd2n", "turnHistory", turnHistory);
    }

    async _popHistory() {
        let turnHistory = this.getFlag("adnd2n", "turnHistory").slice();
        let result = turnHistory.pop();
        await this.setFlag("adnd2n", "turnHistory", turnHistory);
        return result;
    }

    async startCombat() {
        await this.setupTurns();
        await this.setFlag("adnd2n", "turnHistory", []);
        return super.startCombat();
    }

    async nextRound() {
        await this._pushHistory(this.combatants.map(c => {
            return {
                id: c._id,
                initiative: c.initiative
            }
        }));
        await this._pushHistory("newRound");

        await this.resetAll();
        return this.update({ round: this.round + 1, turn: 0 }, {advanceTime: CONFIG.time.roundTime});
    }

    async nextTurn() {
        let missingInitiative = this.combatants.filter(c => c.initiative === null);
        if (missingInitiative.length > 0) {
            missingInitiative.forEach(c =>
                ui.notifications.error(game.i18n.format("adnd2n.combat.missingInitiative", { token: c.token.name })));
            return this;
        }
        return super.nextTurn();
    }

    async _getInitiativeRoll(combatant, formula) {
        const rollData = combatant.actor ? combatant.actor.getRollData() : {};
        let checkOptions = await this.GetInitiativeOptions();
        if (checkOptions.cancelled) {
            return;
        }
        let modifier = checkOptions.modifier;
        rollData.modifier = modifier;
        let r = Roll.create(formula, rollData).roll();
        return r;
    }

    async GetInitiativeOptions() {
        const template = "systems/adnd2n/templates/chat/initiative-dialog.hbs";
        const html = await renderTemplate(template, {});
        
        return new Promise(resolve => {
            const data = {
                title: game.i18n.localize("adnd2n.chat.initiative.title"),
                content: html,
                buttons: {
                    normal: {
                        label: game.i18n.localize("adnd2n.chat.actions.roll"),
                        callback: html => resolve(this._processInitiativeOptions(html[0].querySelector("form")))
                    },
                    cancel: {
                        label: game.i18n.localize("adnd2n.chat.actions.cancel"),
                        callback: html => resolve({cancelled: true})
                    }
                },
                default: "normal",
                close: () => resolve({cancelled: true})
            }

            new Dialog(data, null).render(true);
        });
    }

    _processInitiativeOptions(form) {
        return {
            modifier: parseInt(form.modifier.value)
        }
    }
}