# lore-parser-mcbe
This is a lore parser for minecraft bedrock edition that allow to manage item lore easly

# How to use

First of all, this lore parser is templates oriented. You are able to edit the lore easely with simple methods but, you can also create templates to manage information in lore, without having to remove all visual stuff ...

To manage your lore as you wants, you first need to create a lore parser instance : 

```ts
import LoreParser from 'lore-parser/lore.parser';

const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
const item = inventory.container.getItem(0);
const loreParser = new LoreParser(item);

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
lp.initTemplates(rarityTemplate, durabilityTemplate);
```
or with the examples shown above
```ts
lp.initTemplates(itemTemplate);
```

then you 






















