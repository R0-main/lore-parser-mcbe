import { world } from '@minecraft/server';
import LoreParser from 'lore-parser/lore.parser';
import Template from 'lore-parser/template';
import TemplateManager from 'lore-parser/templates.manager';
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
const weaponTemplate = new Template(['┌─', '│', '│ §7Damage §8: §h%d', '│ §7Durability §8: §h%s/%m', '│ ', '└─ '], {
    durability: '%s',
    maxDurability: '%m',
    rarity: '%r',
    rarity1: '%r1',
    damage: '%d',
}, 'weaponTempate', {
    clearLines: true,
    basesColors: '§7',
});
const enchantTemplate = new Template(['', '%e', '3', '4', '5', '6', '7', '8', '9'], {
    enchant: '%e',
}, 'enchantTempate', {
    clearLines: true,
    basesColors: '§7',
});
const armorTemplate = new Template(['┌─', '│', '│ §7Durability §8: §h%s', '│ §7Protection §8: §h%p', '│ ', '└─ '], {
    durability: '%s',
    protection: '%p',
}, 'armorTemplate', {
    clearLines: true,
    basesColors: '§7',
});
/* let test : test<Template> = '' */
/* for (const player of world.getAllPlayers()) {
    // @ts-ignore
    const inventory = player.getComponent('inventory')?.container as Container;
    const item = inventory.getItem(player.selectedSlot);

    const armorsNames = ['chestplate', 'helmet', 'leggings', 'boots'];

    const isArmor = armorsNames.some((v) => item.typeId.includes(v));

    let loreParser;

    if (armorsNames.some((v) => item.typeId.includes(v))) loreParser = new LoreParser(item, armorTempalte);
    else loreParser = new LoreParser(item, weaponTemplate);

    loreParser.initTemplate();

    loreParser.set('durability', 100);

    if (isArmor) {
        loreParser.set('protection', '1900M');
    } else {
        const damageGlyphe1 = Object.keys(damageGlypheToValue)[randomIntFromInterval(0, Object.keys(damageGlypheToValue).length - 1)];

        const damage = damageGlyphe + damageGlyphe1;

        damageGlypheToValue['']; // 1000

        loreParser.set('damage', damage);
    }

    loreParser.get('damage'); // => 10M

    loreParser.update(player);
} */
function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
world.afterEvents.chatSend.subscribe((evt) => {
    // @ts-ignore
    const inventory = evt.sender.getComponent('inventory')?.container;
    const item = inventory.getItem(evt.sender.selectedSlot);
    const lp = new LoreParser(item, weaponTemplate);
    if (evt.message.startsWith('-add')) {
        /* 		lp.add('enchant', 'Xp upgarde III\n§gFire Sword I\n§2Poison II');
        lp.update(evt.sender); */
        TemplateManager.getTemplate(item.getLore());
        return;
    }
    /* 	if (!evt.message.startsWith('-')) {


        lp.get('enchant')

        return
    }; */
    lp.initTemplate();
    lp.set('durability', 100);
    lp.set('maxDurability', 1000);
    //lp.add('enchant' , 'Xp upgarde III\n§gFire Sword I\n§2Poison II')
    /* 	lp.itemStack.nameTag = 'test\nfazfa'.repeat(20) */
    lp.update(evt.sender);
});
console.warn('first');
