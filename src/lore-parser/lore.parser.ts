import { EntityInventoryComponent, ItemStack, Player } from '@minecraft/server';
import Template, { TKeys, TOptions, TShape } from './template';
import LoreError from './lore.error';
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

	public add(...strings: Array<string>): void {
		for (let i = 0; i < strings.length; i++) {
			const str = strings[i];

			if (str.length > LoreError.MAX_LORE_LINE_LENGTH) {
				new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
				continue;
			}

			if (this.lore.length + strings.length < LoreError.MAX_LORE_LINE) {
				this.lore = [...this.lore, str];
				return;
			} else new LoreError(LoreError.types.MAX_LORE_LINE);
		}
	}

	public initTemplates(...templates: Array<Template<TKeys>>): void {
		this.lore = [];
		for (const template of templates) {
			this.lore = [...this.lore, ...template.shape];
		}
	}

	public for<T extends Template<TKeys>>(template: T): TemplateEditor<T> {
		return new TemplateEditor(template, this);
	}

	public update(player: Player, slot: number = player.selectedSlot): void {
		this.itemStack.setLore(this.lore)
		let inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent
        inventory.container.setItem(slot, this.itemStack)
	}

	public hasTemplate(template: Template<TKeys>): boolean {
		const templates = TemplatesManager.getTemplates(this.lore);
		return !!templates.get(template.name);
	}
}
