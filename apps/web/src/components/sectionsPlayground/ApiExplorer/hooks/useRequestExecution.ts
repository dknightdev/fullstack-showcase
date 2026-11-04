import { useCallback, useEffect, useRef, useState } from 'react'

import type { ApiDefinition, Endpoint, ExecutionState, RequestInput } from '../types'
import { buildUrl } from '../utils/request'
import { simulateResponse } from '../utils/simulateResponse'
import { validateRequest } from '../utils/validateRequest'

const useRequestExecution = () => {
	const [state, setState] = useState<ExecutionState>({ status: 'idle' })
	const timeoutRef = useRef<number | undefined>(undefined)

	const cancelPending = useCallback(() => {
		window.clearTimeout(timeoutRef.current)
	}, [])

	const reset = useCallback(() => {
		cancelPending()
		setState({ status: 'idle' })
	}, [cancelPending])

	const execute = useCallback((api: ApiDefinition, endpoint: Endpoint, input: RequestInput) => {
		cancelPending()

		const issues = validateRequest(endpoint, input)

		if (issues.length) {
			setState({ status: 'validationError', issues })
			return
		}

		const response = simulateResponse(endpoint, input, buildUrl(api.baseUrl, endpoint, input))

		setState({ status: 'running' })

		timeoutRef.current = window.setTimeout(() => {
			setState({ status: 'completed', response })
		}, response.durationMs)
	}, [cancelPending])

	useEffect(() => cancelPending, [cancelPending])

	return { state, execute, reset }
}

export default useRequestExecution
