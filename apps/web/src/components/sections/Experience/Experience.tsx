import styles from './Experience.module.css'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Chip from '@/components/ui/Chip/Chip'

const experiences = [
	{
		number: '01',
		company: 'Asistencia Móvil',
		role: 'Full Stack Developer',
		period: '2021 — 2026',
		type: 'Experiencia profesional',
		description:
			'Desarrollo y mantenimiento de aplicaciones web y móviles, APIs e integraciones, participando en diferentes etapas del ciclo de desarrollo, desde el análisis de requerimientos hasta las pruebas, despliegues, soporte y mantenimiento.',
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
		company: 'Trabajo independiente',
		role: 'Full Stack Developer',
		period: '2023 — 2025',
		type: 'Freelance',
		description:
			'Desarrollo de soluciones web para clientes independientes, participando en el análisis de requerimientos, diseño de funcionalidades, desarrollo, pruebas y entrega de proyectos.',
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
	return (
		<Section id='experience'>
			<SectionHeading
				eyebrow='Experiencia'
				title='Experiencia profesional'
				highlight='y trabajo independiente.'
				description='Experiencia desarrollando aplicaciones web y móviles, APIs y soluciones digitales, tanto dentro de equipos de desarrollo como trabajando directamente con clientes.'
			/>

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
											{experience.type}
										</p>

										<h3>
											{experience.company}
										</h3>
									</div>

									<span className={styles.period}>
										{experience.period}
									</span>
								</div>

								<h4>
									{experience.role}
								</h4>

								<p className={styles.description}>
									{experience.description}
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
		</Section>
	)
}

export default Experience
