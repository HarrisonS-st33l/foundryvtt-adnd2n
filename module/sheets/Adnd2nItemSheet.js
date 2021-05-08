export default class Adnd2nItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, { 
            width: 710,
            height: 340,
            classes: ["adnd2n", "sheet", "item"]
        });
    }

    get template() {
        return `systems/adnd2n/templates/sheets/${this.item.data.type}-sheet.hbs`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.adnd2n;
        data.isOwned = this.object.isOwned;
        return data;
    }
}