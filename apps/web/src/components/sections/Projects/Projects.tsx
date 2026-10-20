import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbArrowUpRight, TbInfoCircle } from 'react-icons/tb'
import Modal from '@/components/ui/Modal/Modal'
import Button from '@/components/ui/Button/Button'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Chip from '@/components/ui/Chip/Chip'
import ImageGallery from '@/components/ui/ImageGallery/ImageGallery'
import styles from './Projects.module.css'
import Reveal from '@/components/ui/Reveal/Reveal'

type ProjectLink = {
	labelKey: 'googlePlay' | 'viewDemo'
	href: string
}

type ProjectItem = {
	key: string
	images: string[]
	technologies: string[]
	highlights: string[]
	links?: ProjectLink[]
}

const projects: ProjectItem[] = [
	{
		key: 'storeOrders',
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
		highlights: [
			'productCatalog',
			'orderManagement',
			'deliveryScheduling',
			'cashOnDelivery',
			'mobileAndWebApp'
		],
		links: [
			{
				labelKey: 'googlePlay',
				href: 'https://play.google.com/store/apps/details?id=com.amovil.latienda'
			}
		]
	},
	{
		key: 'businessSupport',
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
		highlights: [
			'companyAndExpertManagement',
			'mentoringPrograms',
			'sessionTracking',
			'assignedHours',
			'dashboardsAndMetrics',
			'pdfReports',
			'emailNotifications',
			'calendarFiles',
			'userAndAccessManagement'
		],
		links: [
			{
				labelKey: 'viewDemo',
				href: '#'
			}
		]
	},
	{
		key: 'rayShark',
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
		highlights: [
			'registeredSpecies',
			'fullyOffline',
			'localRealmDatabase',
			'speciesInformation',
			'androidApp',
			'academicCompetition'
		],
		links: [
			{
				labelKey: 'googlePlay',
				href: 'https://play.google.com/store/apps/details?id=com.dknightdev.ray_shark'
			}
		]
	}
]

const websites: ProjectItem[] = [
	{
		key: 'brandingAgency',
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
		highlights: [
			'multipleServiceLines',
			'responsiveDesign',
			'conversionFocusedSections',
			'servicePortfolio',
			'callToActionIntegration'
		],
		links: []
	},
	{
		key: 'beautyBusiness',
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
		highlights: [
			'serviceAndPriceCatalog',
			'contactInformation',
			'bookingIntegration',
			'responsiveDesign'
		],
		links: []
	},
	{
		key: 'equestrianCenter',
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
		highlights: [
			'servicePresentation',
			'businessInformation',
			'contactForm',
			'responsiveDesign'
		],
		links: []
	}
]

const projectTranslationKey = (project: ProjectItem, field: string) =>
	`projects.items.${project.key}.${field}`

const Projects = () => {
	const { t } = useTranslation()
	const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
	const [selectedGallery, setSelectedGallery] = useState<{
		project: ProjectItem
		imageIndex: number
	} | null>(null)
	const [isPrivacyInfoOpen, setIsPrivacyInfoOpen] = useState(false)

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

	const closePrivacyInfo = () => {
		setIsPrivacyInfoOpen(false)
	}

	return (
		<>
			<Section id='projects'>
				<SectionHeading
					eyebrow={t('projects.eyebrow')}
					title={t('projects.title')}
					highlight={t('projects.highlight')}
					description={t('projects.description')}
					action={
						<Button
							variant='tertiary'
							onClick={() => setIsPrivacyInfoOpen(true)}
							aria-label={t('projects.openPrivacyInfo')}
						>
							{t('projects.privacyInfoButton')}
							<AppIcon icon={TbInfoCircle} size={16} />
						</Button>
					}
				/>

				<div className={styles.featured}>
					{projects.map((project, index) => (
						<Reveal direction={index % 2 === 0 ? 'right' : 'left'} key={project.key}>
							<article className={styles.project}>
								<div className={styles.imageWrapper}>
									<ImageGallery
										images={project.images}
										alt={t(projectTranslationKey(project, 'title'))}
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
										{t(projectTranslationKey(project, 'category'))}
									</p>

									<h3>
										{t(projectTranslationKey(project, 'title'))}
									</h3>

									<p className={styles.context}>
										{t(projectTranslationKey(project, 'context'))}
									</p>

									<p className={styles.description}>
										{t(projectTranslationKey(project, 'description'))}
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
										{t('projects.viewProject')}
										<AppIcon icon={TbArrowUpRight} size={18} />
									</Button>
								</div>
							</article>
						</Reveal>
					))}
				</div>

				<Reveal direction='left'>
					<div className={styles.otherProjects}>
						<div className={styles.subheading}>
							<div>
								<p className={styles.category}>
									{t('projects.otherProjects.eyebrow')}
								</p>

								<h3>
									{t('projects.otherProjects.title')}
								</h3>
							</div>

							<p>
								{t('projects.otherProjects.description')}
							</p>
						</div>

						<div className={styles.websiteGrid}>
							{websites.map((website) => (
								<article
									key={website.key}
									className={styles.website}
								>
									<div className={styles.websiteImage}>
										<ImageGallery
											images={website.images}
											alt={t(projectTranslationKey(website, 'title'))}
											mode='preview'
											onOpen={(imageIndex) =>
												openGallery(website, imageIndex)
											}
										/>
									</div>

									<div className={styles.websiteContent}>
										<p className={styles.context}>
											{t(projectTranslationKey(website, 'context'))}
										</p>

										<h4>
											{t(projectTranslationKey(website, 'title'))}
										</h4>

										<p>
											{t(projectTranslationKey(website, 'description'))}
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
											{t('projects.viewProject')}
											<AppIcon icon={TbArrowUpRight} size={18} />
										</Button>
									</div>
								</article>
							))}
						</div>
					</div>
				</Reveal>
			</Section>

			<Modal
				isOpen={Boolean(selectedProject)}
				onClose={closeProject}
				title={selectedProject
					? t(projectTranslationKey(selectedProject, 'title'))
					: undefined}
			>
				{selectedProject && (
					<div className={styles.modalContent}>
						<div className={styles.modalImage}>
							<ImageGallery
								images={selectedProject.images}
								alt={t(projectTranslationKey(selectedProject, 'title'))}
								mode='carousel'
							/>
						</div>

						<div className={styles.modalSection}>
							<p className={styles.category}>
								{t(projectTranslationKey(selectedProject, 'category'))}
							</p>

							<h3>
								{t(projectTranslationKey(selectedProject, 'context'))}
							</h3>
						</div>

						<div className={styles.modalSection}>
							<h4>
								{t('projects.modal.description')}
							</h4>

							<p>
								{t(projectTranslationKey(selectedProject, 'details.description'))}
							</p>
						</div>

						<div className={styles.modalSection}>
							<h4>
								{t('projects.modal.context')}
							</h4>

							<p>
								{t(projectTranslationKey(selectedProject, 'details.context'))}
							</p>
						</div>

						<div className={styles.modalSection}>
							<h4>
								{t('projects.modal.role')}
							</h4>

							<p>
								{t(projectTranslationKey(selectedProject, 'details.role'))}
							</p>
						</div>

						{selectedProject.highlights.length > 0 && (
							<div className={styles.modalSection}>
								<h4>
									{t('projects.modal.highlights')}
								</h4>

								<ul className={styles.highlights}>
									{selectedProject.highlights.map(
										(highlight) => (
											<li key={highlight}>
												{t(projectTranslationKey(selectedProject, `highlights.${highlight}`))}
											</li>
										)
									)}
								</ul>
							</div>
						)}

						<div className={styles.modalSection}>
							<h4>
								{t('projects.modal.technologies')}
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
										key={link.labelKey}
										variant='secondary'
										href={link.href}
										target='_blank'
										rel='noreferrer'
									>
										{t(`projects.links.${link.labelKey}`)}
										<AppIcon icon={TbArrowUpRight} size={18} />
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
				title={selectedGallery
					? t(projectTranslationKey(selectedGallery.project, 'title'))
					: undefined}
				size='fullscreen'
			>
				{selectedGallery && (
					<ImageGallery
						images={selectedGallery.project.images}
						alt={t(projectTranslationKey(selectedGallery.project, 'title'))}
						mode='fullscreen'
						initialIndex={selectedGallery.imageIndex}
					/>
				)}
			</Modal>

			<Modal
				isOpen={isPrivacyInfoOpen}
				onClose={closePrivacyInfo}
				title={t('projects.privacyInfo.title')}
			>
				<div className={styles.modalContent}>
					<div className={styles.modalSection}>
						<p>{t('projects.privacyInfo.first')}</p>

						<p>{t('projects.privacyInfo.second')}</p>

						<p>{t('projects.privacyInfo.third')}</p>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default Projects
