export default class Adnd2nItem extends Item {
    prepareData() {
        super.prepareData();
        const itemData = this.data;
        const data = itemData.data;
        const flags = itemData.flags;

        if (itemData.type === 'weapon') this._prepareWeaponData(itemData);
    }

    _prepareWeaponData(itemData) {
        const data = itemData.data;
        console.log(data);
    }

    chatTemplate = {
        "weapon": "systems/adnd2n/templates/partials/weapon-card.hbs"
    };

    async roll() {
        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker()
        }
        let cardData = {
            ...this.data,
            owner: this.actor.id
        };

        console.log(cardData);
        chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);
        chatData.roll=true;

        return ChatMessage.create(chatData);
    }
}