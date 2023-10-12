import { ItemStack } from "@minecraft/server";
import LoreError from "./lore.error";
import Template, { TKeys, TShape } from "./template";
import TemplatesManager from "./templates.manager";

export default class TemplateEditor < TTemplate extends Template<TKeys> > {

    private lore : TShape

    constructor( private template : TTemplate, private itemStack : ItemStack) {
        this.lore = this.itemStack.getLore()
    }

    public set(key: keyof TTemplate['keys'] , value: string | number | boolean): void | LoreError {
		const keyValue = this.template.keys[key as string];
		let lore = this.lore;

		if (typeof value === 'string' && value?.length > LoreError.MAX_LORE_LINE_LENGTH) return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);

		lore = lore.map((v) => v.replaceAll(keyValue, value.toString()));

		if (lore.some((line) => line.length > LoreError.MAX_LORE_LINE_LENGTH)) return new LoreError(LoreError.types.MAX_LORE_LINE_LENGTH);

		this.lore = lore;
		this.itemStack.setLore(lore);
	}

	public get(key: keyof TTemplate['keys']): string {
		const keyValue = this.template.keys[key as string];

		const lineIndex = this.template.shape.findIndex((v) => v.includes(keyValue));
		const targetLine = this.lore[lineIndex];

		const keyIndex = this.template.shape[lineIndex].split(TemplatesManager.MARKER).indexOf(keyValue);

		const value = targetLine.split(TemplatesManager.MARKER);

		return value[keyIndex] || null;
	}

}
