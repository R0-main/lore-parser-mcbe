import { world, ItemStack, Player, EntityInventoryComponent } from '@minecraft/server';
import LoreParser from 'lore-parser/lore.parser';
import Template from 'lore-parser/template';

// first we define a new template, that will store damages and effect.
const swordTemplate = new Template(
	[
		// make sur each line of this array is shorter than 50 character and the array need to be shorter than 20 lines
		'┌─',
		'│',
		'│ §hDamage §8->§c %d',
		'│ §hEffect §8->§e %e',
		'│ ',
		'└─ ',
	],
	{
		damage: '%d', // here all '%d' in the array right above will be replace by setted 'damage' value
		effect: '%e', // here all '%e' in the array right above will be replace by setted 'effect' value
	},
	{
		clearLines: true, // this option will set '§r' before each lore line to set them clear
		basesColors: '§7', // this option will add '§7' before each lore line
	}
);

/*

	Chat Send Event 
		- in this event we will manage the lore of the holded item to apply the correct lore to store custom data as damage or effect. 
		
*/
world.afterEvents.chatSend.subscribe((evt) => {
	// setup all needed variables as inventory but in particular item
	const player: Player = evt.sender;
	const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
	const item: ItemStack = inventory.container.getItem(player.selectedSlot);

	// test if player hold an item
	if (!item) return player.sendMessage('§cYou need to hold an item');

	// also create a LoreParser instance to manage the lore properly
	const lp = new LoreParser(item);

	// test if the item has already the swordTemplate inited
	if (lp.hasTemplates(swordTemplate)) return player.sendMessage('§cYour item already has the "swordTemplate" inited');

	// else, clear the lore to be sur it is a clean lore
	lp.clear();

	// init swordTemplate to make sur we can next set values
	lp.initTemplates(swordTemplate);

	// then, define the 'damage' and 'effect'
	lp.for(swordTemplate).set('damage', 10);
	lp.for(swordTemplate).set('effect', 'levitation');

	// to finish update the item lore into player's inventory
	lp.update(player);
});

/*

	Entity Hit Entity Event 
		- in this event we will apply damage and effect to hitEntity stored in the lore

*/
world.afterEvents.entityHitEntity.subscribe((evt) => {
	// check if the damagingEntity is a Player
	if (!(evt.damagingEntity instanceof Player)) return;

	// setup all needed variables as inventory but in particular item
	const player = evt.damagingEntity as Player;
	const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
	const item: ItemStack = inventory.container.getItem(player.selectedSlot);

	// test if player hold an item
	if (!item) return;

	// also create a LoreParser instance to manage/read the lore properly
	const lp = new LoreParser(item);

	// test if the item has the swordTemplate inited
	if (!lp.hasTemplates(swordTemplate)) return;

	// read the stored values
	const damage = lp.for(swordTemplate).get('damage');
	const effect = lp.for(swordTemplate).get('effect');

	// apply damage for 'damageEntity' (we have to convert the damage variable into number because lore parser gives a string value)
	evt.hitEntity.applyDamage(Number(damage));
	// apply the stored effect for 'damageEntity'
	evt.hitEntity.addEffect(effect, 100);
});
