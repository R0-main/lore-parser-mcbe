import LoreError from './lore.error';
import TemplatesManager from './templates.manager';
export default class TemplateEditor {
    constructor(template, loreParserInstance) {
        this.template = template;
        this.loreParserInstance = loreParserInstance;
    }
    init() {
        this.loreParserInstance.lore = this.template.shape;
    }
    addToLore() {
        this.loreParserInstance.lore = [...this.loreParserInstance.itemStack.getLore(), ...this.template.shape];
    }
    set(key, value) {
        const keyValue = this.template.keys[key];
        let separatedTemplates = [];
        let buffer = [];
        this.loreParserInstance.lore.map((line) => {
            buffer.push(line);
            if (line.endsWith(TemplatesManager.TEMPLATE_END_MARKER)) {
                separatedTemplates.push(buffer);
                buffer = [];
            }
        });
        const indexs = TemplatesManager.getTemplateIndex(this.template, separatedTemplates);
        let lore = separatedTemplates;
        for (const index of indexs) {
            if (typeof value === 'string' && value?.length > LoreError.MAX_LORE_LINE_LENGTH)
                return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
            lore[index] = lore[index].map((v) => v.replaceAll(keyValue, value.toString()).toString());
            if (lore[index].some((line) => line.length > LoreError.MAX_LORE_LINE_LENGTH))
                return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
        }
        /* console.warn([].concat(lore)) */
        this.loreParserInstance.lore = lore.flat();
    }
    get(key) {
        const keyValue = this.template.keys[key];
        const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));
        const targetLine = this.loreParserInstance.lore[lineIndex];
        const keyIndex = this.template.shape[lineIndex].split(TemplatesManager.MARKER).indexOf(keyValue);
        const value = targetLine.split(TemplatesManager.MARKER);
        return value[keyIndex] || null;
    }
}
