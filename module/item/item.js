export default class Adnd2nItem extends Item {
    prepareData() {
        super.prepareData();
        const itemData = this.data;
        const data = itemData.data;
        const flags = itemData.flags;

        if (itemData.type === 'weapon') this._prepareWeaponData(itemData);
        if (itemData.type === 'spell') this._prepareSpellData(itemData);
    }

    _prepareWeaponData(itemData) {
        const data = itemData.data;
    }

    _prepareSpellData(itemData) {
        const data = itemData.data;
    }

    chatTemplate = {
        "weapon": "systems/adnd2n/templates/chat/weapon-card.hbs",
        "spell": "systems/adnd2n/templates/partials/spell-card.hbs"
    };

    async roll() {
        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker()
        }
        let cardData = {
            ...this.data,
            owner: this.actor.data._id
        };

        chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);
        chatData.roll=true;

        return ChatMessage.create(chatData);
    }
}