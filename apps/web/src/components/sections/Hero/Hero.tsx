import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbChevronDown, TbCode, TbDeviceMobile, TbFolderOpen, TbMail, TbServer } from 'react-icons/tb'

import styles from './Hero.module.css'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'
import Chip from '@/components/ui/Chip/Chip'

import perfilSilueta from '../../../assets/img/perfil_silueta2.png'

const Hero = () => {
	const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(true)
	const { t } = useTranslation()

	useEffect(() => {
		const handleScroll = () => {
			const hideThreshold = window.innerHeight * 0.2
			setIsScrollIndicatorVisible(window.scrollY < hideThreshold)
		}

		handleScroll()
		window.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<section id='hero' className={styles.section}>
			<div className={styles.content}>
				<div className={styles.info}>
					<p className={styles.eyebrow}>
						{t('hero.role')}
					</p>

					<h1>
						Duban
						<span>Caballero</span>
					</h1>

					<p className={styles.description}>
						{t('hero.description')}
					</p>

					<div className={styles.skillsSnippet}>
						<Chip icon={TbCode}>
							React
						</Chip>
						<Chip icon={TbDeviceMobile}>
							React Native
						</Chip>
						<Chip icon={TbServer}>
							Node.js
						</Chip>
					</div>

					<div className={styles.actions}>
						<Button variant='primary' href='#projects'>
							<AppIcon icon={TbFolderOpen} size={18} />
							{t('hero.viewProjects')}
						</Button>

						<Button variant='secondary' href='#contact'>
							<AppIcon icon={TbMail} size={18} />
							{t('hero.contactMe')}
						</Button>
					</div>
				</div>

				<div className={styles.imageWrapper}>
					<img
						src={perfilSilueta}
						alt={t('hero.profileAlt')}
					/>
				</div>
			</div>

			<div className={`${styles.scrollIndicator} ${!isScrollIndicatorVisible ? styles.hidden : ''}`}>
				<span className={styles.scrollText}>{t('hero.scrollInstruction')}</span>
				<span className={styles.scrollIcon} aria-hidden='true'>
					<AppIcon icon={TbChevronDown} size={18} />
				</span>
			</div>
		</section>
	)
}

export default Hero
