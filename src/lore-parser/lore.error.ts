export default class LoreError {
	private static ERROR_PREFIX: string = 'LoreError:';

	public static MAX_LORE_LINE_LENGTH: number = 50;
	public static MAX_LORE_LINE: number = 20;

	public static types = {
		MAX_LORE_LINE_LENGTH: `You have tried to edit or add a new lore line, but you can't have more than ${LoreError.MAX_LORE_LINE_LENGTH} character in one line od lore !`,
		MAX_LORE_LINE: `You have tried add a new lore line, but you can't have more than ${LoreError.MAX_LORE_LINE} lines of lore !`,
	};

	constructor(private message: string) {
		console.warn(LoreError.ERROR_PREFIX + message);
	}
}
