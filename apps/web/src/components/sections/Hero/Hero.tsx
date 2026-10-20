import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import {
	TbChevronDown,
	TbCode,
	TbDeviceMobile,
	TbFolderOpen,
	TbMail,
	TbServer
} from 'react-icons/tb'

import styles from './Hero.module.css'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'
import Chip from '@/components/ui/Chip/Chip'

import { motionConfig } from '@/config/motion'

import perfilSilueta from '@/assets/img/perfil_silueta2.png'

const contentVariants: Variants = {
	hidden: {
		opacity: motionConfig.opacity.hidden
	},
	visible: {
		opacity: motionConfig.opacity.visible,
		transition: {
			delayChildren: motionConfig.duration.fast,
			staggerChildren: motionConfig.duration.fast * 0.6
		}
	}
}

const itemVariants: Variants = {
	hidden: {
		opacity: motionConfig.opacity.hidden,
		y: motionConfig.distance.normal
	},
	visible: {
		opacity: motionConfig.opacity.visible,
		y: 0,
		transition: {
			duration: motionConfig.duration.reveal,
			ease: motionConfig.ease
		}
	}
}

const imageVariants: Variants = {
	hidden: {
		opacity: motionConfig.opacity.hidden,
		x: motionConfig.distance.normal
	},
	visible: {
		opacity: motionConfig.opacity.visible,
		x: 0,
		transition: {
			duration: motionConfig.duration.slow,
			ease: motionConfig.ease
		}
	}
}

const Hero = () => {
	const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(true)
	const { t } = useTranslation()
	const shouldReduceMotion = useReducedMotion()

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

	const initialAnimation = shouldReduceMotion ? false : 'hidden'

	return (
		<section id='hero' className={styles.section}>
			<div className={styles.content}>
				<motion.div
					className={styles.info}
					variants={contentVariants}
					initial={initialAnimation}
					animate='visible'
				>
					<motion.p
						className={styles.eyebrow}
						variants={itemVariants}
					>
						{t('hero.role')}
					</motion.p>

					<motion.h1 variants={itemVariants}>
						Duban
						<span>Caballero</span>
					</motion.h1>

					<motion.p
						className={styles.description}
						variants={itemVariants}
					>
						{t('hero.description')}
					</motion.p>

					<motion.div
						className={styles.skillsSnippet}
						variants={itemVariants}
					>
						<Chip icon={TbCode}>
							React
						</Chip>

						<Chip icon={TbDeviceMobile}>
							React Native
						</Chip>

						<Chip icon={TbServer}>
							Node.js
						</Chip>
					</motion.div>

					<motion.div
						className={styles.actions}
						variants={itemVariants}
					>
						<Button variant='primary' href='#projects'>
							<AppIcon icon={TbFolderOpen} size={18} />
							{t('hero.viewProjects')}
						</Button>

						<Button variant='secondary' href='#contact'>
							<AppIcon icon={TbMail} size={18} />
							{t('hero.contactMe')}
						</Button>
					</motion.div>
				</motion.div>

				<motion.div
					className={styles.imageWrapper}
					variants={imageVariants}
					initial={initialAnimation}
					animate='visible'
				>
					<img
						src={perfilSilueta}
						alt={t('hero.profileAlt')}
					/>
				</motion.div>
			</div>

			<div
				className={`${styles.scrollIndicator} ${!isScrollIndicatorVisible ? styles.hidden : ''}`}
			>
				<span className={styles.scrollText}>
					{t('hero.scrollInstruction')}
				</span>

				<span className={styles.scrollIcon} aria-hidden='true'>
					<AppIcon icon={TbChevronDown} size={18} />
				</span>
			</div>
		</section>
	)
}

export default Hero
