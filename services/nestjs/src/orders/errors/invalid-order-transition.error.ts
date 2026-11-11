export class InvalidOrderTransitionError extends Error {
	constructor(from: string, to: string) {
		super(`Invalid order transition: ${from} -> ${to}`)
		this.name = InvalidOrderTransitionError.name
	}
}
