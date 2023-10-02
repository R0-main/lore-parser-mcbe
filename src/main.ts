import { Container, EntityComponent, world } from '@minecraft/server';
import LoreParser from 'lore-parser/lore.parser';
import Template from 'lore-parser/template';

const durabilityTemplate: Template = new Template(
	[
		'┌─',
		'│',
		'│ §7Durability §8: §h%s',
		'│',
		'└─ ',
	], 
	{
		druability: '%s',
	},
	{
		clearLines: true,
	}
);

const test = {

	durability : '%s',
	rarity : '%r',
}
for (const player of world.getAllPlayers()) {
	// @ts-ignore
	const inventory = player.getComponent('inventory')?.container as Container;
	const item = inventory.getItem(player.selectedSlot);

	const loreParser = new LoreParser(item, durabilityTemplate);

	loreParser.add('§r§efafaz');
	loreParser.add('§r§afafaz');
	loreParser.add('§r§tfafaz');

	loreParser.set('')

	console.warn('first');

	loreParser.initTemplate();

	loreParser.update(player);
}
