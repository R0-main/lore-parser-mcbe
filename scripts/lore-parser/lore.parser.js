import LoreError from './lore.error';
import TemplatesManager from './templates.manager';
import TemplateEditor from './template.editor';
export default class LoreParser {
    constructor(itemStack, template) {
        this.itemStack = itemStack;
        this.template = template;
        this.currentLore = this.itemStack.getLore() || [];
    }
    add(...strings) {
        for (let i = 0; i < strings.length; i++) {
            const str = strings[i];
            if (str.length > LoreError.MAX_LORE_LINE_LENGTH) {
                new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
                continue;
            }
            if (this.currentLore.length + strings.length < LoreError.MAX_LORE_LINE) {
                this.currentLore = [...this.currentLore, str];
                this.itemStack.setLore(this.currentLore);
                return;
            }
            else
                new LoreError(LoreError.types.MAX_LORE_LINE);
        }
    }
    initTemplate() {
        this.currentLore = this.template.shape;
        this.itemStack.setLore(this.currentLore);
    }
    for(template) {
        return new TemplateEditor(template, this.itemStack);
    }
    update(player, slot = player.selectedSlot) {
        // @ts-ignore
        player.getComponent('inventory').container.setItem(slot, this.itemStack);
    }
    hasTemplate(template) {
        const templates = TemplatesManager.getTemplates(this.currentLore);
        /* console.warn(templates.get(weaponTemplate.name)) */
        return !!templates.get(template.name);
    }
}
