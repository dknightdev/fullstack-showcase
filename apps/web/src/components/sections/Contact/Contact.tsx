import { useTranslation } from 'react-i18next'
import styles from './Contact.module.css'
import { TbCopy, TbDownload, TbExternalLink } from 'react-icons/tb'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import Button from '@/components/ui/Button/Button'
import Reveal from '@/components/ui/Reveal/Reveal'

const contactItems = [
	{
		key: 'linkedin',
		href: 'https://www.linkedin.com/in/dubancaballero'
	},
	{
		key: 'github',
		href: 'https://github.com/dknightdev'
	},
	{
		key: 'email',
		value: 'duedi707@gmail.com',
		href: 'mailto:duedi707@gmail.com',
		copyValue: 'duedi707@gmail.com'
	},
	{
		key: 'whatsapp',
		value: '+57 322 572 9427',
		href: 'https://wa.me/573225729427',
		copyValue: '+57 322 572 9427'
	}
]

const Contact = () => {
	const { t } = useTranslation()

	const handleCopy = async (value: string) => {
		await navigator.clipboard.writeText(value)
	}

	return (
		<Section id='contact'>
			<SectionHeading
				eyebrow={t('contact.eyebrow')}
				title={t('contact.title')}
				highlight={t('contact.highlight')}
				description={t('contact.description')}
			/>

			<Reveal direction='right'>
				<div className={styles.contacts}>
					{contactItems.map((item) => (
						<article
							key={item.key}
							className={styles.card}
						>
							<div className={styles.cardContent}>
								<h3>{t(`contact.items.${item.key}.title`)}</h3>

								<p>{item.value ?? t(`contact.items.${item.key}.description`)}</p>
							</div>

							<div className={styles.actions}>
								<Button
									variant='icon'
									href={item.href}
									target={item.href.startsWith('mailto:') ? undefined : '_blank'}
									rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
									aria-label={t('contact.openItem', {
										item: t(`contact.items.${item.key}.title`)
									})}
									title={t('contact.openItem', {
										item: t(`contact.items.${item.key}.title`)
									})}
								>
									<AppIcon icon={TbExternalLink} size={18} />
								</Button>

								{item.copyValue && (
									<Button
										variant='icon'
										onClick={() => handleCopy(item.copyValue)}
										aria-label={t('contact.copyItem', {
											item: t(`contact.items.${item.key}.title`)
										})}
										title={t('contact.copyToClipboard')}
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
							{t('contact.cv.eyebrow')}
						</p>

						<h3>
							{t('contact.cv.title')}
						</h3>
					</div>

					<Button
						variant='primary'
						href='/CV-Duban_Caballero.pdf'
						download='CV-Duban_Caballero.pdf'
						className={styles.cvButton}
					>
						{t('contact.cv.download')}
						<AppIcon icon={TbDownload} size={18} />
					</Button>
				</div>
			</Reveal>
		</Section>
	)
}

export default Contact
