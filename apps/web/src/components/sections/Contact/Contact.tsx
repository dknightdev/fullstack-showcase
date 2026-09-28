import styles from './Contact.module.css'
import { TbCopy, TbDownload, TbExternalLink } from 'react-icons/tb'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Button from '@/components/ui/Button/Button'

const contactItems = [
	{
		title: 'LinkedIn',
		description: 'Conecta conmigo profesionalmente',
		href: 'https://www.linkedin.com/in/dubancaballero'
	},
	{
		title: 'GitHub',
		description: 'Explora mis proyectos y código',
		href: 'https://github.com/dknightdev'
	},
	{
		title: 'Correo',
		description: 'duedi707@gmail.com',
		href: 'mailto:duedi707@gmail.com',
		copyValue: 'duedi707@gmail.com'
	},
	{
		title: 'WhatsApp',
		description: '+57 322 572 9427',
		href: 'https://wa.me/573225729427',
		copyValue: '+57 322 572 9427'
	}
]

const Contact = () => {
	const handleCopy = async (value: string) => {
		await navigator.clipboard.writeText(value)
	}

	return (
		<Section id='contact'>
			<SectionHeading
				eyebrow='Contacto'
				title='¿Hablamos?'
				highlight='Estoy disponible.'
				description='Si quieres hablar sobre un proyecto, una oportunidad profesional o simplemente conectar, puedes encontrarme en cualquiera de los siguientes medios.'
			/>

				<div className={styles.contacts}>
					{contactItems.map((item) => (
						<article
							key={item.title}
							className={styles.card}
						>
							<div className={styles.cardContent}>
								<h3>{item.title}</h3>

								<p>{item.description}</p>
							</div>

							<div className={styles.actions}>
								<Button
									variant='icon'
									href={item.href}
									target={item.href.startsWith('mailto:') ? undefined : '_blank'}
									rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
									aria-label={`Abrir ${item.title}`}
									title={`Abrir ${item.title}`}
								>
									<AppIcon icon={TbExternalLink} size={18} />
								</Button>

								{item.copyValue && (
									<Button
										variant='icon'
										onClick={() => handleCopy(item.copyValue)}
										aria-label={`Copiar ${item.title}`}
										title='Copiar al portapapeles'
									>
										<AppIcon icon={TbCopy} size={18} />
									</Button>
								)}
							</div>
						</article>
					))}
				</div>

				<div className={styles.cv}>
					<div>
						<p className={styles.cvLabel}>
							¿Quieres conocer más sobre mi experiencia?
						</p>

						<h3>
							Descarga mi CV
						</h3>
					</div>

					<Button
						variant='primary'
						href='/CV-Duban_Caballero.pdf'
						download='CV-Duban_Caballero.pdf'
						className={styles.cvButton}
					>
						Descargar CV
						<AppIcon icon={TbDownload} size={18} />
					</Button>
				</div>
		</Section>
	)
}

export default Contact
