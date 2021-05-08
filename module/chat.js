import * as Dice from "./dice.js";

export function addChatListeners(html) {
    html.on('click', 'button.attack', onAttack);
    html.on('click', 'button.damage', onDamage);
}

function onAttack(event) {
    const card = event.currentTarget.closest('.weapon');
    let attacker = game.actors.get(card.dataset.ownerId);
    let weapon = attacker.getOwnedItem(card.dataset.itemId);
    Dice.Attack({weapon: weapon, askForOptions: true});
}

function onDamage(event) {
    const card = event.currentTarget.closest('.weapon');
    let attacker = game.actors.get(card.dataset.ownerId);
    let weapon = attacker.getOwnedItem(card.dataset.itemId);
    Dice.Damage({weapon: weapon, askForOptions: true});
}