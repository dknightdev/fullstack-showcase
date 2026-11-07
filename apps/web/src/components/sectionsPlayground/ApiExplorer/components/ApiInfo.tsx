import { useTranslation } from 'react-i18next'

import styles from './ApiInfo.module.css'
import Chip from '@/components/ui/Chip/Chip'
import type { ApiDefinition } from '../types'

type ApiInfoProps = {
	api: ApiDefinition
}

const ApiInfo = ({ api }: ApiInfoProps) => {
	const { t } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer' })

	return (
		<div className={styles.info}>
			<div className={styles.intro}>
				<h3>{api.technology}</h3>
				<p>{t(`apis.${api.id}.description`)}</p>
			</div>

			<dl className={styles.details}>
				<div className={styles.item}>
					<dt>{t('info.responsibility')}</dt>
					<dd>{t(`apis.${api.id}.responsibility`)}</dd>
				</div>

				{api.baseUrl && (
					<div className={styles.item}>
						<dt>{t('info.baseUrl')}</dt>
						<dd><code className={styles.code}>{api.baseUrl}</code></dd>
					</div>
				)}

				<div className={styles.item}>
					<dt>{t('info.writes')}</dt>
					<dd className={styles.chips}>
						{api.writes.length
							? api.writes.map((entity) => (
								<Chip key={entity}>{t(`entities.${entity}`)}</Chip>
							))
							: <span>{t('info.readOnly')}</span>}
					</dd>
				</div>

				<div className={styles.item}>
					<dt>{t('info.reads')}</dt>
					<dd className={styles.chips}>
						{api.reads.map((entity) => (
							<Chip key={entity}>{t(`entities.${entity}`)}</Chip>
						))}
					</dd>
				</div>
			</dl>
		</div>
	)
}

export default ApiInfo
