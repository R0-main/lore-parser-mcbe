import { ItemStack } from '@minecraft/server';
import LoreWarning from './lore.warning';
import Template, { TKeys, TShape } from './template';
import TemplatesManager from './templates.manager';
import LoreParser from './lore.parser';

export default class TemplateEditor<TTemplate extends Template<TKeys>> {
	constructor(private template: TTemplate, private loreParserInstance: LoreParser) {}

	/*
	 * 
	 * Set/Get Methods
	 * 
	*/

	public set(key: keyof TTemplate['keys'], value: string | number | boolean): void | LoreWarning {
		const keyValue = this.template.keys[key as string];

		const val = value.toString();

		const separatedTemplates: Array<TShape> = TemplatesManager.getSeperatedTemplates(this.loreParserInstance.lore);
		const indexs: Array<number> = TemplatesManager.getTemplateIndex(this.template, separatedTemplates);

		let lore: Array<TShape> | TShape = separatedTemplates;

		if (!this.template.isComplexTemplate) {
			for (const index of indexs) {
				if (val.length >= LoreWarning.MAX_LORE_LINE_LENGTH) return new LoreWarning('MAX_LORE_LINE_LENGTH', index, val.length);

				lore[index] = lore[index].map((line) => line.replaceAll(keyValue, val));

				if (lore[index].some((line) => line.length >= LoreWarning.MAX_LORE_LINE_LENGTH))
					return new LoreWarning(
						'MAX_LORE_LINE_LENGTH',
						index,
						lore[index].filter((line) => line.length >= LoreWarning.MAX_LORE_LINE_LENGTH)[0].length
					);
			}
		} else {
			lore = separatedTemplates.flat().map((line, index) => {
				if (line.includes(keyValue)) {
					if (val.length >= LoreWarning.MAX_LORE_LINE_LENGTH) {
						new LoreWarning('MAX_LORE_LINE_LENGTH', index, val.length);
						return line;
					}

					return line.replaceAll(keyValue, val);
				}
				return line;
			});
		}

		this.loreParserInstance.lore = lore.flat();
	}

	public get(key: keyof TTemplate['keys']): string | null {
		const keyValue = this.template.keys[key as string];

		const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));

		const targetLine = this.loreParserInstance.lore[lineIndex];

		if (!targetLine) return null;

		const keyIndex = this.template.shape[lineIndex]?.split(TemplatesManager.MARKER)?.indexOf(keyValue);

		const value = targetLine?.split(TemplatesManager.MARKER);

		return value[keyIndex] || null;
	}
}
