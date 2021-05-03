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
    }
}