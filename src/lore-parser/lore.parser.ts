import { ItemStack, Player } from '@minecraft/server';
import Template, { TKeys, TOptions, TShape } from './template';
import LoreError from './lore.error';
import TemplatesManager from './templates.manager';
import TemplateEditor from './template.editor';
import { weaponTemplate } from 'main';

export type TTemplate = {
	shape: Array<string>;
	keys: Record<string, string>;
	options: TOptions;
};

export default class LoreParser<TTemplate extends Template<TKeys>> {
	private currentLore: TShape = this.itemStack.getLore() || [];

	constructor(public itemStack: ItemStack, public template: TTemplate) {}

	public add(...strings: Array<string>): void {
		for (let i = 0; i < strings.length; i++) {
			const str = strings[i];

			if (str.length > LoreError.MAX_LORE_LINE_LENGTH) {
				new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
				continue;
			}

			if (this.currentLore.length + strings.length < LoreError.MAX_LORE_LINE) {
				this.currentLore = [...this.currentLore, str];
				this.itemStack.setLore(this.currentLore);
				return;
			} else new LoreError(LoreError.types.MAX_LORE_LINE);
		}
	}

	public initTemplate(): void {
		this.currentLore = this.template.shape;
		this.itemStack.setLore(this.currentLore);
	}

	
	public for<T extends Template<TKeys>>(template: T) : TemplateEditor<T> {
		return new TemplateEditor(template, this.itemStack)
	}
	
	
	public update(player: Player, slot: number = player.selectedSlot): void {
		// @ts-ignore
		player.getComponent('inventory').container.setItem(slot, this.itemStack);
	}
	
	public hasTemplate(template: Template<TKeys>): boolean {
		const templates = TemplatesManager.getTemplates(this.currentLore);
		/* console.warn(templates.get(weaponTemplate.name)) */
		return !!templates.get(template.name);
	}
}
