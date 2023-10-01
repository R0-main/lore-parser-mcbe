class LoreParser {
    constructor(itemStack, template = LoreParser.BASE_TEMPLATE) {
        this.itemStack = itemStack;
        this.template = template;
    }
    add(...strings) {
        for (let i = 0; i < strings.length; i++) {
            const currentLore = this.itemStack.getLore();
            const str = strings[i];
            if (currentLore.length + strings.length < 20)
                this.itemStack.setLore([...currentLore, str]);
            else
                new LoreError(`You have tried adding a new lore line, but you can't have more than 20 lines of lore !`);
        }
    }
    initTemplate() {
        if (this.template.settings.clearLine)
            this.template.shape = this.template.shape.map((v) => LoreParser.CLEAR_LINE + v);
        this.itemStack.setLore(this.template.shape);
    }
    update(player, slot = player.selectedSlot) {
        // @ts-ignore
        player.getComponent('inventory').container.setItem(slot, this.itemStack);
    }
}
LoreParser.CLEAR_LINE = '§r';
LoreParser.BASE_TEMPLATE = {
    shape: ['ffafafa'],
    settings: {
        clearLine: true,
    },
};
export default LoreParser;
class LoreError {
    constructor(message) {
        this.message = message;
        console.warn(LoreError.ERROR_PREFIX + message);
    }
}
LoreError.ERROR_PREFIX = 'LoreError:';
