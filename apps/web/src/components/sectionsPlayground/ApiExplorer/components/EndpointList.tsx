import { useTranslation } from 'react-i18next'

import styles from './EndpointList.module.css'
import MethodBadge from '../../../ui/MethodBadge/MethodBadge'
import type { Endpoint, EndpointGroup, EndpointId } from '../types'

type EndpointListProps = {
	endpoints: Endpoint[]
	selectedId: EndpointId
	onSelect: (id: EndpointId) => void
}

const EndpointList = ({ endpoints, selectedId, onSelect }: EndpointListProps) => {
	const { t } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer' })

	const groups = endpoints.reduce<{ group: EndpointGroup, items: Endpoint[] }[]>((result, endpoint) => {
		const existing = result.find((entry) => entry.group === endpoint.group)

		if (existing) {
			existing.items.push(endpoint)
		} else {
			result.push({ group: endpoint.group, items: [endpoint] })
		}

		return result
	}, [])

	return (
		<nav className={styles.list} aria-label={t('endpoints.listLabel')}>
			{groups.map(({ group, items }) => (
				<div key={group} className={styles.group}>
					<p className={styles.groupTitle}>{t(`endpoints.groups.${group}`)}</p>

					<ul>
						{items.map((endpoint) => {
							const isSelected = endpoint.id === selectedId

							return (
								<li key={endpoint.id}>
									<button
										type='button'
										className={`${styles.endpoint} ${isSelected ? styles.selected : ''}`}
										aria-current={isSelected ? 'true' : undefined}
										onClick={() => onSelect(endpoint.id)}
									>
										<span className={styles.route}>
											<MethodBadge method={endpoint.method} />
											<code>{endpoint.path}</code>
										</span>

										<span className={styles.description}>
											{t(`endpoints.descriptions.${endpoint.id}`)}
										</span>
									</button>
								</li>
							)
						})}
					</ul>
				</div>
			))}
		</nav>
	)
}

export default EndpointList
