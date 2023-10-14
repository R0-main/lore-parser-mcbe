import Template from './template';
export default class ComplexTemplate extends Template {
    constructor(templates, options) {
        let keys = {};
        for (const template of templates) {
            for (const key in template.keys) {
                if (template.keys.hasOwnProperty(key)) {
                    keys[key] = template.keys[key];
                }
            }
        }
        let base = templates.reduce((acc, template) => acc.concat(template.base), []);
        super(base, keys, options, true);
        this.templates = templates;
        this.options = options;
    }
}
