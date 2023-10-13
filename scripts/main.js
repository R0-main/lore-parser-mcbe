import { world } from '@minecraft/server';
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
export const weaponTemplate = new Template('weaponTempate', ['┌─', '│', '│ §7Damage §8: §h%d', '│ §7Durability §8: §h%s/%m', '│ ', '└─ '], {
    durability: '%s',
    maxDurability: '%m',
    damage: '%d',
}, {
    clearLines: true,
    basesColors: '§7',
});
const enchantTemplate = new Template('enchantTemplate', ['', '%e', '3', '4', '5', '6', '7', '8', '9'], {
    enchant: '%e',
}, {
    clearLines: true,
    basesColors: '§7',
});
const armorTemplate = new Template('armorTemplate', ['┌─', '│', '│ §7Durability §8: §h%s', '│ §7Protection §8: §h%p', '│ ', '└─ '], {
    durability: '%s',
    protection: '%p',
}, {
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
    const lp = new LoreParser(item);
    lp.initTemplates(armorTemplate, weaponTemplate);
    /* lp.for(armorTemplate).set('protection', 100)
    lp.for(armorTemplate).set('durability', 1000); */
    /* console.warn(lp.hasTemplate(armorTemplate)) */
    lp.for(armorTemplate).set('durability', 100);
    /* if (evt.message.startsWith('-add')) {

        if (lp.hasTemplate(weaponTemplate)) {
            lp.for(weaponTemplate).set('durability', 1);
            lp.update(evt.sender);
        } else {
            lp.for(weaponTemplate).addToLore();
            lp.for(armorTemplate).addToLore();

            lp.for(weaponTemplate).set('durability', 100);
            lp.for(armorTemplate).set('protection', 1000000);
            lp.update(evt.sender);
        }


        return;
    }


    console.warn(lp.hasTemplate(weaponTemplate))
    lp.initTemplate();


    //lp.add('enchant' , 'Xp upgarde III\n§gFire Sword I\n§2Poison II')


    lp.for(weaponTemplate).set('damage', '§cNot Defined Yet');

    lp.for(weaponTemplate).set('maxDurability', 1000000);
    lp.for(weaponTemplate).set('durability', 100000);

     */
    lp.update(evt.sender);
});
world.afterEvents.buttonPush.subscribe(({ source }) => {
    const player = source;
    // @ts-ignore
    const inventory = player.getComponent('inventory')?.container;
    const item = inventory.getItem(player.selectedSlot);
    const lpWPtemplate = new LoreParser(item);
    /* 	lpWPtemplate.hasTemplate(); */
});
console.warn('first');
