import * as Dice from "../dice.js";

export default class Adnd2nCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 1000,
            template: "systems/adnd2n/templates/sheets/character-sheet.hbs",
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
            classes: ["adnd2n", "sheet", "character"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.adnd2n;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if (!this.options.editable) return;

        html.find('.weapon-create').click(this._onItemCreate.bind(this));

        html.find('.weapon-edit').click(ev => {
            const wr = $(ev.currentTarget).parents(".weapon");
            const weapon = this.actor.getOwnedItem(wr.data("itemId"));
            weapon.sheet.render(true);
        });
        html.find('.weapon-delete').click(ev => {
            const wr = $(ev.currentTarget).parents(".weapon");
            this.actor.deleteOwnedItem(wr.data('itemId'));
            wr.slideUp(200, () => this.render(false));
        });
        if (this.actor.owner) {
            html.find('.rollable').click(this._onRoll.bind(this));
            html.find('.rollable-item').click(this._onRollItem.bind(this));
            html.find('.rollable-attribute').click(this._onRollAttribute.bind(this));
            html.find('.rollable-save').click(this._onRollSave.bind(this));
            html.find('.rollable-derived').click(this._onRollDerived.bind(this));
            html.find('.rollable-surprise').click(this._onRollSurprise.bind(this));
        }
    }

    _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        const data = duplicate(header.dataset);
        const name = `New ${type.capitalize()}`;
        const itemData = {
            name: name,
            type: type,
            data: data
        };
        delete itemData.data["type"];
        return this.actor.createOwnedItem(itemData);
    }

    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        if (dataset.roll) {
            let roll = new Roll(dataset.roll, this.actor.data.data);
            let label = dataset.label ? `Rolling ${dataset.label}` : '';
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({actor: this.actor}),
                flavor: label
            });
        }
    }

    _onRollItem(event) {
        const ItemID = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.getOwnedItem(ItemID);
        item.roll();
    }

    _onRollAttribute(event) {
        const card = event.currentTarget.closest('.row');
        let ability = card.dataset.ability;
        let actionValue = parseInt(this.actor.data.data.attributes[ability].value);
        Dice.AbilityCheck({askForOptions: true, actionValue: actionValue, type: ability});
    }

    _onRollDerived(event) {
        const a = event.currentTarget;
        let ability = a.closest('.row').dataset.ability;
        let score = a.lastElementChild.id;
        let baseDice = a.dataset.base;
        let inverse = a.dataset.inverse === "true";
        let actionValue = parseInt(this.actor.data.data.attributes[ability][score]);
        Dice.DerivedAbilityCheck({askForOptions: true, actionValue: actionValue, baseDice: baseDice, type: score, ability: ability, inverse: inverse});
    }
S
    _onRollSave(event) {
        const card = event.currentTarget.closest('.savingThrow');
        let savingThrow = card.dataset.savingThrow;
        let actionValue = parseInt(this.actor.data.data.savingThrows[savingThrow]);
        Dice.SavingThrow({askForOptions: true, actionValue: actionValue, type: savingThrow});
    }

    _onRollSurprise(event) {
        const card = event.currentTarget;
        let actionValue = parseInt(this.actor.data.data.attributes.perception.surpriseAdjust);
        Dice.SurpriseRoll({askForOptions: true, actionValue: actionValue});
    }
}