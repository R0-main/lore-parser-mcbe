import TemplatesManager from './templates.manager';
class Template {
    constructor(name, base, keys, options) {
        this.name = name;
        this.base = base;
        this.keys = keys;
        this.options = options;
        this.base = this.base.map((v) => {
            Object.values(this.keys).forEach((key) => (v = v.replaceAll(key, TemplatesManager.MARKER + key + TemplatesManager.MARKER)));
            return v;
        });
        this.base[this.base.length - 1] = this.base[this.base.length - 1] + TemplatesManager.TEMPLATE_END_MARKER;
        TemplatesManager.addTemplate(this);
    }
    get shape() {
        return Template.handlerOptions(this.base, this.options);
    }
    static handlerOptions(base, options) {
        let shape = base;
        if (options.basesColors)
            shape = shape.map((str) => options.basesColors + str);
        if (options.clearLines)
            shape = shape.map((str) => Template.CLEAR_LINE + str);
        return shape;
    }
}
Template.CLEAR_LINE = '§r';
export default Template;
