import Template, { TKeys } from './template';

export default class TemplateManager {
	public static MARKER: string = '§×';
	private static clearRegex: RegExp = new RegExp(`\\${TemplateManager.MARKER}[^\\${TemplateManager.MARKER}]+\\${TemplateManager.MARKER}`, 'g');

	private static templates: Set<Template<TKeys>> = new Set();

	public static addTemplate(template: Template<TKeys>): void {
		TemplateManager.templates.add(template);
	}

	public static removeTemplate(template: Template<TKeys>): void {
		TemplateManager.templates.delete(template);
	}

	public static getTemplate(lore: Array<string>): Template<TKeys> | null {
		let targetTemplate: Template<TKeys>;

		let clearedLore = lore.map((v) => v.replace(TemplateManager.clearRegex, ''));

		TemplateManager.templates.forEach((template) => {
			const clearedTemplate = template.shape.map((v) => v.replace(TemplateManager.clearRegex, ''));

			if (clearedLore.join(' ') === clearedTemplate.join(' ')) targetTemplate = template;
		});
		return targetTemplate;
	}
}
