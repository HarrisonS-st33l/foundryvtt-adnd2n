import Adnd2nItemSheet from "./module/sheets/Adnd2nItemSheet.js";
import Adnd2nCharacterSheet from "./module/sheets/Adnd2nCharacterSheet.js";
import Adnd2nActor from "./module/actor/actor.js";
import Adnd2nItem from "./module/item/item.js";
import { adnd2n } from "./module/config.js";
import * as Chat from "./module/chat.js"


Hooks.once("init", function () {
    console.log("adnd2n | Initialising AD&D 2.neal System");

    CONFIG.adnd2n = adnd2n;
    CONFIG.Actor.entityClass = Adnd2nActor;
    CONFIG.Item.entityClass = Adnd2nItem;

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