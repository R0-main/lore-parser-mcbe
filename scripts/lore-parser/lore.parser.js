import Template from './template';
import LoreError from './lore.error';
class LoreParse {
    constructor(itemStack, template) {
        this.itemStack = itemStack;
        this.template = template;
        this.currentLore = this.itemStack.getLore() || [];
    }
    add(...strings) {
        for (let i = 0; i < strings.length; i++) {
            const str = strings[i];
            if (this.currentLore.length + strings.length < LoreError.MAX_LORE_LINE_LENGTH) {
                this.currentLore = [...this.currentLore, str];
                this.itemStack.setLore(this.currentLore);
            }
            else
                new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
        }
    }
    set(key, value) {
        const keyValue = this.template.keys[key];
        this.currentLore = this.currentLore.map((v) => (v.includes(keyValue) ? v.replace(keyValue, value.toString()) : v));
        this.itemStack.setLore(this.currentLore);
    }
    get(key) {
        const keyValue = this.template.keys[key];
        let mappedLore = this.template.shape.filter((v) => v.includes(keyValue));
        const needToRemove = mappedLore.map((v) => v.split(keyValue));
        for (let u = 0; u < this.currentLore.length; u++) {
            for (let i = 0; i < needToRemove.length; i++) {
                for (let y = 0; y < needToRemove[i].length; y++) {
                    if (needToRemove[i][y].trim().length > 0) {
                        this.currentLore[u] = this.currentLore[u].replaceAll(needToRemove[i][y], '');
                    }
                }
            }
        }
        return this.currentLore;
    }
    initTemplate() {
        this.currentLore = this.template.shape;
        this.itemStack.setLore(this.currentLore);
    }
    update(player, slot = player.selectedSlot) {
        // @ts-ignore
        player.getComponent('inventory').container.setItem(slot, this.itemStack);
    }
}
LoreParse.BASE_TEMPLATE = new Template(['Durability : %s'], {
    durability: '%s',
}, {
    clearLines: true,
    basesColors: '§7',
});
export default LoreParse;
