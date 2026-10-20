import { useTranslation } from 'react-i18next'
import styles from './About.module.css'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Reveal from '@/components/ui/Reveal/Reveal'

const principles = [
	{
		number: '01',
		key: 'endToEnd'
	},
	{
		number: '02',
		key: 'quality'
	},
	{
		number: '03',
		key: 'problemSolving'
	},
	{
		number: '04',
		key: 'collaboration'
	}
]

const About = () => {
	const { t } = useTranslation()

	return (
		<Section id='about'>
			<SectionHeading
				eyebrow={t('about.eyebrow')}
				title={t('about.title')}
				highlight={t('about.highlight')}
			/>

			<Reveal direction='right'>
				<div className={styles.content}>
					<div className={styles.description}>
						<p>
							{t('about.description.first')}
						</p>

						<p>
							{t('about.description.second')}
						</p>

						<p>
							{t('about.description.third')}
						</p>
					</div>

					<div className={styles.principles}>
						{principles.map((principle) => (
							<article
								key={principle.number}
								className={styles.principle}
							>
								<span className={styles.number}>
									{principle.number}
								</span>

								<div>
									<h3>{t(`about.principles.${principle.key}.title`)}</h3>

									<p>{t(`about.principles.${principle.key}.description`)}</p>
								</div>
							</article>
						))}
					</div>
				</div>
			</Reveal>
		</Section>
	)
}

export default About
