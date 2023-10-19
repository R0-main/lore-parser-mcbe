# lore-parser-mcbe
This is a lore parser for minecraft bedrock edition that allow to manage item lore easly

# How to Use

First of all, this lore parser is templates oriented. You are able to edit the lore easely with simple methods but, you can also create templates to manage information in lore, without having to remove all visual stuff ...

In this exemple, we will define an new chat event that will set the lore to the current holded item, en then when a player will hit a mob, damages and effect will be added. These damages and effect will be stored in the lore.


```ts
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
```

## Basics Methods

### Add Lines

Adding 'This is a new line of lore' to the lore.
```ts

loreParser.add('This is a new line of lore');

```
You can also add several lines at once.
```ts

loreParser.add('This is a new line of lore', 'An other line of lore', 'end of the lore....');

```

### Push Lines

You can push line at a specified index : 
```ts

loreParser.push(0, 'First pushed line', 'An other pushed line');

```

### Edit Lines

You can push line at a specified index : 
```ts

loreParser.edit(0, 'The line at index 0 is this message now');

```

### Remove Lines

You can remove line at a specified index : 
```ts

loreParser.remove(0);

```

### Clear Lore

You can clear the entire lore : 
```ts

loreParser.clear();

```

### Update Lore

You can update the current item with the modified lore for a specified player : 
```ts
loreParser.update(player, slot);
```

## Templates Oriented

Templates allows you to orginize your items lore, to easely set or get a specific value

### Create a Template

The first array will be the style of lore, in this array you will need set some characters that will be removed in the futur by your values.
Then, you need to define your keys with values who will be replaced by the lore parser. Keys will be helpfulls when you will need to set or get a value.
To finish, you are able to put options as you wants. For exemple clearLine options, remove the italic/purple aspect of the lore.
the baseColor options set a default color before each line of the template to get a more friendly array.

```ts
import Template from 'lore-parser/template';

const rarityTemplate = new Template(
	[
		'┌─', 
		'│', 
		'│ §hRarity §8-> %r', 
		'│ ', 
		'└─ '
	],
	{
		rarity: '%r',
	},
	{
		clearLines: true,
		basesColors: '§7',
	}
);
```

Here I defined a rarity template. As you can see I set '%r' for the rarity key, so that signified that all %r in the template will be replace by rarity at the set of the value. 


### Create a Complexe Template

Basicly, you are able to combine templates togethers using complex templates. For exemples, you can create a item template who regroups, rarity template, description template and a durability template ...
This complex template will combine all keys. Options of each specified templates will add if the options doesn't exist, and those who are passed in the complex template constructor will overwrite the others ones.


```ts
import LoreParser from 'lore-parser/lore.parser';
import Template from 'lore-parser/template';

const rarityTemplate = new Template(
	[
		'┌─', 
		'│', 
		'│ §hRarity §8-> %r', 
		'│ ', 
		'└─ '
	],
	{
		rarity: '%r',
	},
	{
		clearLines: true,
		basesColors: '§7',
	}
);

const durabilityTemplate = new Template(
	['(%durability/%maxDurability)'],
	{
		durability: '%durability',
		maxDurability: '%maxDurability',
	},
	{
		clearLines: true,
		basesColors: '§7',
	}
);

const itemTemplate = new ComplexTemplate([rarityTemplate, durabilityTemplate], { basesColors : '§c' });
```

Here, 'itemTemplate' regroup 'rarityTemplate' and 'durabilityTemplate', so when you will set values into the lores all keys will be linked. By the way, the 'itemTemplate' overwrite the basesColors to apear red.

### Templates Methods

To start working with templates, you need to initialize them in the lore parser

```ts
loreParser.initTemplates(rarityTemplate, durabilityTemplate);
```
or with the examples shown above
```ts
loreParser.initTemplates(itemTemplate);
```

then you are able to set and get values with 'for' methods, the passed args is the template you want to set and get values from.
In this exemple, set the value 100 for 'durability' in the itemTemplate.

note : with typescript, autocomplete is enable for set the key (here 'durability')

```ts
loreParser.for(itemTemplate).set('durability', 100)
```

then to get the value you can : 

```ts
loreParser.for(itemTemplate).get('durability') // 100
```

## Templates Utils Methods

### Check Templates

You can check if the item in the lore parser have templates inited : 
```ts
loreParser.hasTemplates(itemTemplate, rarityTemplate); // true
```
```ts
loreParser.hasTemplates(rarityTemplate); // true
```
```ts
loreParser.hasTemplates(randomTemplate, itemTemplate); // false
```

## Templates Random Methods

### Add Templates

This methods add passed template(s) to the end of the item lore.
```ts
loreParser.addTemplates(rarityTemplates);
```
```ts
loreParser.addTemplates(rarityTemplates, itemTemplates);
```

### Push Templates

This methods add passed template(s) to the specified index (index is template index and not the line index)
```ts
loreParser.pushTemplates(1, itemTemplate)
```
```ts
loreParser.pushTemplates(2, itemTemplate, randomTemplates)
```

### Remove Templates

This methods removed all passed template(s) to the item lore
```ts
loreParser.removeTemplates(itemTemplate)
```
```ts
loreParser.removeTemplates(itemTemplate, rarityTemplate)
```

# ⚠️ Important

You have to call 'update' method to set the item's lore correcly.

```ts
loreParser.update(player)
```
you can also select the slot, by default the slot is setted to 'player.selectedSlot'
```ts
loreParser.update(player, 6)
```

















