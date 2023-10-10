class TemplateManager {
    static addTemplate(template) {
        TemplateManager.templates.add(template);
    }
    static removeTemplate(template) {
        TemplateManager.templates.delete(template);
    }
    static getTemplate(lore) {
        let targetTemplate;
        let clearedLore = lore.map((v) => v.replace(TemplateManager.clearRegex, ''));
        TemplateManager.templates.forEach((template) => {
            const clearedTemplate = template.shape.map((v) => v.replace(TemplateManager.clearRegex, ''));
            if (clearedLore.join(' ') === clearedTemplate.join(' '))
                targetTemplate = template;
        });
        return targetTemplate;
    }
}
TemplateManager.MARKER = '§×';
TemplateManager.clearRegex = new RegExp(`\\${TemplateManager.MARKER}[^\\${TemplateManager.MARKER}]+\\${TemplateManager.MARKER}`, 'g');
TemplateManager.templates = new Set();
export default TemplateManager;
