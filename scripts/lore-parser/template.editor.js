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
    addToLore(index = TemplatesManager.getSeperatedTemplates(this.loreParserInstance.lore).length || 0) {
        console.warn(index);
        const separatedTemplates = TemplatesManager.getSeperatedTemplates(this.loreParserInstance.lore);
        this.loreParserInstance.lore = separatedTemplates ? separatedTemplates.flatMap((template, idx) => {
            if (idx === index)
                return [...this.template.shape, ...template];
            return template;
        }) : this.template.shape;
    }
    set(key, value) {
        const keyValue = this.template.keys[key];
        const separatedTemplates = TemplatesManager.getSeperatedTemplates(this.loreParserInstance.lore);
        const indexs = TemplatesManager.getTemplateIndex(this.template, separatedTemplates);
        let lore = separatedTemplates;
        for (const index of indexs) {
            if (typeof value === 'string' && value?.length > LoreError.MAX_LORE_LINE_LENGTH)
                return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
            lore[index] = lore[index].map((v) => v.replaceAll(keyValue, value.toString()));
            if (lore[index].some((line) => line.length > LoreError.MAX_LORE_LINE_LENGTH))
                return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
        }
        this.loreParserInstance.lore = lore.flat();
    }
    get(key) {
        const keyValue = this.template.keys[key];
        const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));
        const targetLine = this.loreParserInstance.lore[lineIndex];
        if (!targetLine)
            return null;
        const keyIndex = this.template.shape[lineIndex]?.split(TemplatesManager.MARKER)?.indexOf(keyValue);
        const value = targetLine?.split(TemplatesManager.MARKER);
        return value[keyIndex] || null;
    }
}
