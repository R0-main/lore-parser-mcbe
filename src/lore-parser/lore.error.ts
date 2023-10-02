export default class LoreError {

	private static ERROR_PREFIX : string = 'LoreError:'

	constructor (private message : string){
		console.warn(LoreError.ERROR_PREFIX + message)
	}
}
