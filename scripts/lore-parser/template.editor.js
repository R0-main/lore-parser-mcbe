import LoreWarning from './lore.warning';
import TemplatesManager from './templates.manager';
export default class TemplateEditor {
    constructor(template, loreParserInstance) {
        this.template = template;
        this.loreParserInstance = loreParserInstance;
    }
    /*
     *
     * Set/Get Methods
     *
     */
    set(key, value) {
        const keyValue = this.template.keys[key];
        const val = value.toString();
        const separatedTemplates = TemplatesManager.getSeperatedTemplates(this.loreParserInstance.lore);
        const indexs = TemplatesManager.getTemplateIndex(this.template, separatedTemplates);
        let lore = separatedTemplates;
        if (!this.template.isComplexTemplate) {
            for (const index of indexs) {
                if (val.length + lore[index].length > LoreWarning.MAX_LORE_LINE_LENGTH)
                    return new LoreWarning('MAX_LORE_LINE_LENGTH', index, val.length);
                lore[index] = lore[index].map((line) => line.replaceAll(keyValue, val));
                if (lore[index].some((line) => line.length >= LoreWarning.MAX_LORE_LINE_LENGTH))
                    return new LoreWarning('MAX_LORE_LINE_LENGTH', index, lore[index].filter((line) => line.length >= LoreWarning.MAX_LORE_LINE_LENGTH)[0].length);
            }
        }
        else {
            lore = separatedTemplates.flat().map((line, index) => {
                if (line.includes(keyValue)) {
                    if (val.length + line.length > LoreWarning.MAX_LORE_LINE_LENGTH) {
                        new LoreWarning('MAX_LORE_LINE_LENGTH', index, val.length + line.length);
                        return line;
                    }
                    return line.replaceAll(keyValue, val);
                }
                return line;
            });
        }
        this.loreParserInstance.lore = lore.flat();
    }
    get(key) {
        const keyValue = this.template.keys[key];
        const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));
        if (this.loreParserInstance.lore.length <= lineIndex)
            return null;
        const targetLine = this.loreParserInstance.lore[lineIndex];
        const keyIndex = this.template.shape[lineIndex]?.split(TemplatesManager.MARKER)?.indexOf(keyValue);
        const value = targetLine.split(TemplatesManager.MARKER);
        return value[keyIndex] || null;
    }
}
