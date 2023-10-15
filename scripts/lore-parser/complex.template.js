import Template from './template';
export default class ComplexTemplate extends Template {
    constructor(templates, options = Template.DEFAULT_OPTIONS) {
        let keys = {};
        let opts = {};
        for (const template of templates) {
            for (const key in template.keys) {
                if (template.keys.hasOwnProperty(key)) {
                    keys[key] = template.keys[key];
                }
            }
            opts = { ...options, ...template.options };
        }
        let base = templates.reduce((acc, template) => acc.concat(template.base), []);
        super(base, keys, opts, true);
        this.templates = templates;
    }
}
