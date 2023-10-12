import LoreParser from './lore.parser';
import TemplatesManager from './templates.manager';

export type TOptions = {
	clearLines: boolean;
	basesColors: string;
};

export type TShape = Array<string>;

export type TKeys = Record<string, string>;

export default class Template<T extends TKeys> {
	public static CLEAR_LINE: string = '§r';

	constructor(public readonly name: string, private readonly base: TShape, public readonly keys: T, public readonly options?: TOptions) {
		this.base = this.base.map((v) => {
			Object.values(this.keys).forEach((key) => (v = v.replaceAll(key, TemplatesManager.MARKER + key + TemplatesManager.MARKER)));
			return v;
		});
		this.base[this.base.length - 1] = this.base[this.base.length - 1] + TemplatesManager.TEMPLATE_END_MARKER;

		TemplatesManager.addTemplate(this);
	}

	public get shape(): TShape {
		return Template.handlerOptions(this.base, this.options);
	}

	private static handlerOptions(base: TShape, options?: TOptions): TShape {
		let shape = base;
		if (options.basesColors) shape = shape.map((str) => options.basesColors + str);
		if (options.clearLines) shape = shape.map((str) => Template.CLEAR_LINE + str);
		return shape;
	}
}
