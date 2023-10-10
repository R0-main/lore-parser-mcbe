import TemplateManager from './templates.manager';
class Template {
    constructor(base, keys, id, options) {
        this.base = base;
        this.keys = keys;
        this.id = id;
        this.options = options;
        this.base = this.base.map((v) => {
            Object.values(this.keys).forEach((key) => (v = v.replaceAll(key, TemplateManager.MARKER + key + TemplateManager.MARKER)));
            return v;
        });
        TemplateManager.addTemplate(this);
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
