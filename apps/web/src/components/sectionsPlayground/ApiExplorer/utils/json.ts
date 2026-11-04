export type JsonTokenType = 'key' | 'string' | 'number' | 'literal' | 'plain'

export type JsonToken = {
	type: JsonTokenType
	text: string
}

const TOKEN_PATTERN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

export const stringifyJson = (value: unknown): string => JSON.stringify(value, null, '\t')

export const tokenizeJson = (source: string): JsonToken[] => {
	const tokens: JsonToken[] = []
	let cursor = 0

	for (const match of source.matchAll(TOKEN_PATTERN)) {
		const start = match.index

		if (start > cursor) {
			tokens.push({ type: 'plain', text: source.slice(cursor, start) })
		}

		const [full, quoted, colon] = match

		if (quoted !== undefined) {
			tokens.push({ type: colon ? 'key' : 'string', text: quoted })

			if (colon) {
				tokens.push({ type: 'plain', text: colon })
			}
		} else if (full === 'true' || full === 'false' || full === 'null') {
			tokens.push({ type: 'literal', text: full })
		} else {
			tokens.push({ type: 'number', text: full })
		}

		cursor = start + full.length
	}

	if (cursor < source.length) {
		tokens.push({ type: 'plain', text: source.slice(cursor) })
	}

	return tokens
}
