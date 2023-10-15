import TemplatesManager from './templates.manager';
class Template {
    constructor(base, keys, options, isComplexTemplate) {
        this.base = base;
        this.keys = keys;
        this.options = options;
        this.isComplexTemplate = isComplexTemplate;
        if (!isComplexTemplate) {
            this.base = this.base.map((v) => {
                Object.values(this.keys).forEach((key) => (v = v.replaceAll(key, TemplatesManager.MARKER + key + TemplatesManager.MARKER)));
                return v;
            });
            this.base[this.base.length - 1] = this.base[this.base.length - 1] + TemplatesManager.TEMPLATE_END_MARKER;
        }
        TemplatesManager.addTemplate(this);
    }
    get shape() {
        return this.handlerOptions();
    }
    handlerOptions() {
        let shape = this.base;
        if (!this.options)
            return shape;
        if (this.options?.basesColors)
            shape = shape.map((str) => this.options.basesColors + str);
        if (this.options?.clearLines)
            shape = shape.map((str) => Template.CLEAR_LINE + str);
        return shape;
    }
}
Template.CLEAR_LINE = '§r';
Template.DEFAULT_OPTIONS = {};
export default Template;
