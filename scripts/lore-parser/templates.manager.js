class TemplatesManager {
    /*
     *
     * Add/Remove Methods
     *
     */
    static addTemplate(template) {
        TemplatesManager.templates.add(template);
    }
    static removeTemplate(template) {
        TemplatesManager.templates.delete(template);
    }
    /*
     *
     * Check Method
     *
     */
    static isSameTemplate(template1, template2) {
        return (TemplatesManager.getClearedShape(template1) ==
            TemplatesManager.getClearedShape(template2));
    }
    /*
     *
     * Get Methods
     *
     */
    static getTemplateIndex(template, templates) {
        const indexes = [];
        templates.forEach((tpl, index) => {
            if (TemplatesManager.isSameTemplate(tpl, template.shape)) {
                indexes.push(index);
            }
        });
        return indexes;
    }
    static getSeperatedTemplates(lore) {
        let separatedTemplates = [];
        let buffer = [];
        for (const line of lore) {
            buffer.push(line);
            if (line.endsWith(TemplatesManager.TEMPLATE_END_MARKER)) {
                separatedTemplates.push(buffer);
                buffer = [];
            }
        }
        return separatedTemplates;
    }
    static getClearedShape(shape) {
        return shape.join(' ').replaceAll(TemplatesManager.clearColorsRegex, '').replaceAll(TemplatesManager.clearRegex, '').replaceAll(TemplatesManager.MARKER, '').trim();
    }
    static getTemplates(lore) {
        let templatesMap = new Set();
        let loreTemplates = [];
        let clearedLore = lore.map((line) => line.replace(TemplatesManager.clearRegex, ''));
        const multipleTemplates = clearedLore.findIndex((line) => line.includes(TemplatesManager.TEMPLATE_END_MARKER));
        let lineBuffer = [];
        if (multipleTemplates !== -1) {
            for (let loreLine of clearedLore) {
                lineBuffer.push(loreLine);
                if (loreLine.includes(TemplatesManager.TEMPLATE_END_MARKER)) {
                    loreTemplates.push(lineBuffer);
                    lineBuffer = [];
                }
            }
        }
        else {
            loreTemplates = [clearedLore];
        }
        TemplatesManager.templates.forEach((template) => {
            for (const loreTemplate of loreTemplates) {
                if (TemplatesManager.isSameTemplate(template.shape, loreTemplate)) {
                    templatesMap.add(template);
                }
            }
        });
        return templatesMap;
    }
}
TemplatesManager.MARKER = '§×';
TemplatesManager.TEMPLATE_END_MARKER = '§∞';
TemplatesManager.clearRegex = new RegExp(`${TemplatesManager.MARKER}[^${TemplatesManager.MARKER}]+${TemplatesManager.MARKER}`, 'gi');
TemplatesManager.clearColorsRegex = new RegExp(`§[^${TemplatesManager.MARKER}${TemplatesManager.TEMPLATE_END_MARKER}]`, "gi");
TemplatesManager.templates = new Set();
export default TemplatesManager;
