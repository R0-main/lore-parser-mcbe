export type TOptions = {
	clearLines: boolean;
};

export type TShape = Array<string>;

export type TKeys = {
    [key : string] : string
};

export default class Template {
	public static CLEAR_LINE: string = '§r';

	constructor(private base: TShape, public keys : TKeys, public options?: TOptions) {}

	public get shape(): TShape {
		return Template.handlerOptions(this.base, this.options);
	}

	private static handlerOptions(base: TShape, options?: TOptions): TShape {
		let shape = base;
		if (options.clearLines) shape = shape.map((str) => Template.CLEAR_LINE + str);
		return shape;
	}
}
