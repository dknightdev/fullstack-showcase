import { useTranslation } from 'react-i18next'

import styles from './ArchitectureOverview.module.css'
import Reveal from '@/components/ui/Reveal/Reveal'

const highlights = [
	{
		number: '01',
		title: 'Servicios independientes',
		description: 'Cada API gestiona un dominio específico dentro del sistema.'
	},
	{
		number: '02',
		title: 'Tecnologías backend',
		description: 'Cada servicio utiliza un lenguaje y framework diferente.'
	},
	{
		number: '03',
		title: 'Ecosistema integrado',
		description: 'Todos los componentes forman parte de una misma solución.'
	}
]

const ArchitectureOverview = () => {
	const { t } = useTranslation()

	return (
		<Reveal direction='right'>
			<div className={styles.content}>
				<div className={styles.description}>
					<p>
						Fullstack Showcase nace como un entorno de experimentación
						para explorar diferentes tecnologías y enfoques de desarrollo
						backend dentro de un mismo ecosistema.
					</p>

					<p>
						En lugar de concentrar todas las funcionalidades en una sola
						aplicación, decidí dividir el sistema en servicios independientes.
						Cada uno tiene una responsabilidad definida y utiliza una
						tecnología diferente.
					</p>

					<p>
						El objetivo es explorar cómo estas soluciones pueden integrarse,
						manteniendo una separación clara de responsabilidades y
						permitiendo que cada servicio evolucione de manera independiente.
					</p>
				</div>

				<div className={styles.highlights}>
					{highlights.map((highlight, index) => (
						<article
							key={highlight.title}
							className={styles.highlight}
						>
							<span className={styles.number}>
								{highlight.number}
							</span>

							<div>
								<h3>{highlight.title}</h3>
								<p>{highlight.description}</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</Reveal>
	)
}

export default ArchitectureOverview
