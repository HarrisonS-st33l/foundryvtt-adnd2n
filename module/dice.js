export async function AbilityCheck({
    type = null,
    actorData = null,
    actionValue = null,
    modifier = 0,
    extraMessageData = {},
    askForOptions = null,
    sendMessage = true } = {}) {

    const messageTemplate = "systems/adnd2n/templates/chat/ability-check.hbs";

    if (askForOptions) {
        let checkOptions = await GetAbilityCheckOptions(type);
        if (checkOptions.cancelled) {
            return;
        }
        modifier = checkOptions.modifier;
    }

    let baseDice = "1d20";
    let rollFormula = `${baseDice} + @actionValue`;
    
    if (modifier != 0) {
        rollFormula += " + @modifier";
    }

    let rollData = {
        ...actorData,
        actionValue: actionValue,
        modifier: modifier
    };

    let rollResult = new Roll(rollFormula, rollData).roll();
    let renderedRoll = await rollResult.render();

    let templateContext = {
        type: type,
        roll: renderedRoll
    }

    let chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: await renderTemplate(messageTemplate, templateContext),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: rollResult
    }

    ChatMessage.create(chatData);
}


async function GetAbilityCheckOptions(ability) {
    const template = "systems/adnd2n/templates/chat/ability-check-dialog.hbs";
    const html = await renderTemplate(template, {});
    let abilityName = ability.replace(/\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

    return new Promise(resolve => {
        const data = {
            title: game.i18n.format("adnd2n.chat.abilityCheck.title", { type: abilityName }),
            content: html,
            buttons: {
                normal: {
                    label: game.i18n.localize("adnd2n.chat.actions.roll"),
                    callback: html => resolve(_processAbilityCheckOptions(html[0].querySelector("form")))
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

function _processAbilityCheckOptions(form) {
    return {
        modifier: parseInt(form.modifier.value)
    }
}

export async function Attack({weapon = null, askForOptions = null, modifier = 0}) {

    const messageTemplate = "systems/adnd2n/templates/chat/attack-roll.hbs";

    if (askForOptions) {
        let checkOptions = await GetAttackOptions(weapon.data.name);
        if (checkOptions.cancelled) {
            return;
        }
        modifier = checkOptions.modifier;
    }

    let rollFormula = "1d20 + @toHit";
    if (modifier != 0) {
        rollFormula += " + @modifier"
    }

    let rollData = {
        toHit: weapon.data.data.toHit,
        modifier: modifier
    }

    let rollResult = new Roll(rollFormula, rollData).roll();
    let renderedRoll = await rollResult.render();

    let templateContext = {
        weapon: weapon.data,
        roll: renderedRoll
    }
    
    let chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: await renderTemplate(messageTemplate, templateContext),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: rollResult
    }

    ChatMessage.create(chatData);
}

async function GetAttackOptions(weapon) {
    const template = "systems/adnd2n/templates/chat/attack-dialog.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {
        const data = {
            title: game.i18n.format("adnd2n.chat.attack.title", { weapon: weapon }),
            content: html,
            buttons: {
                normal: {
                    label: game.i18n.localize("adnd2n.chat.actions.roll"),
                    callback: html => resolve(_processAttackOptions(html[0].querySelector("form")))
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

function _processAttackOptions(form) {
    return {
        modifier: parseInt(form.modifier.value)
    }
}

export async function Damage({weapon = null, askForOptions = null, modifier = 0, crit = 1}) {
    const messageTemplate = "systems/adnd2n/templates/chat/damage-roll.hbs";

    if (askForOptions) {
        let checkOptions = await GetDamageOptions(weapon.data.name);
        if (checkOptions.cancelled) {
            return;
        }
        modifier = checkOptions.modifier;
        crit = checkOptions.crit;
    }

    let rollFormula = "@damage + ".repeat(crit);

    rollFormula += "@toDam";
    if (modifier != 0) {
        rollFormula += " + @modifier"
    }

    let rollData = {
        damage: weapon.data.data.damage,
        toDam: weapon.data.data.toDam,
        modifier: modifier
    }

    let rollResult = new Roll(rollFormula, rollData).roll();
    let renderedRoll = await rollResult.render();

    let templateContext = {
        weapon: weapon.data,
        roll: renderedRoll
    }

    let chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: await renderTemplate(messageTemplate, templateContext),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: rollResult
    }
    
    ChatMessage.create(chatData);
}

async function GetDamageOptions(weapon) {
    const template = "systems/adnd2n/templates/chat/damage-dialog.hbs";
    const html = await renderTemplate(template, { config:CONFIG.adnd2n });

    return new Promise(resolve => {
        const data = {
            title: game.i18n.format("adnd2n.chat.damage.title", { weapon: weapon }),
            content: html,
            buttons: {
                normal: {
                    label: game.i18n.localize("adnd2n.chat.actions.roll"),
                    callback: html => resolve(_processDamageOptions(html[0].querySelector("form")))
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

function _processDamageOptions(form) {
    return {
        modifier: parseInt(form.modifier.value),
        crit: parseInt(form.crit.value)
    }
}

export async function SavingThrow({
    type = null,
    actorData = null,
    actionValue = null,
    modifier = 0,
    askForOptions = null} = {}) {

    const messageTemplate = "systems/adnd2n/templates/chat/saving-throw.hbs";

    if (askForOptions) {
        let checkOptions = await GetSavingThrowOptions(type);
        if (checkOptions.cancelled) {
            return;
        }
        modifier = checkOptions.modifier;
    }

    let baseDice = "1d20";
    let rollFormula = `${baseDice}`;
    
    if (modifier != 0) {
        rollFormula += " + @modifier";
    }

    let rollData = {
        ...actorData,
        actionValue: actionValue,
        modifier: modifier
    };

    let rollResult = new Roll(rollFormula, rollData).roll();
    let success = (rollResult._total > actionValue) ? 'passed' : 'failed'; 
    let renderedRoll = await rollResult.render();

    let templateContext = {
        type: type,
        roll: renderedRoll,
        success: success
    }  

    let chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: await renderTemplate(messageTemplate, templateContext),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: rollResult,
    }

    ChatMessage.create(chatData);
}


async function GetSavingThrowOptions(savingThrow) {
    const template = "systems/adnd2n/templates/chat/saving-throw-dialog.hbs";
    const html = await renderTemplate(template, {});
    let savingThrowName = game.i18n.localize(`adnd2n.savingThrows.${savingThrow}`)

    return new Promise(resolve => {
        const data = {
            title: game.i18n.format("adnd2n.chat.savingThrow.title", { type: savingThrowName }),
            content: html,
            buttons: {
                normal: {
                    label: game.i18n.localize("adnd2n.chat.actions.roll"),
                    callback: html => resolve(_processSavingThrowOptions(html[0].querySelector("form")))
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

function _processSavingThrowOptions(form) {
    return {
        modifier: parseInt(form.modifier.value)
    }
}