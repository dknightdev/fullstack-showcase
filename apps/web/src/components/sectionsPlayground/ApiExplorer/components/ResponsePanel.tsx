import { lazy, Suspense, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbLoader2, TbTerminal2 } from 'react-icons/tb'

import styles from './ResponsePanel.module.css'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'
import type { EndpointId, ExecutionState } from '../types'
import { isAnalyticsEndpoint, parseAnalytics } from '../analytics/response'
import type { AnalyticsData } from '../analytics/types'
import { stringifyJson, tokenizeJson } from '../utils/json'
import { parseJson } from '../utils/validateRequest'

const AnalyticsModal = lazy(() => import('./analytics/AnalyticsModal'))

type ResponsePanelProps = {
	state: ExecutionState
	endpointId: EndpointId
}

const getStatusClass = (status: number): string => {
	if (status >= 400) {
		return styles.statusError
	}

	return styles.statusSuccess
}

const ResponsePanel = ({ state, endpointId }: ResponsePanelProps) => {
	const { t } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer' })
	const [visualization, setVisualization] = useState<{ data: AnalyticsData, response: object } | null>(null)
	const [errorResponse, setErrorResponse] = useState<object | null>(null)

	const handleVisualize = (response: Extract<ExecutionState, { status: 'completed' }>['response']) => {
		if (!isAnalyticsEndpoint(endpointId)) return
		const parsed = parseJson(response.body)

		try {
			if (!parsed.ok) throw new Error('Invalid JSON')
			setVisualization({ data: parseAnalytics(endpointId, parsed.value), response })
			setErrorResponse(null)
		} catch (error) {
			console.error('Invalid analytics response', error)
			setErrorResponse(response)
		}
	}

	const renderContent = () => {
		switch (state.status) {
			case 'idle':
				return (
					<div className={styles.placeholder}>
						<AppIcon icon={TbTerminal2} size={28} />
						<p className={styles.placeholderTitle}>{t('response.idleTitle')}</p>
						<p>{t('response.idleDescription')}</p>
					</div>
				)

			case 'running':
				return (
					<div className={styles.placeholder}>
						<AppIcon icon={TbLoader2} size={28} className={styles.spinner} />
						<p className={styles.placeholderTitle}>{t('response.runningTitle')}</p>
						<p>{t('response.runningDescription')}</p>
					</div>
				)

			case 'validationError':
				return (
					<div className={`${styles.placeholder} ${styles.validation}`}>
						<AppIcon icon={TbAlertTriangle} size={28} />
						<p className={styles.placeholderTitle}>{t('response.validationTitle')}</p>

						<ul>
							{state.issues.map((issue) => (
								<li key={issue.code === 'missingPathParam' ? `${issue.code}-${issue.field}` : issue.code}>
									{issue.code === 'missingPathParam'
										? t('validation.missingPathParam', { field: issue.field })
										: t('validation.invalidJson')}
								</li>
							))}
						</ul>
					</div>
				)

			case 'networkError':
				return (
					<div className={`${styles.placeholder} ${styles.validation}`}>
						<AppIcon icon={TbAlertTriangle} size={28} />
						<p className={styles.placeholderTitle}>{t('response.networkErrorTitle')}</p>
						<p>{t('response.networkErrorDescription')}</p>
					</div>
				)

			case 'completed': {
				const { status, statusText, durationMs, body } = state.response
				const parsed = parseJson(body)

				return (
					<>
						<div className={styles.meta}>
							<span className={`${styles.status} ${getStatusClass(status)}`}>
								<span className={styles.dot} />
								{status} {statusText}
							</span>

							<span className={styles.duration}>
								{t('response.duration', { ms: durationMs })}
							</span>
						</div>

						{body === '' ? (
							<p className={styles.noContent}>{t('response.noContent')}</p>
						) : (
							<pre className={`${styles.code} custom-scroll`}>
								<code>
									{tokenizeJson(parsed.ok ? stringifyJson(parsed.value) : body).map((token, index) => (
										<span
											key={index}
											className={token.type === 'plain' ? undefined : styles[token.type]}
										>
											{token.text}
										</span>
									))}
								</code>
							</pre>
						)}
						{isAnalyticsEndpoint(endpointId) && status >= 200 && status < 300 && (
							<div className={styles.visualization}>
								<Button
									variant='secondary'
									onClick={() => handleVisualize(state.response)}
								>
									{t('analytics.visualize')}
								</Button>
								{errorResponse === state.response && <p className={styles.validation} role='alert'>{t('analytics.invalidResponse')}</p>}
							</div>
						)}
					</>
				)
			}
		}
	}

	return (
		<section className={styles.panel}>
			<h4 className={styles.title}>{t('response.title')}</h4>

			<div className={styles.body} aria-live='polite'>
				{renderContent()}
			</div>

			{visualization && state.status === 'completed' && visualization.response === state.response && createPortal(
				<Suspense fallback={<p role='status'>{t('analytics.loading')}</p>}>
					<AnalyticsModal isOpen onClose={() => setVisualization(null)} data={visualization.data} />
				</Suspense>,
				document.body
			)}
		</section>
	)
}

export default ResponsePanel
