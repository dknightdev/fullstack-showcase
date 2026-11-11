import { useTranslation } from 'react-i18next'
import type { IconType } from 'react-icons'
import { SiDotnet, SiNestjs, SiGo } from 'react-icons/si'
import { TbCircleCheck } from 'react-icons/tb'

import styles from './ApiSelector.module.css'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import type { ApiDefinition, ApiId } from '../types'

type ApiSelectorProps = {
	apis: ApiDefinition[]
	selectedId: ApiId
	onSelect: (id: ApiId) => void
}

const apiIcons: Record<ApiId, IconType> = {
	dotnet: SiDotnet,
	nestjs: SiNestjs,
	go: SiGo
}

const ApiSelector = ({ apis, selectedId, onSelect }: ApiSelectorProps) => {
	const { t } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer' })

	return (
		<div
			className={styles.selector}
			role='group'
			aria-label={t('selectorLabel')}
		>
			{apis.map((api) => {
				const isSelected = api.id === selectedId

				return (
					<button
						key={api.id}
						type='button'
						className={`${styles.option} ${isSelected ? styles.selected : ''}`}
						aria-pressed={isSelected}
						onClick={() => onSelect(api.id)}
					>
						<span className={styles.header}>
							<span className={styles.icon}>
								<AppIcon icon={apiIcons[api.id]} size={24} />
							</span>

							<span className={styles.technology}>{api.technology}</span>

							<span className={styles.check}>
								<AppIcon icon={TbCircleCheck} size={20} />
							</span>
						</span>

						<span className={styles.responsibility}>
							{t(`apis.${api.id}.responsibility`)}
						</span>
						{!api.baseUrl && <span className={styles.responsibility}>{t('developmentLabel')}</span>}
					</button>
				)
			})}
		</div>
	)
}

export default ApiSelector
