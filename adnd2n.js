import Adnd2nItemSheet from "./module/sheets/Adnd2nItemSheet.js";
import Adnd2nCharacterSheet from "./module/sheets/Adnd2nCharacterSheet.js";
import Adnd2nActor from "./module/actor/actor.js";
import { adnd2n } from "./module/config.js";

Hooks.once("init", function () {
    console.log("adnd2n | Initialising AD&D 2.neal System");

    CONFIG.adnd2n = adnd2n;
    CONFIG.Actor.entityClass = Adnd2nActor;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("adnd2n", Adnd2nItemSheet, { makeDefault: true });
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("adnd2n", Adnd2nCharacterSheet, { makeDefault: true });

    Handlebars.registerHelper('concat', function () {
        var outStr = '';
        for (var arg in arguments) {
            if (typeof arguments[arg] != "object") {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    Handlebars.registerHelper('toLowerCase', function(str) {
        return str.toLowerCase();
    });

    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
        return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
    });
});