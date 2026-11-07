import { useCallback, useEffect, useRef, useState } from 'react'

import type { ApiDefinition, Endpoint, ExecutionState, RequestInput } from '../types'
import { buildUrl, hasBody } from '../utils/request'
import { validateRequest } from '../utils/validateRequest'

const useRequestExecution = () => {
	const [state, setState] = useState<ExecutionState>({ status: 'idle' })
	const requestRef = useRef<AbortController | null>(null)

	const cancelPending = useCallback(() => {
		requestRef.current?.abort()
		requestRef.current = null
	}, [])

	const reset = useCallback(() => {
		cancelPending()
		setState({ status: 'idle' })
	}, [cancelPending])

	const execute = useCallback(async (api: ApiDefinition, endpoint: Endpoint, input: RequestInput) => {
		cancelPending()

		const issues = validateRequest(endpoint, input)
		if (issues.length) {
			setState({ status: 'validationError', issues })
			return
		}

		if (!api.baseUrl) {
			setState({ status: 'networkError' })
			return
		}

		const controller = new AbortController()
		requestRef.current = controller
		const start = performance.now()
		setState({ status: 'running' })

		try {
			const response = await fetch(buildUrl(api.baseUrl, endpoint, input), {
				method: endpoint.method,
				headers: hasBody(endpoint) ? { 'Content-Type': 'application/json' } : undefined,
				body: hasBody(endpoint) ? input.body : undefined,
				signal: controller.signal
			})
			const body = await response.text()

			if (!controller.signal.aborted) {
				setState({
					status: 'completed',
					response: {
						status: response.status,
						statusText: response.statusText,
						durationMs: Math.round(performance.now() - start),
						body
					}
				})
			}
		} catch (error) {
			if (!controller.signal.aborted) {
				console.error('API request failed', error)
				setState({ status: 'networkError' })
			}
		} finally {
			if (requestRef.current === controller) {
				requestRef.current = null
			}
		}
	}, [cancelPending])

	useEffect(() => cancelPending, [cancelPending])

	return { state, execute, reset }
}

export default useRequestExecution
