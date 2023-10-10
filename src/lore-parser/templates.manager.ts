import Template, { TKeys } from './template';

export default class TemplatesManager {
	public static MARKER: string = '§×';
	private static clearRegex: RegExp = new RegExp(`\\${TemplatesManager.MARKER}[^\\${TemplatesManager.MARKER}]+\\${TemplatesManager.MARKER}`, 'g');

	private static templates: Set<Template<TKeys>> = new Set();

	public static addTemplate(template: Template<TKeys>): void {
		TemplatesManager.templates.add(template);
	}

	public static removeTemplate(template: Template<TKeys>): void {
		TemplatesManager.templates.delete(template);
	}

	public static getTemplate(lore: Array<string>): Template<TKeys> | null {
		let targetTemplate: Template<TKeys>;

		let clearedLore = lore.map((v) => v.replace(TemplatesManager.clearRegex, ''));

		TemplatesManager.templates.forEach((template) => {
			const clearedTemplate = template.shape.map((v) => v.replace(TemplatesManager.clearRegex, ''));

			if (clearedLore.join(' ') === clearedTemplate.join(' ')) targetTemplate = template;
		});
		return targetTemplate;
	}
}
