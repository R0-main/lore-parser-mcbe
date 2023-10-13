import { ItemStack } from '@minecraft/server';
import LoreError from './lore.error';
import Template, { TKeys, TShape } from './template';
import TemplatesManager from './templates.manager';
import LoreParser from './lore.parser';

export default class TemplateEditor<TTemplate extends Template<TKeys>> {
	constructor(private template: TTemplate, private loreParserInstance: LoreParser) {}

	public init(): void | LoreError {
		this.loreParserInstance.lore = this.template.shape;
	}

	public addToLore(): void | LoreError {
		this.loreParserInstance.lore = [...this.loreParserInstance.itemStack.getLore(), ...this.template.shape];
	}

	public set(key: keyof TTemplate['keys'], value: string | number | boolean): void | LoreError {
		const keyValue = this.template.keys[key as string];

		let separatedTemplates: Array<string[]> = [];
		let buffer: Array<string> = [];

		this.loreParserInstance.lore.map((line) => {
			buffer.push(line);
			if (line.endsWith(TemplatesManager.TEMPLATE_END_MARKER)) {
				separatedTemplates.push(buffer);
				buffer = [];
			}
		});

		const indexs: Array<number> = TemplatesManager.getTemplateIndex(this.template, separatedTemplates);

		let lore = separatedTemplates;

		for (const index of indexs) {
			if (typeof value === 'string' && value?.length > LoreError.MAX_LORE_LINE_LENGTH) return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);

			lore[index] = lore[index].map((v) => v.replaceAll(keyValue, value.toString()).toString());

			if (lore[index].some((line) => line.length > LoreError.MAX_LORE_LINE_LENGTH)) return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
		}

		/* console.warn([].concat(lore)) */

		this.loreParserInstance.lore = lore.flat()
	}

	public get(key: keyof TTemplate['keys']): string | null {
		const keyValue = this.template.keys[key as string];

		const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));
		const targetLine = this.loreParserInstance.lore[lineIndex];

		const keyIndex = this.template.shape[lineIndex].split(TemplatesManager.MARKER).indexOf(keyValue);

		const value = targetLine.split(TemplatesManager.MARKER);

		return value[keyIndex] || null;
	}
}
