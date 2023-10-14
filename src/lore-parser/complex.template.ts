import Template, { TKeys, TOptions, TShape } from './template';

type TCombinedKeys<TTemplates extends Array<Template<TKeys>>> = {
    [K in keyof UnionToIntersection<TTemplates[number]['keys']>]: string;
};

export default class ComplexTemplate<TTemplates extends Array<Template<TKeys>>> {

    public readonly base: TShape;
    public readonly keys: TCombinedKeys<TTemplates>;

    public readonly template: Template<TCombinedKeys<TTemplates>>;

    constructor(public readonly name: string, public readonly templates: TTemplates, public readonly options?: TOptions) {
        this.keys = this.combineKeys(templates);
        this.base = this.combineBase(templates);
        this.template = new Template(this.name, this.base, this.keys, this.options);
    }

    public get(): Template<TCombinedKeys<TTemplates>> {
        return this.template;
    }

    private combineKeys(templates: TTemplates): TCombinedKeys<TTemplates> {
        const combinedKeys: TCombinedKeys<TTemplates> = {} as TCombinedKeys<TTemplates>;

        for (const template of templates) {
            for (const key in template.keys) {
                if (template.keys.hasOwnProperty(key)) {
                    combinedKeys[key] = template.keys[key];
                }
            }
        }

        return combinedKeys;
    }

    private combineBase(templates: TTemplates): TShape {
        return templates.reduce((acc, template) => acc.concat(template.base), [] as TShape);
    }
}


type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
