import { useTranslation } from 'react-i18next'
import styles from './Experience.module.css'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Chip from '@/components/ui/Chip/Chip'
import Reveal from '@/components/ui/Reveal/Reveal'

type ExperienceItem = {
	number: string
	key: string
	period: string
	url?: string
	technologies: string[]
}

const experiences: ExperienceItem[] = [
	{
		number: '01',
		key: 'asistenciaMovil',
		url: 'https://amovil.co/',
		period: '2021 — 2026',
		technologies: [
			'React',
			'React Native',
			'Angular',
			'Node.js',
			'Express.js',
			'Nest.js',
			'Laravel',
			'.NET',
			'MySQL',
			'PostgreSQL',
			'JavaScript',
			'TypeScript',
			'Php',
			'Python',
			'Go'
		]
	},
	{
		number: '02',
		key: 'freelance',
		period: '2023 — 2025',
		technologies: [
			'React',
			'Nest.js',
			'MySQL',
			'JavaScript',
			'TypeScript'
		]
	}
]

const Experience = () => {
	const { t } = useTranslation()

	const companyName = (key: string) => t(`experience.items.${key}.company`)

	return (
		<Section id='experience'>
			<SectionHeading
				eyebrow={t('experience.eyebrow')}
				title={t('experience.title')}
				highlight={t('experience.highlight')}
				description={t('experience.description')}
			/>

			<Reveal direction='right'>
				<div className={styles.timeline}>
					{experiences.map((experience) => (
						<article
							key={experience.number}
							className={styles.experience}
						>
							<div className={styles.marker}>
								<span>
									{experience.number}
								</span>
							</div>

							<div className={styles.content}>
								<div className={styles.header}>
									<div>
										<p className={styles.type}>
											{t(`experience.items.${experience.key}.type`)}
										</p>

										<h3 className={styles.company}>
											{experience.url ? (
												<a
													href={experience.url}
													target='_blank'
													rel='noopener noreferrer'
													title={t('experience.visitWebsite', {
														company: companyName(experience.key)
													})}
												>
													{companyName(experience.key)}
												</a>
											) : (
												companyName(experience.key)
											)}
										</h3>
									</div>

									<span className={styles.period}>
										{experience.period}
									</span>
								</div>

								<h4>
									{t(`experience.items.${experience.key}.role`)}
								</h4>

								<p className={styles.description}>
									{t(`experience.items.${experience.key}.description`)}
								</p>

								<div className={styles.technologies}>
									{experience.technologies.map(
										(technology) => (
											<Chip key={technology}>
												{technology}
											</Chip>
										)
									)}
								</div>
							</div>
						</article>
					))}
				</div>
			</Reveal>
		</Section>
	)
}

export default Experience
