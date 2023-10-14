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

	public addToLore(index: number = TemplatesManager.getSeperatedTemplates(this.loreParserInstance.lore).length || 0): void | LoreError {
		console.warn(index)
		const separatedTemplates : Array<TShape> = TemplatesManager.getSeperatedTemplates(this.loreParserInstance.lore)
		
		this.loreParserInstance.lore = separatedTemplates ? separatedTemplates.flatMap((template, idx)=> {
			if (idx === index)
				return [...this.template.shape, ...template]
			return template
		}) : this.template.shape;
	}

	public set(key: keyof TTemplate['keys'], value: string | number | boolean): void | LoreError {
		const keyValue = this.template.keys[key as string];

		const separatedTemplates: Array<TShape> = TemplatesManager.getSeperatedTemplates(this.loreParserInstance.lore);
		const indexs: Array<number> = TemplatesManager.getTemplateIndex(this.template, separatedTemplates);

		let lore = separatedTemplates;

		for (const index of indexs) {
			if (typeof value === 'string' && value?.length > LoreError.MAX_LORE_LINE_LENGTH) return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);

			lore[index] = lore[index].map((v) => v.replaceAll(keyValue, value.toString()));

			if (lore[index].some((line) => line.length > LoreError.MAX_LORE_LINE_LENGTH)) return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
		}

		this.loreParserInstance.lore = lore.flat();
	}

	public get(key: keyof TTemplate['keys']): string | null {
		const keyValue = this.template.keys[key as string];

		const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));

		const targetLine = this.loreParserInstance.lore[lineIndex];

		if (!targetLine) return null

		const keyIndex = this.template.shape[lineIndex]?.split(TemplatesManager.MARKER)?.indexOf(keyValue);

		const value = targetLine?.split(TemplatesManager.MARKER);

		return value[keyIndex] || null;
	}
}
