import Template, { TKeys, TOptions, TShape } from './template';

type TCombinedKeys<TTemplates extends Array<Template<TKeys>>> = {
	[K in keyof UnionToIntersection<TTemplates[number]['keys']>]: string;
};

export default class ComplexTemplate<TTemplates extends Array<Template<TKeys>>> extends Template<TKeys> {
	public readonly base: TShape;
	public readonly keys: TCombinedKeys<TTemplates>;

	public readonly template: Template<TCombinedKeys<TTemplates>>;

	constructor(public readonly templates: TTemplates, public readonly options?: TOptions) {
		let keys: TCombinedKeys<TTemplates> = {} as TCombinedKeys<TTemplates>;

		for (const template of templates) {
			for (const key in template.keys) {
				if (template.keys.hasOwnProperty(key)) {
					keys[key] = template.keys[key];
				}
			}
		}
		let base = templates.reduce((acc, template) => acc.concat(template.base), [] as TShape);

		super(base, keys, options, true);
	}
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
