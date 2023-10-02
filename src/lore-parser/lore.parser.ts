import { ItemStack, Player } from '@minecraft/server';
import Template, { TKeys } from './template';
import LoreError from './lore.error';

export type TTemplate = {
	shape: Array<string>;

	settings?: {
		clearLine: boolean;
	};
};

export default class LoreParser<T> {
	private static BASE_TEMPLATE: Template = new Template(
		['Durability : %s'],
		{
			durability: '%s',
		},
		{
			clearLines: true,
		}
	);

	constructor(public itemStack: ItemStack, public template: Template = LoreParser.BASE_TEMPLATE) {}

	public add(...strings: Array<string>): void {
		for (let i = 0; i < strings.length; i++) {
			const currentLore = this.itemStack.getLore();
			const str = strings[i];
			if (currentLore.length + strings.length < 20) this.itemStack.setLore([...currentLore, str]);
			else new LoreError(`You have tried adding a new lore line, but you can't have more than 20 lines of lore !`);
		}
	}

	public set<T extends keyof this['template']['keys'], K>(key: T, value: K): void {
		console.warn(key);
	}

	public initTemplate(): void {
		this.itemStack.setLore(this.template.shape);
	}

	public update(player: Player, slot: number = player.selectedSlot): void {
		// @ts-ignore
		player.getComponent('inventory').container.setItem(slot, this.itemStack);
	}
}
