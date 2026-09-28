import styles from './About.module.css'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'

const principles = [
	{
		number: '01',
		title: 'End-to-end',
		description: 'Trabajo en todo el ciclo de desarrollo, desde requerimientos hasta despliegue y soporte en produccion.'
	},
	{
		number: '02',
		title: 'Calidad',
		description: 'Me enfoco en pruebas funcionales, estabilidad, mantenimiento y mejora continua.'
	},
	{
		number: '03',
		title: 'Resolucion de problemas',
		description: 'Analizo requerimientos y los traduzco en soluciones practicas y mantenibles.'
	},
	{
		number: '04',
		title: 'Colaboracion',
		description: 'Trabajo de cerca con equipos de desarrollo y aporto en planificacion, soporte tecnico y entrega.'
	}
]

const About = () => {
	return (
		<Section id='about'>
			<SectionHeading
				eyebrow='Sobre mi'
				title='Construyendo software'
				highlight='con proposito.'
			/>

				<div className={styles.content}>
					<div className={styles.description}>
						<p>
							Soy Full Stack Developer con mas de cinco años de
							experiencia construyendo aplicaciones web y moviles.
						</p>

						<p>
							He participado en distintas etapas del ciclo de
							desarrollo, desde el analisis de requerimientos y la
							implementacion hasta las pruebas funcionales, el
							despliegue, el soporte y el mantenimiento.
						</p>

						<p>
							Disfruto resolver problemas a traves del software y
							construir soluciones confiables, mantenibles y
							preparadas para evolucionar con el tiempo.
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
									<h3>{principle.title}</h3>

									<p>{principle.description}</p>
								</div>
							</article>
						))}
					</div>
				</div>
		</Section>
	)
}

export default About
