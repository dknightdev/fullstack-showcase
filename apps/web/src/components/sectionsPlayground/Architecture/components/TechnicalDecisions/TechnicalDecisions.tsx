import Chip from '@/components/ui/Chip/Chip'
import styles from './TechnicalDecisions.module.css'
import Reveal from '@/components/ui/Reveal/Reveal'

const decisions = [
	{
		number: '01',
		category: 'Tecnologías',
		title: 'Diversidad tecnológica',
		description: 'Utilizar diferentes tecnologías para desarrollar servicios independientes y demostrar la capacidad de trabajar con distintos ecosistemas backend.',
		details: [
			'.NET para la gestión del catálogo',
			'NestJS para la gestión de pedidos',
			'Go para las consultas analíticas'
		],
		result: 'Explorar diferentes herramientas y demostrar su integración dentro de una misma solución.'
	},
	{
		number: '02',
		category: 'Arquitectura',
		title: 'Arquitectura según las necesidades',
		description: 'Aplicar diferentes enfoques arquitectónicos según la complejidad y las responsabilidades de cada servicio, evitando agregar complejidad innecesaria.',
		details: [
			'Clean Architecture en Catalog API',
			'Arquitectura modular en Orders API',
			'Estructura sencilla en Analytics API'
		],
		result: 'Mantener una separación clara de responsabilidades sin replicar patrones que no aportan valor a todos los servicios.'
	},
	{
		number: '03',
		category: 'Persistencia',
		title: 'Base de datos compartida',
		description: 'Utilizar una única instancia de PostgreSQL con esquemas independientes para mantener sencilla la infraestructura y conservar la separación de responsabilidades.',
		details: [
			'Esquemas catalog y orders',
			'Credenciales independientes por servicio',
			'Permisos de lectura y escritura según la responsabilidad de cada API'
		],
		result: 'Reducir la complejidad de infraestructura sin perder el aislamiento lógico de los datos.'
	},
	{
		number: '04',
		category: 'Comunicación',
		title: 'Acceso directo para analítica',
		description: 'Permitir que Analytics API consulte directamente los esquemas de PostgreSQL en lugar de depender de endpoints HTTP de los otros servicios.',
		details: [
			'Acceso de solo lectura',
			'Consultas sobre catalog y orders',
			'Sin modificar información administrada por otras APIs'
		],
		result: 'Simplificar la obtención de datos y facilitar consultas eficientes para reportes, considerando un posible crecimiento del volumen de información.'
	},
	{
		number: '05',
		category: 'Infraestructura',
		title: 'Despliegue de bajo costo',
		description: 'Seleccionar servicios de alojamiento que permitan mantener el proyecto publicado sin asumir costos mensuales.',
		details: [
			'Render para desplegar las APIs',
			'Neon para PostgreSQL',
			'AWS S3 y CloudFront para el frontend'
		],
		result: 'Mantener el proyecto disponible con una infraestructura de bajo costo, teniendo en cuenta las limitaciones de los planes gratuitos, como la suspensión por inactividad.'
	}
]

function TechnicalDecisions() {
	return (
		<section className={styles.technicalDecisions} id="technical-decisions">
			<Reveal>
				<div className={styles.header}>
					<span className={styles.eyebrow}>Criterios de diseño</span>
					<h2>Decisiones técnicas</h2>
					<p>
						Cada decisión responde a una necesidad del proyecto, buscando un equilibrio entre simplicidad, separación de responsabilidades y exploración tecnológica.
					</p>
				</div>
			</Reveal>

			<div className={styles.decisions}>
				{decisions.map((decision) => (
					<Reveal key={decision.number}>
						<article className={styles.decision}>
							<div className={styles.decisionHeader}>
								<span className={styles.number}>{decision.number}</span>
								<Chip size='small'>{decision.category}</Chip>
							</div>

							<div className={styles.decisionContent}>
								<h3>{decision.title}</h3>
								<p>{decision.description}</p>

								<ul>
									{decision.details.map(detail => (
										<li key={detail}>{detail}</li>
									))}
								</ul>
							</div>

							<div className={styles.result}>
								<span>Resultado</span>
								<p>{decision.result}</p>
							</div>
						</article>
					</Reveal>
				))}
			</div>
		</section>
	)
}

export default TechnicalDecisions
