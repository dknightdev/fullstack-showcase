import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'motion/react'

import styles from './ApiExplorer.module.css'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Reveal from '@/components/ui/Reveal/Reveal'
import { motionConfig } from '@/config/motion'
import ApiInfo from './components/ApiInfo'
import ApiSelector from './components/ApiSelector'
import EndpointList from './components/EndpointList'
import RequestPanel from './components/RequestPanel'
import ResponsePanel from './components/ResponsePanel'
import { apis, getApi } from './data/apis'
import { getEndpoint } from './data/endpoints'
import useRequestExecution from './hooks/useRequestExecution'
import type { ApiId, EndpointId, RequestInput } from './types'

const ApiExplorer = () => {
	const { t } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer' })
	const shouldReduceMotion = useReducedMotion()
	const { state, execute, reset } = useRequestExecution()

	const [apiId, setApiId] = useState<ApiId>('dotnet')
	const [endpointId, setEndpointId] = useState<EndpointId>(() => getApi('dotnet').endpointIds[0])

	const api = getApi(apiId)
	const endpoints = api.endpointIds.map(getEndpoint)
	const endpoint = endpoints.find((item) => item.id === endpointId)

	const handleSelectApi = (id: ApiId) => {
		if (id === apiId) {
			return
		}

		setApiId(id)
		const firstEndpoint = getApi(id).endpointIds[0]
		if (firstEndpoint) {
			setEndpointId(firstEndpoint)
		}
		reset()
	}

	const handleSelectEndpoint = (id: EndpointId) => {
		if (id === endpointId) {
			return
		}

		setEndpointId(id)
		reset()
	}

	const handleExecute = (input: RequestInput) => {
		if (endpoint && api.baseUrl) {
			execute(api, endpoint, input)
		}
	}

	return (
		<Section id='apiExplorer'>
			<SectionHeading
				eyebrow={t('eyebrow')}
				title={t('title')}
				highlight={t('highlight')}
				description={t('description')}
			/>

			<Reveal direction='right'>
				<div className={styles.content}>
					<ApiSelector
						apis={apis}
						selectedId={apiId}
						onSelect={handleSelectApi}
					/>

					<div className={styles.workspace}>
						<motion.div
							key={api.id}
							initial={shouldReduceMotion ? false : { opacity: motionConfig.opacity.hidden, y: motionConfig.distance.short }}
							animate={{ opacity: motionConfig.opacity.visible, y: 0 }}
							transition={{ duration: motionConfig.duration.normal, ease: motionConfig.ease }}
						>
							<ApiInfo api={api} />

							{endpoint && api.baseUrl ? (
								<div className={styles.explorer}>
									<EndpointList
										endpoints={endpoints}
										selectedId={endpointId}
										onSelect={handleSelectEndpoint}
									/>

									<div className={styles.testing}>
										<RequestPanel
											key={endpoint.id}
											baseUrl={api.baseUrl}
											endpoint={endpoint}
											issues={state.status === 'validationError' ? state.issues : []}
											isRunning={state.status === 'running'}
											onExecute={handleExecute}
										/>

										<ResponsePanel state={state} />
									</div>
								</div>
							) : <p className={styles.inDevelopment}>{t('inDevelopment')}</p>}
						</motion.div>
					</div>
				</div>
			</Reveal>
		</Section>
	)
}

export default ApiExplorer
