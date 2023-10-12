import { TTemplate } from './lore.parser';
import Template, { TKeys } from './template';

export type TTemplatesObject = {
	[name: string]: Template<TKeys>;
};

export default class TemplatesManager {
	public static MARKER: string = '§×';
	public static TEMPLATE_END_MARKER: string = '§∞';

	private static clearRegex: RegExp = new RegExp(`${TemplatesManager.MARKER}[^${TemplatesManager.MARKER}]+${TemplatesManager.MARKER}`, 'gi');
	private static clearColorsRegex: RegExp = new RegExp(`§(?!${TemplatesManager.MARKER[1]}|${TemplatesManager.TEMPLATE_END_MARKER[1]}).`, 'gi');

	private static templates: Set<Template<TKeys>> = new Set();

	public static addTemplate(template: Template<TKeys>): void {
		TemplatesManager.templates.add(template);
	}

	public static removeTemplate(template: Template<TKeys>): void {
		TemplatesManager.templates.delete(template);
	}

	public static getTemplates(lore: Array<string>): Map<string, Template<TKeys>> | null {
		let templatesMap: Map<string, Template<TKeys>> = new Map();

		let loreTemplates: Array<Array<string>> = [];

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
		} else {
			loreTemplates = [clearedLore];
		}

		TemplatesManager.templates.forEach((template) => {
			for (const loreTemplate of loreTemplates) {
				const clearedTemplate = template.shape.map((line) => {
					// remove all text between Template Marker
					line = line.replace(TemplatesManager.clearRegex, '');
					// remove all § + the following char
					line = line.replace(TemplatesManager.clearColorsRegex, '');
					return line;
				});
				console.warn(
					template.name,
					' / ',
					loreTemplate.join(' ').replace(TemplatesManager.clearColorsRegex, '').replace(TemplatesManager.clearRegex, '')
				);
				console.warn(template.name, ' / ', clearedTemplate.join(' '));
				if (
					loreTemplate
						.join(' ')
						.replace(TemplatesManager.clearColorsRegex, '')
						.replace(TemplatesManager.clearRegex, '')
						.replace(TemplatesManager.clearColorsRegex, '') === clearedTemplate.join(' ')
				) {
					templatesMap.set(template.name, template);
				}
			}
		});
		return templatesMap;
	}
}
