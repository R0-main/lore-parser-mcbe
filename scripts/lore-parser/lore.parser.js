import { EntityInventoryComponent } from '@minecraft/server';
import LoreWarning from './lore.warning';
import TemplatesManager from './templates.manager';
import TemplateEditor from './template.editor';
export default class LoreParser {
    constructor(itemStack) {
        this.itemStack = itemStack;
        this.lore = this.itemStack.getLore() || [];
    }
    /*
     *
     * Utils Methods
     *
     */
    add(...strings) {
        for (let i = 0; i < strings.length; i++) {
            const str = strings[i];
            if (str.length >= LoreWarning.MAX_LORE_LINE_LENGTH) {
                new LoreWarning('MAX_LORE_LINE_LENGTH', this.lore.length, str.length);
                this.lore = [...this.lore, str.substring(0, LoreWarning.MAX_LORE_LINE_LENGTH)];
                continue;
            }
            if (this.lore.length + strings.length <= LoreWarning.MAX_LORE_LINE) {
                this.lore = [...this.lore, str];
                return;
            }
            else
                return new LoreWarning('MAX_LORE_LINE', this.lore.length + strings.length);
        }
    }
    remove(index) {
        if (index >= this.lore.length)
            return new LoreWarning('REMOVE_UNDEFINED_INDEX', index);
        this.lore.splice(index, 1);
    }
    edit(index, str) {
        if (index >= this.lore.length)
            return new LoreWarning('EDIT_UNDEFINED_INDEX', index);
        this.lore[index] = str;
    }
    push(index, str) {
        if (index >= this.lore.length)
            return new LoreWarning('EDIT_UNDEFINED_INDEX', index);
        if (index + this.lore.length > LoreWarning.MAX_LORE_LINE)
            return new LoreWarning('MAX_LORE_LINE', index + this.lore.length);
        this.lore.splice(index, 0, str);
    }
    /*
     *
     * Get Method
     *
     */
    getTemplates() {
        return [...TemplatesManager.getTemplates(this.lore)];
    }
    /*
     *
     * Templates Handling Method
     *
     */
    for(template) {
        return new TemplateEditor(template, this);
    }
    /*
     *
     * Templates Methods
     *
     */
    initTemplates(...templates) {
        this.lore = [];
        const length = this.lore.length + templates.map((v) => v.shape.length).reduce((accumulator, curr) => accumulator + curr);
        if (length > LoreWarning.MAX_LORE_LINE)
            return new LoreWarning('MAX_LORE_LINE', length);
        for (const template of templates) {
            this.lore = [...this.lore, ...template.shape];
        }
    }
    pushTemplates(...templates) {
        const length = this.lore.length + templates.map((v) => v.shape.length).reduce((accumulator, curr) => accumulator + curr);
        if (length > LoreWarning.MAX_LORE_LINE)
            return new LoreWarning('MAX_LORE_LINE', length);
        for (const template of templates) {
            this.lore = [...this.lore, ...template.shape];
        }
    }
    /*
     *
     * Update Method
     *
     */
    update(player, slot = player.selectedSlot) {
        this.itemStack.setLore(this.lore);
        let inventory = player.getComponent(EntityInventoryComponent.componentId);
        inventory.container.setItem(slot, this.itemStack);
    }
    /*
     *
     * Check Method
     *
     */
    hasTemplates(...templates) {
        let result = false;
        for (const template of templates) {
            if (!template.isComplexTemplate) {
                const templates = TemplatesManager.getTemplates(this.lore);
                result = !!templates.has(template);
            }
            else {
                result = TemplatesManager.isSameTemplate(template.shape, this.lore);
            }
        }
        return result;
    }
}
