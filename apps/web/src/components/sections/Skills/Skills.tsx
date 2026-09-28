import styles from './Skills.module.css'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Chip from '@/components/ui/Chip/Chip'

const skillCategories = [
	{
		title: 'Frontend',
		description: 'Desarrollo de interfaces web y aplicaciones móviles.',
		skills: [
			'React',
			'React Native',
			'Angular',
			'HTML',
			'CSS'
		]
	},
	{
		title: 'Backend',
		description: 'Desarrollo de APIs, servicios y lógica de negocio.',
		skills: [
			'Node.js',
			'Express',
			'Nest.js',
			'.NET',
			'Laravel',
			'REST APIs'
		]
	},
	{
		title: 'Bases de datos',
		description: 'Diseño y desarrollo de estructuras y procesos de datos.',
		skills: [
			'MySQL',
			'PostgreSQL'
		]
	},
	{
		title: 'Lenguajes',
		description: 'Lenguajes utilizados a lo largo de diferentes proyectos.',
		skills: [
			'JavaScript',
			'TypeScript',
			'PHP',
			'Python',
			'C#',
			'Go'
		]
	},
	{
		title: 'Herramientas y prácticas',
		description: 'Herramientas y metodologías utilizadas en el desarrollo.',
		skills: [
			'Git',
			'Docker',
			'Firebase',
			'Agile / Scrum'
		]
	}
]

const Skills = () => {
	return (
		<Section id='skills'>
			<SectionHeading
				eyebrow='Habilidades'
				title='Tecnologías que utilizo'
				highlight='para construir.'
				description='Un stack orientado al desarrollo de soluciones completas, desde interfaces y aplicaciones móviles hasta APIs, bases de datos e integraciones.'
			/>

				<div className={styles.grid}>
					{skillCategories.map((category) => (
						<article
							key={category.title}
							className={styles.card}
						>
							<div className={styles.cardHeader}>
								<span className={styles.number}>
									{String(skillCategories.indexOf(category) + 1).padStart(2, '0')}
								</span>

								<h3>{category.title}</h3>
							</div>

							<p className={styles.description}>
								{category.description}
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
