class TemplatesManager {
    static addTemplate(template) {
        TemplatesManager.templates.add(template);
    }
    static removeTemplate(template) {
        TemplatesManager.templates.delete(template);
    }
    static getTemplate(lore) {
        let targetTemplate;
        let clearedLore = lore.map((v) => v.replace(TemplatesManager.clearRegex, ''));
        TemplatesManager.templates.forEach((template) => {
            const clearedTemplate = template.shape.map((v) => v.replace(TemplatesManager.clearRegex, ''));
            if (clearedLore.join(' ') === clearedTemplate.join(' '))
                targetTemplate = template;
        });
        return targetTemplate;
    }
}
TemplatesManager.MARKER = '§×';
TemplatesManager.clearRegex = new RegExp(`\\${TemplatesManager.MARKER}[^\\${TemplatesManager.MARKER}]+\\${TemplatesManager.MARKER}`, 'g');
TemplatesManager.templates = new Set();
export default TemplatesManager;
