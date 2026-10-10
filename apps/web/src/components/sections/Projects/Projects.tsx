import { useState } from 'react'
import { TbArrowUpRight } from 'react-icons/tb'
import Modal from '@/components/ui/Modal/Modal'
import Button from '@/components/ui/Button/Button'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Chip from '@/components/ui/Chip/Chip'
import ImageGallery from '@/components/ui/ImageGallery/ImageGallery'
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
	images: string[]
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
		images: [
			'/project1/preview1.png',
			'/project1/preview2.png',
			'/project1/preview3.png',
			'/project1/preview4.png'
		],
		technologies: [
			'React Native',
			'React',
			'Node.js',
			'MySQL',
			'PostgreSQL',
			'TypeScript'
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
				href: 'https://play.google.com/store/apps/details?id=com.amovil.latienda'
			}
		]
	},
	{
		title: 'Plataforma de acompañamiento empresarial',
		category: 'Aplicación web',
		context: 'Proyecto freelance',
		description:
			'Plataforma personalizada para gestionar programas de apoyo empresarial y mentoría desde un panel centralizado.',
		images: [
			'/project2/preview1.png',
			'/project2/preview2.png',
			'/project2/preview3.png',
			'/project2/preview4.png',
			'/project2/preview5.png'
		],
		technologies: [
			'React',
			'Nest.js',
			'MySQL',
			'TypeScript'
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
		title: 'RayShark',
		category: 'Aplicación móvil',
		context: 'Proyecto desarrollado por encargo',
		description:
			'Aplicación móvil para la identificación de especies de peces del Caribe colombiano, diseñada para funcionar completamente offline.',
		images: [
			'/project3/preview1.png',
			'/project3/preview2.png',
			'/project3/preview3.png'
		],
		technologies: [
			'React Native',
			'Realm',
			'TypeScript'
		],
		details: {
			description:
				'RayShark es una aplicación móvil desarrollada para facilitar la identificación y consulta de información sobre especies de peces del Caribe colombiano. Incluye información de 136 especies y fue diseñada para funcionar sin conexión a Internet mediante una base de datos local.',
			context:
				'Proyecto desarrollado por encargo durante la etapa universitaria de mi hermana, estudiante de Biología. La aplicación fue presentada como parte de un concurso académico en el que resultó ganadora.',
			role:
				'Desarrollo integral de la aplicación móvil, implementación de la base de datos local con Realm y construcción de la experiencia de consulta offline.',
			highlights: [
				'136 especies registradas',
				'Funcionamiento completamente offline',
				'Base de datos local con Realm',
				'Consulta de información de especies',
				'Aplicación para Android',
				'Proyecto presentado en concurso académico'
			]
		},
		links: [
			{
				label: 'Google Play',
				href: 'https://play.google.com/store/apps/details?id=com.dknightdev.ray_shark'
			}
		]
	}
]

const websites: ProjectItem[] = [
	{
		title: 'Agencia de branding y productos promocionales',
		category: 'Sitio web',
		context: 'Proyecto de sitio web corporativo',
		description:
			'Sitio web corporativo para una agencia integral de branding, marketing, impresión y productos promocionales, desarrollado para presentar sus diferentes servicios y facilitar el contacto con potenciales clientes.',
		images: [
			'/project4/preview1.png',
			'/project4/preview2.png',
			'/project4/preview3.png',
			'/project4/preview4.png',
			'/project4/preview5.png'
		],
		technologies: [
			'React',
			'HTML',
			'CSS',
			'Responsive Design'
		],
		details: {
			description:
				'Sitio web desarrollado para una agencia de branding y marketing que reúne diferentes líneas de servicio, incluyendo construcción de marca, impresión, señalética, decoración de prendas y productos promocionales. El sitio fue estructurado para presentar los servicios de forma clara y dirigir al visitante hacia el contacto con la empresa.',
			context:
				'Proyecto desarrollado para fortalecer la presencia digital de la empresa y presentar su portafolio de servicios a clientes potenciales.',
			role:
				'Desarrollo frontend de la landing page, maquetación de las diferentes secciones, implementación del diseño responsive y construcción de los llamados a la acción.',
			highlights: [
				'Presentación de múltiples líneas de servicio',
				'Diseño responsive',
				'Secciones orientadas a conversión',
				'Presentación del portafolio de servicios',
				'Integración de llamadas a la acción'
			]
		},
		links: []
	},
	{
		title: 'Sitio web para negocio de belleza',
		category: 'Landing page',
		context: 'Proyecto freelance',
		description:
			'Landing page para un negocio de extensiones de pestañas, enfocada en presentar sus servicios, precios y facilitar las reservas.',
		images: [
			'/project5/preview1.png',
			'/project5/preview2.png',
			'/project5/preview3.png'
		],
		technologies: [
			'HTML',
			'CSS',
			'JavaScript',
			'Responsive Design'
		],
		details: {
			description:
				'Landing page para un negocio de extensiones de pestañas, con información sobre sus servicios, precios, políticas y datos de contacto.',
			context:
				'Página promocional desarrollada para uno de los clientes de la empresa que contrató el desarrollo de este sitio.',
			role:
				'Desarrollo frontend, maquetación responsive e implementación de las diferentes secciones informativas y llamadas a la acción.',
			highlights: [
				'Catálogo de servicios y precios',
				'Información de contacto',
				'Integración de reservas',
				'Diseño responsive'
			]
		},
		links: []
	},
	{
		title: 'Sitio web para centro ecuestre',
		category: 'Landing page',
		context: 'Proyecto freelance',
		description:
			'Landing page para un centro ecuestre en Florida, enfocada en presentar sus servicios y facilitar el contacto con potenciales clientes.',
		images: [
			'/project6/preview1.png',
			'/project6/preview2.png',
			'/project6/preview3.png'
		],
		technologies: [
			'HTML',
			'CSS',
			'JavaScript',
			'Responsive Design'
		],
		details: {
			description:
				'Landing page para un centro ecuestre, con información sobre sus servicios, instalaciones, actividades y opciones de contacto.',
			context:
				'Página promocional desarrollada para uno de los clientes de la empresa que contrató el desarrollo de este sitio.',
			role:
				'Desarrollo frontend, maquetación responsive e implementación de las diferentes secciones de la landing page.',
			highlights: [
				'Presentación de servicios',
				'Información del negocio',
				'Formulario de contacto',
				'Diseño responsive'
			]
		},
		links: []
	}
]

const Projects = () => {
	const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
	const [selectedGallery, setSelectedGallery] = useState<{
		project: ProjectItem
		imageIndex: number
	} | null>(null)

	const openProject = (project: ProjectItem) => {
		setSelectedGallery(null)
		setSelectedProject(project)
	}

	const closeProject = () => {
		setSelectedProject(null)
	}

	const openGallery = (project: ProjectItem, imageIndex: number) => {
		setSelectedProject(null)
		setSelectedGallery({ project, imageIndex })
	}

	const closeGallery = () => {
		setSelectedGallery(null)
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
								<ImageGallery
									images={project.images}
									alt={project.title}
									mode='preview'
									onOpen={(imageIndex) =>
										openGallery(project, imageIndex)
									}
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
									<ImageGallery
										images={website.images}
										alt={website.title}
										mode='preview'
										onOpen={(imageIndex) =>
											openGallery(website, imageIndex)
										}
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
										className={styles.viewProjectButton}
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
							<ImageGallery
								images={selectedProject.images}
								alt={selectedProject.title}
								mode='carousel'
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

			<Modal
				isOpen={Boolean(selectedGallery)}
				onClose={closeGallery}
				title={selectedGallery?.project.title}
				size='fullscreen'
			>
				{selectedGallery && (
					<ImageGallery
						images={selectedGallery.project.images}
						alt={selectedGallery.project.title}
						mode='fullscreen'
						initialIndex={selectedGallery.imageIndex}
					/>
				)}
			</Modal>
		</>
	)
}

export default Projects
