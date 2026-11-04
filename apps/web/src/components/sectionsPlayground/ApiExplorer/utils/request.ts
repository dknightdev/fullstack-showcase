import type { Endpoint, RequestInput } from '../types'

const PATH_PARAM_PATTERN = /\{(\w+)\}/g

export const hasBody = (endpoint: Endpoint): boolean => endpoint.defaultBody !== undefined

export const getInitialInput = (endpoint: Endpoint): RequestInput => {
	const pathParams: Record<string, string> = {}
	const queryParams: Record<string, string> = {}

	endpoint.params.forEach((param) => {
		const target = param.kind === 'path' ? pathParams : queryParams
		target[param.name] = param.defaultValue
	})

	return {
		pathParams,
		queryParams,
		body: endpoint.defaultBody ?? ''
	}
}

export const buildPath = (endpoint: Endpoint, pathParams: Record<string, string>): string =>
	endpoint.path.replace(PATH_PARAM_PATTERN, (placeholder, name: string) => {
		const value = pathParams[name]?.trim()

		return value ? encodeURIComponent(value) : placeholder
	})

export const buildQuery = (queryParams: Record<string, string>): string => {
	const search = new URLSearchParams()

	Object.entries(queryParams).forEach(([name, value]) => {
		const trimmed = value.trim()

		if (trimmed) {
			search.set(name, trimmed)
		}
	})

	const query = search.toString()

	return query ? `?${query}` : ''
}

export const buildUrl = (baseUrl: string, endpoint: Endpoint, input: RequestInput): string =>
	`${baseUrl}${buildPath(endpoint, input.pathParams)}${buildQuery(input.queryParams)}`
