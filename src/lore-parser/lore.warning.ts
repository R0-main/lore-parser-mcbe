export default class LoreWarning {
	private static ERROR_PREFIX: string = '§8§l[§4LoreWarning§8] §7->§r§c ';

	public static MAX_LORE_LINE_LENGTH: number = 50;
	public static MAX_LORE_LINE: number = 20;

	public static REPLACEABLE_MARLER: string = '%s';

	public static warnings = {
		MAX_LORE_LINE_LENGTH: `You have tried to edit or add a new lore line at index %s, but this line is too long (%s characters). You can't have more than ${LoreWarning.MAX_LORE_LINE_LENGTH} character in a single line of lore!`,
		MAX_LORE_LINE: `You have tried to add a lore line at the index %s, but you can't have more than ${LoreWarning.MAX_LORE_LINE} lines of lore!`,
		REMOVE_UNDEFINED_INDEX: `You've tried to remove a lore line, but the index %s is not reachable!`,
		EDIT_UNDEFINED_INDEX: `You've tried to edit a lore line, but the index %s is not reachable!`,
		INIT_VOID_TEMPLATES: `You've tried init templates without any templates!`,
	};

	constructor(warning: keyof (typeof LoreWarning)['warnings'], ...infos: Array<string | number | boolean>) {
		let errorMessage = LoreWarning.warnings[warning];
		infos.forEach((info) => (errorMessage = errorMessage.replace(LoreWarning.REPLACEABLE_MARLER, info.toString())));
		console.warn(`${LoreWarning.ERROR_PREFIX} ${errorMessage}`);
	}
}
