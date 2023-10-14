import { TTemplate } from './lore.parser';
import Template, { TKeys, TShape } from './template';

export type TTemplatesObject = {
	[name: string]: Template<TKeys>;
};

export default class TemplatesManager {
	public static MARKER: string = '§×';
	public static TEMPLATE_END_MARKER: string = '§∞';

	private static clearRegex: RegExp = new RegExp(`${TemplatesManager.MARKER}[^${TemplatesManager.MARKER}]+${TemplatesManager.MARKER}`, 'gi');
	private static clearColorsRegex: RegExp = new RegExp(`§(?!${TemplatesManager.MARKER[1]}|${TemplatesManager.TEMPLATE_END_MARKER[1]}).`, 'gi');

	private static templates: Set<Template<TKeys>> = new Set();

	public static currentId: number = 0;

	/*
	 *
	 * Add/Remove Methods
	 *
	 */

	public static addTemplate(template: Template<TKeys>): void {
		TemplatesManager.templates.add(template);
	}

	public static removeTemplate(template: Template<TKeys>): void {
		TemplatesManager.templates.delete(template);
	}

	/*
	 *
	 * Check Method
	 *
	 */

	public static isSameTemplate(template1: TShape, template2: TShape): boolean {
		return (
			template1.join(' ').replace(TemplatesManager.clearColorsRegex, '').replace(TemplatesManager.clearRegex, '') ==
			template2.join(' ').replace(TemplatesManager.clearColorsRegex, '').replace(TemplatesManager.clearRegex, '')
		);
	}

	/*
	 *
	 * Get Methods
	 *
	 */

	public static getTemplateIndex(template: Template<TKeys>, templates: Array<TShape>): Array<number> {
		const indexes: number[] = [];
		templates.forEach((tpl, index) => {
			if (TemplatesManager.isSameTemplate(tpl, template.shape)) {
				indexes.push(index);
			}
		});
		return indexes;
	}

	public static getSeperatedTemplates(lore: TShape): Array<TShape> {
		let separatedTemplates: Array<string[]> = [];
		let buffer: Array<string> = [];

		for (const line of lore) {
			buffer.push(line);
			if (line.endsWith(TemplatesManager.TEMPLATE_END_MARKER)) {
				separatedTemplates.push(buffer);
				buffer = [];
			}
		}

		return separatedTemplates;
	}

	public static getTemplates(lore: Array<string>): Set<Template<TKeys>> | null {
		console.warn(lore)
		let templatesMap: Set<Template<TKeys>> = new Set();

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
				/* console.warn(
					"1", 
					' / ',
					loreTemplate.join(' ').replace(TemplatesManager.clearColorsRegex, '').replace(TemplatesManager.clearRegex, '')
				);
				console.warn("3",  ' / ', clearedTemplate.join(' ')); */
				if (
					loreTemplate.join(' ').replace(TemplatesManager.clearColorsRegex, '').replace(TemplatesManager.clearRegex, '') === clearedTemplate.join(' ')
				) {
					templatesMap.add(template);
				}
			}
		});

		
		return templatesMap;
	}
}
