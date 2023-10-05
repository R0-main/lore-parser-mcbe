import { ItemStack, Player } from '@minecraft/server';
import Template, { TKeys, TOptions, TShape } from './template';
import LoreError from './lore.error';

export type TTemplate = {
	shape: Array<string>;
	keys: Record<string, string>;
	options: TOptions;
};

export default class LoreParse<TTemplate extends Template<TKeys>> {
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

	public set<T extends keyof TTemplate['keys']>(key: T, value: string | number | boolean): void {
		const keyValue = this.template.keys[key as string];
		this.currentLore = this.currentLore.map((v) => (v.includes(keyValue) ? v.replace(keyValue, value.toString()) : v));
		this.itemStack.setLore(this.currentLore);
	}

	public get<T extends keyof TTemplate['keys']>(key: T): string {
		const keyValue = this.template.keys[key as string];
		let mappedLore = this.template.shape.filter((v) => v.includes(keyValue));
		const needToRemove = mappedLore.map((v) => v.split(keyValue));

		for (let u = 0; u < this.currentLore.length; u++) {
			for (let i = 0; i < needToRemove.length; i++) {
				for (let y = 0; y < needToRemove[i].length; y++) {
					if (needToRemove[i][y].trim().length > 0) {
						this.currentLore[u] = this.currentLore[u].replaceAll(needToRemove[i][y], '');
					}
				}
			}
		}
		return this.currentLore;
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
