class Template {
    constructor(base, keys, options) {
        this.base = base;
        this.keys = keys;
        this.options = options;
        this.base = this.base.map((v) => {
            Object.values(this.keys).forEach((key) => v = v.replaceAll(key, Template.MARKER + key + Template.MARKER));
            return v;
        });
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
Template.MARKER = '§×';
Template.CLEAR_LINE = '§r';
export default Template;
