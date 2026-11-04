import type { Endpoint, RequestInput, ValidationIssue } from '../types'
import { hasBody } from './request'

export const parseJson = (source: string): { ok: true, value: unknown } | { ok: false } => {
	try {
		return { ok: true, value: JSON.parse(source) }
	} catch {
		return { ok: false }
	}
}

export const validateRequest = (endpoint: Endpoint, input: RequestInput): ValidationIssue[] => {
	const issues: ValidationIssue[] = []

	endpoint.params
		.filter((param) => param.kind === 'path')
		.forEach((param) => {
			if (!input.pathParams[param.name]?.trim()) {
				issues.push({ code: 'missingPathParam', field: param.name })
			}
		})

	if (hasBody(endpoint) && !parseJson(input.body).ok) {
		issues.push({ code: 'invalidJson' })
	}

	return issues
}
