import styles from './Footer.module.css'
import { TbArrowUp } from 'react-icons/tb'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.identity}>
						<h2>
							EDINSON DUBAN
							<span>CABALLERO RINCÓN</span>
						</h2>

						<p className={styles.role}>
							Full Stack Developer
						</p>

						<p className={styles.description}>
							Construyendo soluciones web y móviles que
							convierten ideas en productos reales.
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
							Email
						</Button>

						<Button variant='tertiary' href='#hero'>
							Volver arriba
							<AppIcon icon={TbArrowUp} size={16} />
						</Button>
					</nav>
				</div>

				<div className={styles.bottom}>
					<span>
						© {new Date().getFullYear()} Edinson Duban Caballero Rincón
					</span>

					<span>
					</span>
				</div>
			</div>
		</footer>
	)
}

export default Footer
