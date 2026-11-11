export type ValidationErrors = Record<string, string[]>

export class DomainValidationError extends Error {
	constructor(readonly errors: ValidationErrors) {
		super('Domain validation failed')
		this.name = DomainValidationError.name
	}
}
