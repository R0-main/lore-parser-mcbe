import { world, Player, EntityInventoryComponent } from '@minecraft/server';
import ComplexTemplate from 'lore-parser/complex.template';
import LoreParser from 'lore-parser/lore.parser';
import Template from 'lore-parser/template';
const damageGlyphe = '';
const damageGlypheToValue = {
    '': 1,
    '': 2,
    '': 3,
    '': 4,
    '': 5,
    '': 6,
    '': 7,
    '': 8,
    '': 9,
    '': 10,
};
export const weaponTemplate = new Template(['┌─', '│', '│ §7Damage §8: §h%d', '│ §7Durability §8: §h%s/%m', '│ ', '└─ '], {
    durability: '%s',
    maxDurability: '%m',
    damage: '%d',
    damage1: '%d2',
}, {
    clearLines: true,
    basesColors: '§7',
});
const enchantTemplate = new Template(['', '%e', '3', '4', '5', '6', '7', '8', '9'], {
    enchant: '%e',
}, {
    clearLines: true,
    basesColors: '§7',
});
const armorTemplate = new Template(['┌─', '│', '│ §7Durability §8: §h%s', '│ §7Protection §8: §h%p', '│ ', '└─ '], {
    durability: '%s',
    protection: '%p',
}, {
    clearLines: true,
    basesColors: '§7',
});
const itemTemplate = new ComplexTemplate([weaponTemplate, armorTemplate], { clearLines: true });
// first we define a new template, that will store damages and effect.
const swordTemplate = new Template([
    // make sur each line of this array is shorter than 50 character and the array need to be shorter than 20 lines
    '┌─',
    '│',
    '│ §hDamage §8->§c %d',
    '│ §hEffect §8->§e %e',
    '│ ',
    '└─ ',
], {
    damage: '%d',
    effect: '%e', // here all '%e' in the array right above will be replace by setted 'effect' value
}, {
    clearLines: true,
    basesColors: '§7', // this option will add '§7' before each lore line
});
/*

    Chat Send Event
        - in this event we will manage the lore of the holded item to apply the correct lore to store custom data as damage or effect.
        
*/
world.afterEvents.chatSend.subscribe((evt) => {
    // setup all needed variables as inventory but in particular item
    const player = evt.sender;
    const inventory = player.getComponent(EntityInventoryComponent.componentId);
    const item = inventory.container.getItem(player.selectedSlot);
    // test if player hold an item
    if (!item)
        return player.sendMessage('§cYou need to hold an item');
    // also create a LoreParser instance to manage the lore properly
    const lp = new LoreParser(item);
    // test if the item has already the swordTemplate inited
    if (lp.hasTemplates(swordTemplate))
        return player.sendMessage('§cYour item already has the "swordTemplate" inited');
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
    if (!(evt.damagingEntity instanceof Player))
        return;
    // setup all needed variables as inventory but in particular item
    const player = evt.damagingEntity;
    const inventory = player.getComponent(EntityInventoryComponent.componentId);
    const item = inventory.container.getItem(player.selectedSlot);
    // test if player hold an item
    if (!item)
        return;
    // also create a LoreParser instance to manage/read the lore properly
    const lp = new LoreParser(item);
    // test if the item has the swordTemplate inited
    if (!lp.hasTemplates(swordTemplate))
        return;
    // read the stored values
    const damage = lp.for(swordTemplate).get('damage');
    const effect = lp.for(swordTemplate).get('effect');
    // apply damage for 'damageEntity' (we have to convert the damage variable into number because lore parser gives a string value)
    evt.hitEntity.applyDamage(Number(damage));
    // apply the stored effect for 'damageEntity'
    evt.hitEntity.addEffect(effect, 100);
});
world.afterEvents.buttonPush.subscribe(({ source }) => {
    const player = source;
    // @ts-ignore
    const inventory = player.getComponent('inventory')?.container;
    const item = inventory.getItem(player.selectedSlot);
    const lp = new LoreParser(item);
    if (lp.hasTemplates(itemTpl))
        return player.sendMessage('§cVous avez déjà un item custom');
    lp.initTemplates(itemTpl);
    lp.for(itemTpl).set('rarity', '§eLegendray');
    lp.for(itemTpl).set('durability', 100);
    lp.for(itemTpl).set('maxDurability', 110);
    lp.for(itemTemplate).set('durability', 100);
    lp.pushTemplates(1, itemTemplate, itemTpl);
    lp.removeTemplates(itemTemplate);
    lp.update(player);
});
const rarityTemplate = new Template(['┌─', '│', '│ §hRarity §8-> %r', '│ ', '└─ '], {
    rarity: '%r',
}, {
    clearLines: true,
    basesColors: '§7',
});
const durabilityTemplate = new Template(['(%durability/%maxDurability)'], {
    durability: '%durability',
    maxDurability: '%maxDurability',
}, {
    clearLines: true,
    basesColors: '§7',
});
const itemTpl = new ComplexTemplate([rarityTemplate, durabilityTemplate]);
console.warn('first');
