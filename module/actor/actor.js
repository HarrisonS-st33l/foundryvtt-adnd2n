import {strengthTable, dexterityTable, constitutionTable, intelligenceTable, willpowerTable, charismaTable, perceptionTable} from "./abilityScores.js"

export default class Adnd2nActor extends Actor {
    prepareData() {
        super.prepareData();

        let actorData = this.data;
        let data = actorData.data;
        const flags = actorData.flags;

        if (actorData.type === 'character') this._prepareCharacterData(actorData);
    }

    _prepareCharacterData(actorData) {
        const data = actorData.data;

        const strength = data.attributes.strength;
        let exceptionalStrengthRegEx = /(?:^18)(?:[/-](\d{1,3})$|\[(\d{1,3})\]$)/;
        let value = 0;
        if (exceptionalStrengthRegEx.test(strength.value)) {
            let exceptionalStrength = exceptionalStrengthRegEx.exec(strength.value);
            exceptionalStrength = exceptionalStrength[1] ? exceptionalStrength[1] : exceptionalStrength[2];
            if (exceptionalStrength < 1 || exceptionalStrength > 100) {value = 0;}
            else if (exceptionalStrength < 51) {value = '18[01-50]';}
            else if (exceptionalStrength < 76) {value = '18[51-75]';}
            else if (exceptionalStrength < 91) {value = '18[76-90]';}
            else if (exceptionalStrength < 100) {value = '18[91-99]';}
            else {value = '18[00]';}
        } else {        
            value = parseInt(strength.value);
        }
        strength.hitAdjust = strengthTable['hitAdjust'][value];
        strength.damageAdjust = strengthTable['damageAdjust'][value];
        strength.weightAllowance = strengthTable['weightAllowance'][value];
        strength.maxPress = strengthTable['maxPress'][value];
        strength.openDoors = strengthTable['openDoors'][value];
        strength.bendBars = strengthTable['bendBars'][value];
        
        const dexterity = data.attributes.dexterity;
        value = parseInt(dexterity.value);
        dexterity.hitAdjust = dexterityTable['hitAdjust'][value];
        dexterity.defAdjust = dexterityTable['defAdjust'][value];

        const constitution = data.attributes.constitution;
        value = parseInt(constitution.value);
        constitution.hpAdjust = constitutionTable['hpAdjust'][value];
        constitution.systemShock = constitutionTable['systemShock'][value];
        constitution.resurrectionSurvival = constitutionTable['resurrectionSurvival'][value];
        constitution.poisonSave = constitutionTable['poisonSave'][value];
        constitution.regeneration = constitutionTable['regeneration'][value];

        const intelligence = data.attributes.intelligence;
        value = parseInt(intelligence.value);
        intelligence.languages = intelligenceTable['languages'][value];
        intelligence.maxSpellLevel = intelligenceTable['maxSpellLevel'][value];
        intelligence.spellLearnChance = intelligenceTable['spellLearnChance'][value];
        intelligence.maxSpellsPerLevel = intelligenceTable['maxSpellsPerLevel'][value];

        const willpower = data.attributes.willpower;
        value = parseInt(willpower.value);
        willpower.defAdjust = willpowerTable['defAdjust'][value];
        willpower.bonusSpells = willpowerTable['bonusSpells'][value];
        willpower.bonusSpellsPrintable = '';
        if (willpower.bonusSpells === 'None') {
            willpower.bonusSpellsPrintable = 'None';
        } else {
            const bonusSpells = JSON.parse(willpower.bonusSpells);
            if (bonusSpells["1"] > 0) { willpower.bonusSpellsPrintable += `1stx${bonusSpells["1"]}` }
            if (bonusSpells["2"] > 0) { willpower.bonusSpellsPrintable += `, 2ndx${bonusSpells["2"]}` }
            if (bonusSpells["3"] > 0) { willpower.bonusSpellsPrintable += `, 3rdx${bonusSpells["3"]}` }
            if (bonusSpells["4"] > 0) { willpower.bonusSpellsPrintable += `, 4thx${bonusSpells["4"]}` }
            if (bonusSpells["5"] > 0) { willpower.bonusSpellsPrintable += `, 5thx${bonusSpells["5"]}` }
            if (bonusSpells["6"] > 0) { willpower.bonusSpellsPrintable += `, 6thx${bonusSpells["6"]}` }
            if (bonusSpells["7"] > 0) { willpower.bonusSpellsPrintable += `, 7thx${bonusSpells["7"]}` }
        }
        willpower.spellFailure = willpowerTable['spellFailure'][value];

        const charisma = data.attributes.charisma;
        value = parseInt(charisma.value);
        charisma.henchmen = charismaTable['henchmen'][value];
        charisma.loyaltyBase = charismaTable['loyaltyBase'][value];
        charisma.reactionAdjust = charismaTable['reactionAdjust'][value];

        const perception = data.attributes.perception;
        value = parseInt(perception.value);
        perception.surpriseAdjust = perceptionTable['surpriseAdjust'][value];
        perception.illusionImmunity = perceptionTable['illusionImmunity'][value];
        }
}