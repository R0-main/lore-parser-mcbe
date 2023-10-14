import Template from './template';
export default class ComplexTemplate {
    constructor(name, templates, options) {
        this.name = name;
        this.templates = templates;
        this.options = options;
        this.keys = this.combineKeys(templates);
        this.base = this.combineBase(templates);
        this.template = new Template(this.name, this.base, this.keys, this.options);
    }
    get() {
        return this.template;
    }
    combineKeys(templates) {
        const combinedKeys = {};
        for (const template of templates) {
            for (const key in template.keys) {
                if (template.keys.hasOwnProperty(key)) {
                    combinedKeys[key] = template.keys[key];
                }
            }
        }
        return combinedKeys;
    }
    combineBase(templates) {
        return templates.reduce((acc, template) => acc.concat(template.base), []);
    }
}
