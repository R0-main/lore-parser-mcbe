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
		const indexs: Array<number> = separatedTemplates.length === 1 ? [0] : TemplatesManager.getTemplateIndex(this.template, separatedTemplates);

		let lore: Array<TShape> | TShape = separatedTemplates;

		if (!this.template.isComplexTemplate) {
			for (const index of indexs) {
				if (val.length + lore[index].length > LoreWarning.MAX_LORE_LINE_LENGTH) return new LoreWarning('MAX_LORE_LINE_LENGTH', index, val.length);

				let splitLore = lore[index].map((line) => line.split(TemplatesManager.MARKER));
				splitLore = splitLore.map((line, i) => this.replaceKeyByValue(keyValue, val, line, i));
				lore[index] = splitLore.map((line) => line.join(''));

				// WARNINGS MANAGER
				if (lore[index].some((line) => line.length >= LoreWarning.MAX_LORE_LINE_LENGTH))
					return new LoreWarning(
						'MAX_LORE_LINE_LENGTH',
						index,
						lore[index].filter((line) => line.length >= LoreWarning.MAX_LORE_LINE_LENGTH)[0].length
					);
			}
		} else {
			let splitLore = separatedTemplates.flat().map((line) => line.split(TemplatesManager.MARKER));
			splitLore = splitLore.map((line, i) => this.replaceKeyByValue(keyValue, val, line, i));
			lore = splitLore.map((line) => line.join(''));
		}

		this.loreParserInstance.lore = lore.flat();
	}

	public get(key: keyof TTemplate['keys']): string | null {
		const keyValue = this.template.keys[key as string];

		const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));

		if (this.loreParserInstance.lore.length <= lineIndex) return null;

		const targetLine = this.loreParserInstance.lore[lineIndex];

		const keyIndex = this.template.shape[lineIndex]?.split(TemplatesManager.MARKER)?.indexOf(keyValue);

		const value = targetLine.split(TemplatesManager.MARKER);

		return value[keyIndex] || null;
	}

	/*
	 *
	 * Util Method
	 *
	 */

	private replaceKeyByValue(keyValue: string, value: string, line: Array<string>, i: number) {
		const keyIndexs = this.findIndexsOf(keyValue, this.template.shape[i].split(TemplatesManager.MARKER));

		if (keyIndexs.length > 0) {
			for (const idx of keyIndexs) {
				line[idx] = `${TemplatesManager.MARKER}${value}${TemplatesManager.MARKER}`;
			}
		} else {
			for (const key of Object.values(this.template.keys)) {
				const keyIndexs = this.findIndexsOf(key, this.template.shape[i].split(TemplatesManager.MARKER));
				for (const idx of keyIndexs) {
					line[idx] = `${TemplatesManager.MARKER}${line[idx].replaceAll(TemplatesManager.MARKER, '')}${TemplatesManager.MARKER}`;
				}
			}
		}
		return line;
	}

	private findIndexsOf<T>(target: T, array: Array<T>): Array<number> {
		return array.reduce((r, v, i) => r.concat(v === target ? i : []), []);
	}
}
