import { useTranslation } from 'react-i18next'
import Chip from '@/components/ui/Chip/Chip'
import styles from './TechnicalDecisions.module.css'
import Reveal from '@/components/ui/Reveal/Reveal'

function TechnicalDecisions() {
	const { t } = useTranslation()

	const decisions = [
		{
			number: '01',
			categoryKey: 'playground.architecture.technicalDecisions.decisions.0.category',
			titleKey: 'playground.architecture.technicalDecisions.decisions.0.title',
			descriptionKey: 'playground.architecture.technicalDecisions.decisions.0.description',
			detailsKeys: [
				'playground.architecture.technicalDecisions.decisions.0.details.0',
				'playground.architecture.technicalDecisions.decisions.0.details.1',
				'playground.architecture.technicalDecisions.decisions.0.details.2'
			],
			resultKey: 'playground.architecture.technicalDecisions.decisions.0.result'
		},
		{
			number: '02',
			categoryKey: 'playground.architecture.technicalDecisions.decisions.1.category',
			titleKey: 'playground.architecture.technicalDecisions.decisions.1.title',
			descriptionKey: 'playground.architecture.technicalDecisions.decisions.1.description',
			detailsKeys: [
				'playground.architecture.technicalDecisions.decisions.1.details.0',
				'playground.architecture.technicalDecisions.decisions.1.details.1',
				'playground.architecture.technicalDecisions.decisions.1.details.2'
			],
			resultKey: 'playground.architecture.technicalDecisions.decisions.1.result'
		},
		{
			number: '03',
			categoryKey: 'playground.architecture.technicalDecisions.decisions.2.category',
			titleKey: 'playground.architecture.technicalDecisions.decisions.2.title',
			descriptionKey: 'playground.architecture.technicalDecisions.decisions.2.description',
			detailsKeys: [
				'playground.architecture.technicalDecisions.decisions.2.details.0',
				'playground.architecture.technicalDecisions.decisions.2.details.1',
				'playground.architecture.technicalDecisions.decisions.2.details.2'
			],
			resultKey: 'playground.architecture.technicalDecisions.decisions.2.result'
		},
		{
			number: '04',
			categoryKey: 'playground.architecture.technicalDecisions.decisions.3.category',
			titleKey: 'playground.architecture.technicalDecisions.decisions.3.title',
			descriptionKey: 'playground.architecture.technicalDecisions.decisions.3.description',
			detailsKeys: [
				'playground.architecture.technicalDecisions.decisions.3.details.0',
				'playground.architecture.technicalDecisions.decisions.3.details.1',
				'playground.architecture.technicalDecisions.decisions.3.details.2'
			],
			resultKey: 'playground.architecture.technicalDecisions.decisions.3.result'
		},
		{
			number: '05',
			categoryKey: 'playground.architecture.technicalDecisions.decisions.4.category',
			titleKey: 'playground.architecture.technicalDecisions.decisions.4.title',
			descriptionKey: 'playground.architecture.technicalDecisions.decisions.4.description',
			detailsKeys: [
				'playground.architecture.technicalDecisions.decisions.4.details.0',
				'playground.architecture.technicalDecisions.decisions.4.details.1',
				'playground.architecture.technicalDecisions.decisions.4.details.2'
			],
			resultKey: 'playground.architecture.technicalDecisions.decisions.4.result'
		}
	]
	return (
		<section className={styles.technicalDecisions} id="technical-decisions">
			<Reveal>
				<div className={styles.header}>
					<span className={styles.eyebrow}>{t('playground.architecture.technicalDecisions.eyebrow')}</span>
					<h2>{t('playground.architecture.technicalDecisions.title')}</h2>
					<p>
						{t('playground.architecture.technicalDecisions.description')}
					</p>
				</div>
			</Reveal>

			<div className={styles.decisions}>
				{decisions.map((decision) => (
					<Reveal key={decision.number}>
						<article className={styles.decision}>
							<div className={styles.decisionHeader}>
								<span className={styles.number}>{decision.number}</span>
								<Chip size='small'>{t(decision.categoryKey)}</Chip>
							</div>

							<div className={styles.decisionContent}>
								<h3>{t(decision.titleKey)}</h3>
								<p>{t(decision.descriptionKey)}</p>

								<ul>
									{decision.detailsKeys.map(detailKey => (
										<li key={detailKey}>{t(detailKey)}</li>
									))}
								</ul>
							</div>

							<div className={styles.result}>
								<span>{t('playground.architecture.technicalDecisions.resultLabel')}</span>
								<p>{t(decision.resultKey)}</p>
							</div>
						</article>
					</Reveal>
				))}
			</div>
		</section>
	)
}

export default TechnicalDecisions
