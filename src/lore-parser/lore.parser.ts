import { EntityInventoryComponent, ItemStack, Player } from '@minecraft/server';
import Template, { TKeys, TOptions, TShape } from './template';
import LoreWarning from './lore.warning';
import TemplatesManager from './templates.manager';
import TemplateEditor from './template.editor';

export type TTemplate = {
	shape: Array<string>;
	keys: Record<string, string>;
	options: TOptions;
};

export default class LoreParser {
	public lore: TShape = this.itemStack.getLore() || [];

	constructor(public itemStack: ItemStack) {}

	/*
	 *
	 * Utils Methods
	 *
	 */

	public add(...strings: Array<string>): void | LoreWarning {
		for (let i = 0; i < strings.length; i++) {
			const str = strings[i];

			if (str.length >= LoreWarning.MAX_LORE_LINE_LENGTH) {
				new LoreWarning('MAX_LORE_LINE_LENGTH', this.lore.length, str.length);
				this.lore = [...this.lore, str.substring(0, LoreWarning.MAX_LORE_LINE_LENGTH)];
				continue;
			}

			if (this.lore.length + strings.length <= LoreWarning.MAX_LORE_LINE) {
				this.lore = [...this.lore, str];
				return;
			} else return new LoreWarning('MAX_LORE_LINE', this.lore.length + strings.length);
		}
	}

	public remove(index: number): void | LoreWarning {
		if (index >= this.lore.length) return new LoreWarning('REMOVE_UNDEFINED_INDEX', index);
		this.lore.splice(index, 1);
	}

	public edit(index: number, str: string): void | LoreWarning {
		if (index >= this.lore.length) return new LoreWarning('EDIT_UNDEFINED_INDEX', index);

		this.lore[index] = str;
	}

	public push(index: number, str: string): void | LoreWarning {
		if (index >= this.lore.length) return new LoreWarning('EDIT_UNDEFINED_INDEX', index);
		if (index + this.lore.length > LoreWarning.MAX_LORE_LINE) return new LoreWarning('MAX_LORE_LINE', index + this.lore.length);
		this.lore.splice(index, 0, str);
	}

	/*
	 *
	 * Get Method
	 *
	 */

	public getTemplates(): Array<Template<TKeys>> {
		return [...TemplatesManager.getTemplates(this.lore)];
	}
	/*
	 *
	 * Templates Handling Method
	 *
	 */

	public for<T extends Template<TKeys>>(template: T): TemplateEditor<T> {
		return new TemplateEditor(template, this);
	}

	/*
	 *
	 * Templates Methods
	 *
	 */

	public initTemplates(...templates: Array<Template<TKeys>>): void | LoreWarning {
		this.lore = [];

		const length = this.lore.length + templates.map((v) => v.shape.length).reduce((accumulator, curr) => accumulator + curr);

		if (length > LoreWarning.MAX_LORE_LINE) return new LoreWarning('MAX_LORE_LINE', length);

		for (const template of templates) {
			this.lore = [...this.lore, ...template.shape];
		}
	}

	public pushTemplates(index: number, ...templates: Array<Template<TKeys>>): void | LoreWarning {
		const length = this.lore.length + templates.map((v) => v.shape.length).reduce((accumulator, curr) => accumulator + curr);
		if (length > LoreWarning.MAX_LORE_LINE) return new LoreWarning('MAX_LORE_LINE', length);

		let separatedLore: Array<TShape> = TemplatesManager.getSeperatedTemplates(this.lore);

		for (const template of templates) {
			separatedLore.splice(index, 0, template.shape);
			this.lore = separatedLore.flat();
		}
	}

	public addTemplates(...templates: Array<Template<TKeys>>): void | LoreWarning {
		const length = this.lore.length + templates.map((v) => v.shape.length).reduce((accumulator, curr) => accumulator + curr);
		if (length > LoreWarning.MAX_LORE_LINE) return new LoreWarning('MAX_LORE_LINE', length);

		for (const template of templates) {
			this.lore = [...this.lore, ...template.shape];
		}
	}

	public removeTemplates(...templates: Array<Template<TKeys>>): void {
		let separatedLore: Array<TShape> = TemplatesManager.getSeperatedTemplates(this.lore);

		for (const template of templates) {
			separatedLore = separatedLore.filter((tpl) => !TemplatesManager.isSameTemplate(tpl, template.shape));
			this.lore = separatedLore.flat();
		}
	}

	/*
	 *
	 * Update Method
	 *
	 */

	public update(player: Player, slot: number = player.selectedSlot): void {
		this.itemStack.setLore(this.lore);
		let inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
		inventory.container.setItem(slot, this.itemStack);
	}

	/*
	 *
	 * Check Method
	 *
	 */

	public hasTemplates(...templates: Array<Template<TKeys>>): boolean {
		let result: boolean = false;
		const separatedTemplates = TemplatesManager.getSeperatedTemplates(this.lore);

		if (separatedTemplates.length === 0) return false;

		for (const template of templates) {
			if (!template.isComplexTemplate) {
				const templateIndex = TemplatesManager.getTemplateIndex(template, separatedTemplates);
				if (separatedTemplates.length > 0 && templateIndex.length > 0) {
					result = true;
				} else {
					result = false;
				}
			} else {
				result = TemplatesManager.isSameTemplate(separatedTemplates.flat(), template.shape);
			}
		}
		return result;
	}
}
