export default class Adnd2nCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/adnd2n/templates/sheets/character-sheet.hbs",
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
            classes: ["adnd2n", "sheet", "character"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.adnd2n;
        console.log(data);
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
}