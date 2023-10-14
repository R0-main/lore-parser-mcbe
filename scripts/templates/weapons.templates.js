import Template from "lore-parser/template";
export const rarityTamplate = new Template('rarityTemplate', ["La rareté de l'arme est %r"], {
    rarity: '%r',
}, {
    clearLines: true,
    basesColors: '§7',
});
export const descTamplate = new Template('descTamplate', ['', '%d'], {
    description: '%d',
}, {
    clearLines: true,
    basesColors: '§7',
});
