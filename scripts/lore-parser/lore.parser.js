import { EntityInventoryComponent } from '@minecraft/server';
import LoreError from './lore.error';
import TemplatesManager from './templates.manager';
import TemplateEditor from './template.editor';
export default class LoreParser {
    constructor(itemStack) {
        this.itemStack = itemStack;
        this.lore = this.itemStack.getLore() || [];
    }
    add(...strings) {
        for (let i = 0; i < strings.length; i++) {
            const str = strings[i];
            if (str.length > LoreError.MAX_LORE_LINE_LENGTH) {
                new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);
                continue;
            }
            if (this.lore.length + strings.length < LoreError.MAX_LORE_LINE) {
                this.lore = [...this.lore, str];
                return;
            }
            else
                new LoreError(LoreError.types.MAX_LORE_LINE);
        }
    }
    initTemplates(...templates) {
        this.lore = [];
        for (const template of templates) {
            this.lore = [...this.lore, ...template.shape];
        }
    }
    for(template) {
        return new TemplateEditor(template, this);
    }
    update(player, slot = player.selectedSlot) {
        this.itemStack.setLore(this.lore);
        let inventory = player.getComponent(EntityInventoryComponent.componentId);
        inventory.container.setItem(slot, this.itemStack);
    }
    hasTemplate(template) {
        const templates = TemplatesManager.getTemplates(this.lore);
        return !!templates.get(template.name);
    }
}
