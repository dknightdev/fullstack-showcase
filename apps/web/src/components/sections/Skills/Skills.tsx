import { useTranslation } from 'react-i18next'
import styles from './Skills.module.css'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Chip from '@/components/ui/Chip/Chip'

const skillCategories = [
	{
		key: 'frontend',
		skills: [
			'React',
			'React Native',
			'Angular',
			'HTML',
			'CSS'
		]
	},
	{
		key: 'backend',
		skills: [
			'Node.js',
			'Express.js',
			'Nest.js',
			'.NET',
			'Laravel',
			'REST APIs'
		]
	},
	{
		key: 'databases',
		skills: [
			'MySQL',
			'PostgreSQL'
		]
	},
	{
		key: 'languages',
		skills: [
			'JavaScript',
			'TypeScript',
			'Python',
			'C#',
			'Go',
			'PHP'
		]
	},
	{
		key: 'toolsAndPractices',
		skills: [
			'Git',
			'Docker',
			'Firebase',
			'Agile / Scrum',
			'Redis',
			'Clean Architecture',
			'Hexagonal Architecture'
		]
	}
]

const Skills = () => {
	const { t } = useTranslation()

	return (
		<Section id='skills'>
			<SectionHeading
				eyebrow={t('skills.eyebrow')}
				title={t('skills.title')}
				highlight={t('skills.highlight')}
				description={t('skills.description')}
			/>

				<div className={styles.grid}>
					{skillCategories.map((category, index) => (
						<article
							key={category.key}
							className={styles.card}
						>
							<div className={styles.cardHeader}>
								<span className={styles.number}>
									{String(index + 1).padStart(2, '0')}
								</span>

								<h3>{t(`skills.categories.${category.key}.title`)}</h3>
							</div>

							<p className={styles.description}>
								{t(`skills.categories.${category.key}.description`)}
							</p>

							<div className={styles.skills}>
								{category.skills.map((skill) => (
									<Chip key={skill}>
										{skill}
									</Chip>
								))}
							</div>
						</article>
					))}
				</div>
		</Section>
	)
}

export default Skills
