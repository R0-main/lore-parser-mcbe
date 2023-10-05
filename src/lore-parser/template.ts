export type TOptions = {
	clearLines: boolean;
	basesColors: string;
};

export type TShape = Array<string>;

export type TKeys = Record<string, string>

export default class Template<T extends TKeys> {
	public static CLEAR_LINE: string = '§r';

	constructor(private readonly base: TShape, public readonly keys : T, public readonly options?: TOptions) {}

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
