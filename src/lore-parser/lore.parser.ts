import { ItemStack, Player } from '@minecraft/server';
import Template, { TKeys, TOptions, TShape } from './template';
import LoreError from './lore.error';

export type TTemplate = {
	shape: Array<string>;
	keys: Record<string, string>;
	options: TOptions;
};

export default class LoreParser<TTemplate extends Template<TKeys>> {
	private static BASE_TEMPLATE = new Template(
		['Durability : %s'],
		{
			durability: '%s',
		},
		{
			clearLines: true,
			basesColors: '§7',
		}
	);

	private currentLore: TShape = this.itemStack.getLore() || [];

	constructor(public itemStack: ItemStack, public template: TTemplate) {}

	public add(...strings: Array<string>): void {
		for (let i = 0; i < strings.length; i++) {
			const str = strings[i];
			if (this.currentLore.length + strings.length < LoreError.MAX_LORE_LINE_LENGTH) {
				this.currentLore = [...this.currentLore, str];
				this.itemStack.setLore(this.currentLore);
			} else new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
		}
	}

	public set(key: keyof TTemplate['keys'], value: string | number | boolean): void {
		const keyValue = this.template.keys[key as string];
		this.currentLore = this.currentLore.map((v) => v.replaceAll(keyValue, value.toString() /*  + LoreParser.END_MARKER */));
		this.itemStack.setLore(this.currentLore);
	}

	public get(key: keyof TTemplate['keys']): string {
		const keyValue = this.template.keys[key as string];

		const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));
		const targetLine = this.currentLore[lineIndex];

		const keyIndex = this.template.shape[lineIndex].split(Template.MARKER).indexOf(keyValue);

		const value = targetLine.split(Template.MARKER);

		return value[keyIndex] || null;
	}
	public initTemplate(): void {
		this.currentLore = this.template.shape;
		this.itemStack.setLore(this.currentLore);
	}

	public update(player: Player, slot: number = player.selectedSlot): void {
		// @ts-ignore
		player.getComponent('inventory').container.setItem(slot, this.itemStack);
	}
}
