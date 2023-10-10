class LoreError {
    constructor(message) {
        this.message = message;
        console.warn(LoreError.ERROR_PREFIX + message);
    }
}
LoreError.ERROR_PREFIX = '§4LoreError: §c';
LoreError.MAX_LORE_LINE_LENGTH = 50;
LoreError.MAX_LORE_LINE = 20;
LoreError.types = {
    MAX_LORE_LINE_LENGTH: `You have tried to edit or add a new lore line, but you can't have more than ${LoreError.MAX_LORE_LINE_LENGTH} character in one line od lore !`,
    MAX_LORE_LINE: `You have tried add a new lore line, but you can't have more than ${LoreError.MAX_LORE_LINE} lines of lore !`,
};
export default LoreError;
