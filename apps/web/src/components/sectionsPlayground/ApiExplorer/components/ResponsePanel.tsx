import { useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbLoader2, TbTerminal2 } from 'react-icons/tb'

import styles from './ResponsePanel.module.css'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import type { ExecutionState } from '../types'
import { stringifyJson, tokenizeJson } from '../utils/json'
import { parseJson } from '../utils/validateRequest'

type ResponsePanelProps = {
	state: ExecutionState
}

const getStatusClass = (status: number): string => {
	if (status >= 400) {
		return styles.statusError
	}

	return styles.statusSuccess
}

const ResponsePanel = ({ state }: ResponsePanelProps) => {
	const { t } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer' })

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
							<pre className={styles.code} data-lenis-prevent>
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
		</section>
	)
}

export default ResponsePanel
