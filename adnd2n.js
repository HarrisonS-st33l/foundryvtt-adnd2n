import { adnd2n } from "./module/config.js";
import Adnd2nItemSheet from "./module/sheets/Adnd2nItemSheet.js";
import Adnd2nCharacterSheet from "./module/sheets/Adnd2nCharacterSheet.js";
import Adnd2nActor from "./module/actor/actor.js";
import Adnd2nItem from "./module/item/item.js";
import Adnd2nCombat from "./module/combat/combat.js";
import Adnd2nCombatTracker from "./module/combat/combatTracker.js";
import * as Chat from "./module/chat.js"

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/adnd2n/templates/partials/spell-card.hbs"
    ];

    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    console.log("adnd2n | Initialising AD&D 2.neal System");

    CONFIG.adnd2n = adnd2n;
    CONFIG.Actor.entityClass = Adnd2nActor;
    CONFIG.Item.entityClass = Adnd2nItem;
    CONFIG.Combat.entityClass = Adnd2nCombat;
    CONFIG.ui.combat = Adnd2nCombatTracker;
    CONFIG.time.roundTime = 60;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("adnd2n", Adnd2nItemSheet, { makeDefault: true });
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("adnd2n", Adnd2nCharacterSheet, { makeDefault: true });

    preloadHandlebarsTemplates();

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

    Handlebars.registerHelper('toTitleCase', function(str) {
        return str.replace(/\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
    });

    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
        return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
    });
});

Hooks.on("renderChatLog", (app, html, data) => Chat.addChatListeners(html));