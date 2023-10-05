import { Container, EntityComponent, world } from '@minecraft/server';
import LoreParser from 'lore-parser/lore.parser';
import Template from 'lore-parser/template';

const durabilityTemplate = new Template(
	[
		'┌─', 
		'│', 
		'│ §7Durability §8: §h%s', 
		'│', 
		'└─ '
	],
	{
		durability: '%s',
		rarity: '%r',
		rarity1: '%r1',
		damage: '%d',
	},
	{
		clearLines: true,
		basesColors: '§7',
	}
);

/* let test : test<Template> = '' */

for (const player of world.getAllPlayers()) {
	// @ts-ignore
	const inventory = player.getComponent('inventory')?.container as Container;
	const item = inventory.getItem(player.selectedSlot);

	const loreParser = new LoreParser(item, durabilityTemplate);

	loreParser.add('§r§efafaz');
	loreParser.add('§r§afafaz');
	loreParser.add('§r§tfafaz');
	loreParser.initTemplate();

	loreParser.set('durability', 100);

	console.warn(loreParser.get('durability'));
	loreParser.update(player);
}

const cmd = world.getDimension('overworld').runCommand('say hello');

/* console.warn(cmd.)


class ClassB<Data extends Record<string, any>> {
  
	constructor(public data: Array<string>, public keys : Data) {
	}
  }
  
  class ClassA<Data extends Record<string, any>> {
  
	constructor(public classBInstance: ClassB<Data>) {}
  
	// Utilisez un type générique pour la méthode getValueByKey
	// qui accepte uniquement les clés du type de données de la classe B.
	getValueByKey<K extends keyof Data>(key: K): Data[K] {
	  if (this.classBInstance.keys.hasOwnProperty(key)) {
		return this.classBInstance.keys[key];
	  } else {
		throw new Error(`La clé "${key}" n'existe pas dans l'attribut de la classe B.`);
	  }
	}
  }

  const instanceB = new ClassB(['test'], {
	name: "John",
	ag2: 30,
	age1: 30,
  });
  const instanceA = new ClassA(instanceB);
  
  const nameValue = instanceA.getValueByKey(''); // Le type de nameValue est string
  console.log(nameValue); // Affiche "John" dans la console. */
