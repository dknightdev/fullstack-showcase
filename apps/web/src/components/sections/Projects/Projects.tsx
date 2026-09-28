import { useState } from 'react'
import { TbArrowUpRight } from 'react-icons/tb'
import Modal from '@/components/ui/Modal/Modal'
import Button from '@/components/ui/Button/Button'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Chip from '@/components/ui/Chip/Chip'
import styles from './Projects.module.css'

type ProjectLink = {
	label: string
	href: string
}

type ProjectDetails = {
	description: string
	context: string
	role: string
	highlights?: string[]
}

type ProjectItem = {
	title: string
	category?: string
	context: string
	description: string
	image: string
	technologies: string[]
	details: ProjectDetails
	links?: ProjectLink[]
}

const projects: ProjectItem[] = [
	{
		title: 'Aplicación de pedidos para tenderos',
		category: 'Aplicación web y móvil',
		context: 'Asistencia Móvil',
		description:
			'Aplicación enfocada en tenderos para la solicitud de pedidos de productos, con versiones móvil y web.',
		image: '/projects/orders-app.jpg',
		technologies: [
			'React Native',
			'React',
			'Node.js',
			'SQL'
		],
		details: {
			description:
				'Aplicación para la solicitud de pedidos de productos, enfocada en tenderos. Los usuarios pueden ingresar a un catálogo, seleccionar los productos y cantidades que necesitan, definir cuándo desean recibir el pedido y realizar el pago contraentrega.',
			context:
				'Proyecto desarrollado como parte de las soluciones de Asistencia Móvil.',
			role:
				'Participación en el desarrollo y mantenimiento de la aplicación móvil, versión web y servicios relacionados con el flujo de pedidos.',
			highlights: [
				'Catálogo de productos',
				'Creación y gestión de pedidos',
				'Programación de entregas',
				'Pago contraentrega',
				'Aplicación móvil y versión web'
			]
		},
		links: [
			{
				label: 'Google Play',
				href: '#'
			},
			{
				label: 'Versión web',
				href: '#'
			}
		]
	},
	{
		title: 'Plataforma de acompañamiento empresarial',
		category: 'Aplicación web',
		context: 'Proyecto freelance',
		description:
			'Plataforma personalizada para gestionar programas de apoyo empresarial y mentoría desde un panel centralizado.',
		image: '/projects/business-platform.jpg',
		technologies: [
			'React',
			'NestJS',
			'MySQL'
		],
		details: {
			description:
				'Plataforma web personalizada diseñada para gestionar programas de apoyo empresarial y mentoría, permitiendo a las organizaciones administrar empresas, expertos, horas asignadas, sesiones, seguimientos y métricas de rendimiento desde un panel centralizado.',
			context:
				'Proyecto desarrollado como trabajo freelance para un cliente independiente.',
			role:
				'Desarrollo integral de la plataforma, colaborando directamente con el cliente para definir, refinar e implementar los requisitos de negocio y las funcionalidades.',
			highlights: [
				'Gestión de empresas y expertos',
				'Programas de mentoría',
				'Seguimiento de sesiones',
				'Control de horas asignadas',
				'Paneles y métricas',
				'Reportes PDF',
				'Notificaciones por correo',
				'Archivos .ics para sesiones',
				'Gestión de usuarios y acceso'
			]
		},
		links: [
			{
				label: 'Ver demo',
				href: '#'
			}
		]
	},
	{
		title: 'Identificación de especies de peces',
		category: 'Aplicación móvil',
		context: 'Proyecto universitario',
		description:
			'Aplicación móvil para la identificación de especies de peces del Caribe colombiano, desarrollada con funcionamiento offline.',
		image: '/projects/fish-app.jpg',
		technologies: [
			'React Native',
			'Realm',
			'JavaScript'
		],
		details: {
			description:
				'Aplicación móvil desarrollada para identificar especies de peces del Caribe colombiano. Cuenta con información de 136 especies y fue diseñada para funcionar sin conexión a Internet mediante una base de datos local.',
			context:
				'Proyecto desarrollado durante la etapa universitaria como una solución solicitada y remunerada.',
			role:
				'Desarrollo de la aplicación móvil, implementación de la base de datos local y construcción de la experiencia de consulta offline.',
			highlights: [
				'136 especies',
				'Funcionamiento offline',
				'Base de datos local',
				'Consulta de información de especies',
				'Aplicación para Android'
			]
		},
		links: [
			{
				label: 'Google Play',
				href: '#'
			}
		]
	}
]

const websites: ProjectItem[] = [
	{
		title: 'Sitio web corporativo',
		context: 'Proyecto freelance',
		description:
			'Página informativa desarrollada para presentar los servicios y propuesta de valor del cliente.',
		image: '/projects/website-01.jpg',
		technologies: [
			'React',
			'CSS',
			'Responsive Design'
		],
		details: {
			description:
				'Sitio web desarrollado para mejorar la presencia digital del cliente y presentar de forma clara sus servicios y propuesta de valor.',
			context:
				'Proyecto desarrollado como trabajo freelance.',
			role:
				'Desarrollo frontend y adaptación de la interfaz para diferentes tamaños de pantalla.'
		},
		links: [
			{
				label: 'Visitar sitio',
				href: '#'
			}
		]
	},
	{
		title: 'Landing page',
		context: 'Proyecto freelance',
		description:
			'Landing page enfocada en presentar un servicio de forma clara y orientada a conversión.',
		image: '/projects/website-02.jpg',
		technologies: [
			'React',
			'CSS',
			'Responsive Design'
		],
		details: {
			description:
				'Landing page desarrollada para presentar un servicio específico mediante una interfaz clara, responsive y enfocada en la comunicación del producto.',
			context:
				'Proyecto desarrollado como trabajo freelance.',
			role:
				'Desarrollo completo del frontend y adaptación responsive.'
		},
		links: [
			{
				label: 'Visitar sitio',
				href: '#'
			}
		]
	},
	{
		title: 'Sitio informativo',
		context: 'Proyecto freelance',
		description:
			'Sitio web desarrollado para presentar información, servicios y canales de contacto.',
		image: '/projects/website-03.jpg',
		technologies: [
			'React',
			'CSS',
			'Responsive Design'
		],
		details: {
			description:
				'Sitio web informativo desarrollado para organizar y presentar los servicios y canales de contacto del cliente.',
			context:
				'Proyecto desarrollado como trabajo freelance.',
			role:
				'Desarrollo frontend, implementación de componentes y adaptación responsive.'
		},
		links: [
			{
				label: 'Visitar sitio',
				href: '#'
			}
		]
	}
]

const Projects = () => {
	const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)

	const openProject = (project: ProjectItem) => {
		setSelectedProject(project)
	}

	const closeProject = () => {
		setSelectedProject(null)
	}

	return (
		<>
			<Section id='projects'>
				<SectionHeading
					eyebrow='Proyectos'
					title='Lo que he construido'
					highlight='en diferentes contextos.'
					description='Una selección de aplicaciones web, móviles y soluciones digitales desarrolladas en contextos profesionales, freelance y académicos.'
				/>

				<div className={styles.featured}>
					{projects.map((project, index) => (
						<article
							key={project.title}
							className={styles.project}
						>
							<div className={styles.imageWrapper}>
								<img
									src={project.image}
									alt={project.title}
								/>

								<span className={styles.projectNumber}>
									{String(index + 1).padStart(2, '0')}
								</span>
							</div>

							<div className={styles.projectContent}>
								<p className={styles.category}>
									{project.category}
								</p>

								<h3>
									{project.title}
								</h3>

								<p className={styles.context}>
									{project.context}
								</p>

								<p className={styles.description}>
									{project.description}
								</p>

								<div className={styles.technologies}>
									{project.technologies.map(
										(technology) => (
											<Chip key={technology}>
												{technology}
											</Chip>
										)
									)}
								</div>

								<Button
									variant='tertiary'
									onClick={() => openProject(project)}
								>
									Ver proyecto
									<AppIcon icon={TbArrowUpRight} size={16} />
								</Button>
							</div>
						</article>
					))}
				</div>

				<div className={styles.otherProjects}>
					<div className={styles.subheading}>
						<div>
							<p className={styles.category}>
								Otros proyectos
							</p>

							<h3>
								Sitios web
							</h3>
						</div>

						<p>
							Tres sitios web desarrollados para un mismo cliente
							como parte de diferentes proyectos freelance.
						</p>
					</div>

					<div className={styles.websiteGrid}>
						{websites.map((website) => (
							<article
								key={website.title}
								className={styles.website}
							>
								<div className={styles.websiteImage}>
									<img
										src={website.image}
										alt={website.title}
									/>
								</div>

								<div className={styles.websiteContent}>
									<p className={styles.context}>
										{website.context}
									</p>

									<h4>
										{website.title}
									</h4>

									<p>
										{website.description}
									</p>

									<div className={styles.technologies}>
										{website.technologies.map(
											(technology) => (
												<Chip key={technology}>
													{technology}
												</Chip>
											)
										)}
									</div>

									<Button
										variant='tertiary'
										onClick={() =>
											openProject(website)
										}
									>
										Ver proyecto
										<AppIcon icon={TbArrowUpRight} size={16} />
									</Button>
								</div>
							</article>
						))}
					</div>
				</div>
			</Section>

			<Modal
				isOpen={Boolean(selectedProject)}
				onClose={closeProject}
				title={selectedProject?.title}
			>
				{selectedProject && (
					<div className={styles.modalContent}>
						<div className={styles.modalImage}>
							<img
								src={selectedProject.image}
								alt={selectedProject.title}
							/>
						</div>

						<div className={styles.modalSection}>
							<p className={styles.category}>
								{selectedProject.category}
							</p>

							<h3>
								{selectedProject.context}
							</h3>
						</div>

						<div className={styles.modalSection}>
							<h4>
								Descripción
							</h4>

							<p>
								{selectedProject.details.description}
							</p>
						</div>

						<div className={styles.modalSection}>
							<h4>
								Contexto
							</h4>

							<p>
								{selectedProject.details.context}
							</p>
						</div>

						<div className={styles.modalSection}>
							<h4>
								Mi participación
							</h4>

							<p>
								{selectedProject.details.role}
							</p>
						</div>

						{selectedProject.details.highlights && (
							<div className={styles.modalSection}>
								<h4>
									Características
								</h4>

								<ul className={styles.highlights}>
									{selectedProject.details.highlights.map(
										(highlight) => (
											<li key={highlight}>
												{highlight}
											</li>
										)
									)}
								</ul>
							</div>
						)}

						<div className={styles.modalSection}>
							<h4>
								Tecnologías
							</h4>

							<div className={styles.technologies}>
								{selectedProject.technologies.map(
									(technology) => (
										<Chip key={technology}>
											{technology}
										</Chip>
									)
								)}
							</div>
						</div>

						{selectedProject.links && (
							<div className={styles.modalLinks}>
								{selectedProject.links.map((link) => (
									<Button
										key={link.label}
										variant='secondary'
										href={link.href}
										target='_blank'
										rel='noreferrer'
									>
										{link.label}
										<AppIcon icon={TbArrowUpRight} size={16} />
									</Button>
								))}
							</div>
						)}
					</div>
				)}
			</Modal>
		</>
	)
}

export default Projects
