import Template from './template';
import LoreError from './lore.error';
class LoreParser {
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
        this.currentLore = this.currentLore.map((v) => v.replaceAll(keyValue, value.toString() /*  + LoreParser.END_MARKER */));
        this.itemStack.setLore(this.currentLore);
    }
    get(key) {
        const keyValue = this.template.keys[key];
        const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));
        const targetLine = this.currentLore[lineIndex];
        const keyIndex = this.template.shape[lineIndex].split(Template.MARKER).indexOf(keyValue);
        const value = targetLine.split(Template.MARKER);
        return value[keyIndex] || null;
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
LoreParser.BASE_TEMPLATE = new Template(['Durability : %s'], {
    durability: '%s',
}, {
    clearLines: true,
    basesColors: '§7',
});
export default LoreParser;
