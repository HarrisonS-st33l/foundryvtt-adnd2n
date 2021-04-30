export default class Adnd2nCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/adnd2n/templates/sheets/character-sheet.hbs",
            classes: ["adnd2n", "sheet", "Character"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.adnd2n;
        return data;
    }
}