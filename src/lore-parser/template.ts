import TemplatesManager from './templates.manager';

export type TOptions = {
	clearLines?: boolean;
	basesColors?: string;
};

export type TShape = Array<string>;

export type TKeys = Record<string, string>;

export default class Template<T extends TKeys> {
	public static readonly CLEAR_LINE: string = '§r';
	public static readonly DEFAULT_OPTIONS: TOptions = {};

	constructor(
		public readonly base: TShape,
		public readonly keys: T,
		public readonly options?: TOptions,
		public readonly isComplexTemplate?: boolean
	) {
		if (!isComplexTemplate) {
			this.base = this.base.map((v) => {
				Object.values(this.keys).forEach((key) => (v = v.replaceAll(key, TemplatesManager.MARKER + key + TemplatesManager.MARKER)));
				return v;
			});

			this.base[this.base.length - 1] = this.base[this.base.length - 1] + TemplatesManager.TEMPLATE_END_MARKER;
		}

		TemplatesManager.addTemplate(this);
	}

	public get shape(): TShape {
		return this.handlerOptions();
	}

	private handlerOptions(): TShape {
		let shape = this.base;

		if (!this.options) return shape;

		if (this.options?.basesColors) shape = shape.map((str) => this.options.basesColors + str);
		if (this.options?.clearLines) shape = shape.map((str) => Template.CLEAR_LINE + str);
		return shape;
	}
}
