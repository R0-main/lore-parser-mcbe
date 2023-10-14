class LoreWarning {
    constructor(warning, ...infos) {
        let errorMessage = LoreWarning.warnings[warning];
        infos.forEach((info) => (errorMessage = errorMessage.replace(LoreWarning.REPLACEABLE_MARLER, info.toString())));
        console.warn(`${LoreWarning.ERROR_PREFIX} ${errorMessage}`);
    }
}
LoreWarning.ERROR_PREFIX = '§8§l[§4LoreWarning§8] §7->§r§c ';
LoreWarning.MAX_LORE_LINE_LENGTH = 50;
LoreWarning.MAX_LORE_LINE = 20;
LoreWarning.REPLACEABLE_MARLER = '%s';
LoreWarning.warnings = {
    MAX_LORE_LINE_LENGTH: `You have tried to edit or add a new lore line at index %s, but this line is too long (%s characters). You can't have more than ${LoreWarning.MAX_LORE_LINE_LENGTH} character in a single line of lore!`,
    MAX_LORE_LINE: `You have tried to add a lore line at the index %s, but you can't have more than ${LoreWarning.MAX_LORE_LINE} lines of lore!`,
    REMOVE_UNDEFINED_INDEX: `You've tried to remove a lore line, but the index %s is not reachable!`,
    EDIT_UNDEFINED_INDEX: `You've tried to edit a lore line, but the index %s is not reachable!`,
};
export default LoreWarning;
