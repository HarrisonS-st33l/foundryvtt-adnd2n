import Adnd2nItemSheet from "./module/sheets/Adnd2nItemSheet.js";
import Adnd2nCharacterSheet from "./module/sheets/Adnd2nCharacterSheet.js"
import { adnd2n } from "./module/config.js";

Hooks.once("init", function () {
    console.log("adnd2n | Initialising AD&D 2.neal System");

    CONFIG.adnd2n = adnd2n;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("adnd2n", Adnd2nItemSheet, { makeDefault: true });
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("adnd2n", Adnd2nCharacterSheet, { makeDefault: true });
});