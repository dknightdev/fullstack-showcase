import { useTranslation } from 'react-i18next'

import styles from './ArchitectureOverview.module.css'
import Reveal from '@/components/ui/Reveal/Reveal'

const ArchitectureOverview = () => {
	const { t } = useTranslation()

	const highlights = [
		{
			number: '01',
			titleKey: 'playground.architecture.overview.highlights.0.title',
			descriptionKey: 'playground.architecture.overview.highlights.0.description'
		},
		{
			number: '02',
			titleKey: 'playground.architecture.overview.highlights.1.title',
			descriptionKey: 'playground.architecture.overview.highlights.1.description'
		},
		{
			number: '03',
			titleKey: 'playground.architecture.overview.highlights.2.title',
			descriptionKey: 'playground.architecture.overview.highlights.2.description'
		}
	]

	return (
		<Reveal direction='right'>
			<div className={styles.content}>
				<div className={styles.description}>
					<p>
						{t('playground.architecture.overview.description.first')}
					</p>

					<p>
						{t('playground.architecture.overview.description.second')}
					</p>

					<p>
						{t('playground.architecture.overview.description.third')}
					</p>
				</div>

				<div className={styles.highlights}>
					{highlights.map((highlight) => (
						<article
							key={highlight.titleKey}
							className={styles.highlight}
						>
							<span className={styles.number}>
								{highlight.number}
							</span>

							<div>
								<h3>{t(highlight.titleKey)}</h3>
								<p>{t(highlight.descriptionKey)}</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</Reveal>
	)
}

export default ArchitectureOverview
