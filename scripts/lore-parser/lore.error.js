class LoreWarning {
    constructor(message) {
        this.message = message;
        console.warn(LoreWarning.ERROR_PREFIX + message);
    }
}
LoreWarning.ERROR_PREFIX = '§4LoreWarning: §c';
LoreWarning.MAX_LORE_LINE_LENGTH = 50;
LoreWarning.MAX_LORE_LINE = 20;
LoreWarning.types = {
    MAX_LORE_LINE_LENGTH: `You have tried to edit or add a new lore line, but you can't have more than ${LoreWarning.MAX_LORE_LINE_LENGTH} character in one line od lore !`,
    MAX_LORE_LINE: `You have tried add a new lore line, but you can't have more than ${LoreWarning.MAX_LORE_LINE} lines of lore !`,
    REMOVE_UNDEFINED_INDEX: `You have tried to remove a lore line, but the specified index  !`,
};
export default LoreWarning;
