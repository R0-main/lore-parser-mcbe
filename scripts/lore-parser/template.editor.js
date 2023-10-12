import LoreError from "./lore.error";
import TemplatesManager from "./templates.manager";
export default class TemplateEditor {
    constructor(template, itemStack) {
        this.template = template;
        this.itemStack = itemStack;
        this.lore = this.itemStack.getLore();
    }
    set(key, value) {
        const keyValue = this.template.keys[key];
        let lore = this.lore;
        if (typeof value === 'string' && value?.length > LoreError.MAX_LORE_LINE_LENGTH)
            return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
        lore = lore.map((v) => v.replaceAll(keyValue, value.toString()));
        if (lore.some((line) => line.length > LoreError.MAX_LORE_LINE_LENGTH))
            return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
        this.lore = lore;
        this.itemStack.setLore(lore);
    }
    get(key) {
        const keyValue = this.template.keys[key];
        const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));
        const targetLine = this.lore[lineIndex];
        const keyIndex = this.template.shape[lineIndex].split(TemplatesManager.MARKER).indexOf(keyValue);
        const value = targetLine.split(TemplatesManager.MARKER);
        return value[keyIndex] || null;
    }
}
