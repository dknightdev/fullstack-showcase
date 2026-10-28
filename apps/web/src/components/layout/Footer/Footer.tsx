import { useTranslation } from 'react-i18next'
import styles from './Footer.module.css'
import { TbArrowUp } from 'react-icons/tb'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'

const Footer = () => {
	const { t } = useTranslation()

	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.identity}>
						<h2>
							DUBAN
							<span>CABALLERO</span>
						</h2>

						<p className={styles.role}>
							{t('footer.role')}
						</p>

						<p className={styles.description}>
							{t('footer.description')}
						</p>
					</div>

					<nav className={styles.navigation}>
						<Button variant='tertiary' href='https://www.linkedin.com/in/dubancaballero' target='_blank' rel='noreferrer'>
							LinkedIn
						</Button>

						<Button variant='tertiary' href='https://github.com/dknightdev' target='_blank' rel='noreferrer'>
							GitHub
						</Button>

						<Button variant='tertiary' href='mailto:duedi707@gmail.com'>
							{t('footer.email')}
						</Button>

						<Button variant='tertiary' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
							{t('footer.backToTop')}
							<AppIcon icon={TbArrowUp} size={18} />
						</Button>
					</nav>
				</div>

				<div className={styles.bottom}>
					<span>
						© {new Date().getFullYear()} Duban Caballero
					</span>

					<span>
					</span>
				</div>
			</div>
		</footer>
	)
}

export default Footer
