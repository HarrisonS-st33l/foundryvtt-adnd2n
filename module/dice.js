export async function Attack(weapon) {
    const messageTemplate = "systems/adnd2n/templates/chat/attack-roll.hbs";
    let rollFormula = "1d20 + @toHit";
    let rollResult = new Roll(rollFormula, weapon.data.data).roll();
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

export async function Damage(weapon) {
    const messageTemplate = "systems/adnd2n/templates/chat/damage-roll.hbs";
    console.log(weapon.data.data); 
    let rollFormula = "@damage + @toDam";
    let rollResult = new Roll(rollFormula, weapon.data.data).roll();
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