import { world } from '@minecraft/server';
import ComplexTemplate from 'lore-parser/complex.template';
import LoreParser from 'lore-parser/lore.parser';
import Template from 'lore-parser/template';
import { rarityTamplate, descTamplate } from 'templates/weapons.templates';
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
    piercing: '%s',
}, {
    clearLines: true,
    basesColors: '§7',
});
const itemTemplate = new ComplexTemplate([weaponTemplate, armorTemplate], { clearLines: true });
world.afterEvents.chatSend.subscribe((evt) => {
    // @ts-ignore
    const inventory = evt.sender.getComponent('inventory')?.container;
    const item = inventory.getItem(evt.sender.selectedSlot);
    const lp = new LoreParser(item);
    lp.add('Testing Line');
    lp.edit(0, 'Line edited');
    lp.push(3, 'Pushed Line');
    lp.remove(3);
    lp.for(weaponTemplate).set('damage', 1000);
    lp.for(weaponTemplate).get('damage'); // 1000
    lp.getTemplates(); // [weaponTemplate]
    lp.hasTemplates(weaponTemplate); // true
    lp.hasTemplates(weaponTemplate, armorTemplate); // false
    lp.pushTemplates(armorTemplate);
    lp.initTemplates(enchantTemplate);
    lp.update(evt.sender);
});
world.afterEvents.buttonPush.subscribe(({ source }) => {
    const player = source;
    // @ts-ignore
    const inventory = player.getComponent('inventory')?.container;
    const item = inventory.getItem(player.selectedSlot);
    const lp = new LoreParser(item);
    if (lp.hasTemplates(rarityTamplate) && lp.hasTemplates(descTamplate))
        return player.sendMessage('§cVous avez déjà un item custom');
    lp.initTemplates(rarityTamplate, descTamplate);
    lp.for(rarityTamplate).set('rarity', 100);
    lp.for(descTamplate).set('description', 'Cette item rename le mob tapé avec');
    lp.update(player);
});
world.afterEvents.entityHitEntity.subscribe((evt) => {
    const player = evt.damagingEntity;
    // @ts-ignore
    const inventory = player.getComponent('inventory')?.container;
    const item = inventory.getItem(player.selectedSlot);
    const lp = new LoreParser(item);
    if (!lp.hasTemplates(rarityTamplate) && !lp.hasTemplates(descTamplate))
        return;
    const damage = lp.for(rarityTamplate).get('rarity');
    evt.hitEntity.applyDamage(parseInt(damage));
    evt.hitEntity.dimension.spawnParticle('minecraft:soul_particle', evt.hitEntity.location);
});
console.warn('first');
