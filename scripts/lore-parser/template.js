class Template {
    constructor(base, keys, options) {
        this.base = base;
        this.keys = keys;
        this.options = options;
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
