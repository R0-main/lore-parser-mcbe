import { ItemStack, Player } from '@minecraft/server';

export type TTemplate = {
	shape: Array<string>;

	settings?: {
		clearLine: boolean;
	};
};

export default class LoreParser<T> {
	private static CLEAR_LINE: string = '§r';

	private static BASE_TEMPLATE: TTemplate = {
		shape: ['ffafafa'],
		settings: {
			clearLine: true,
		},
	};

	constructor(private itemStack: ItemStack, private template: TTemplate = LoreParser.BASE_TEMPLATE) {}

	public add(...strings: Array<string>): void {
		for (let i = 0; i < strings.length; i++) {
			const currentLore = this.itemStack.getLore();

			const str = strings[i];

			if (currentLore.length + strings.length < 20) this.itemStack.setLore([...currentLore, str]);
			else new LoreError(`You have tried adding a new lore line, but you can't have more than 20 lines of lore !`);
		}
	}

	public initTemplate(): void {
		if (this.template.settings.clearLine) this.template.shape = this.template.shape.map((v) => LoreParser.CLEAR_LINE + v);

		this.itemStack.setLore(this.template.shape);
	}

	public update(player: Player, slot: number = player.selectedSlot): void {
		// @ts-ignore
		player.getComponent('inventory').container.setItem(slot, this.itemStack);
	}
}


class LoreError {

	private static ERROR_PREFIX : string = 'LoreError:'

	constructor (private message : string){
		console.warn(LoreError.ERROR_PREFIX + message)
	}
}
