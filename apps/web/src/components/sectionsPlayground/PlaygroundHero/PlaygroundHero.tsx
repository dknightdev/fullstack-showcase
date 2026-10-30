
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import {
	TbBraces,
	TbDatabase,
	TbServerCog,
	TbTerminal2
} from 'react-icons/tb'

import styles from './PlaygroundHero.module.css'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Chip from '@/components/ui/Chip/Chip'
import { motionConfig } from '@/config/motion'
import ScrollIndicator from '@/components/ui/ScrollIndicator/ScrollIndicator'
import Button from '@/components/ui/Button/Button'

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
			duration: motionConfig.duration.normal,
			ease: motionConfig.ease
		}
	}
}

const visualVariants: Variants = {
	hidden: {
		opacity: motionConfig.opacity.hidden,
		x: motionConfig.distance.normal
	},
	visible: {
		opacity: motionConfig.opacity.visible,
		x: 0,
		transition: {
			duration: motionConfig.duration.normal,
			ease: motionConfig.ease
		}
	}
}

const PlaygroundHero = () => {
	const { t } = useTranslation()
	const shouldReduceMotion = useReducedMotion()
	const initialAnimation = shouldReduceMotion ? false : 'hidden'

	return (
		<section id='heroPlayground' className={styles.section}>
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
						[ {t('playground.hero.eyebrow')} ]
					</motion.p>

					<motion.h1 variants={itemVariants}>
						{t('playground.hero.title')}
						<span>{t('playground.hero.highlight')}</span>
					</motion.h1>

					<motion.p
						className={styles.description}
						variants={itemVariants}
					>
						{t('playground.hero.description')}
					</motion.p>

					<motion.div
						className={styles.technologies}
						variants={itemVariants}
						aria-label={t('playground.hero.technologiesLabel')}
					>
						<Chip icon={TbBraces}>.NET</Chip>
						<Chip icon={TbBraces}>NestJS</Chip>
						<Chip icon={TbBraces}>Laravel</Chip>
						<Chip icon={TbDatabase}>PostgreSQL</Chip>
					</motion.div>

					<motion.div
						className={styles.actions}
						variants={itemVariants}
					>
						<Button variant='primary' href='#playground2'>
							<AppIcon icon={TbTerminal2} size={18} />
							{t('playground.hero.explore')}
						</Button>

						<Button variant='secondary' href='#playground3'>
							<AppIcon icon={TbServerCog} size={18} />
							{t('playground.hero.architecture')}
						</Button>
					</motion.div>
				</motion.div>

				<motion.div
					className={styles.visual}
					variants={visualVariants}
					initial={initialAnimation}
					animate='visible'
				>
					<div className={styles.terminal}>
						<div className={styles.terminalHeader}>
							<div className={styles.windowControls} aria-hidden='true'>
								<span />
								<span />
								<span />
							</div>

							<span className={styles.terminalTitle}>
								<AppIcon icon={TbTerminal2} size={15} />
								{t('playground.hero.terminalTitle')}
							</span>
						</div>

						<div className={styles.request}>
							<span className={styles.method}>GET</span>
							<span>/api/products</span>
						</div>

						<div className={styles.responseHeader}>
							<span>{t('playground.hero.response')}</span>
							<span className={styles.statusCode}>
								<span />
								200 OK
							</span>
						</div>

						<pre className={styles.code}>
							<code>
								<span>{'{'}</span>
								{'\n'}
								{'	'}<span className={styles.codeKey}>"data"</span>
								<span>: [</span>
								{'\n'}
								{'		'}{'{ '}
								{'\n'}
								{'			'}<span className={styles.codeKey}>"id"</span>
								<span>: </span>
								<span className={styles.codeNumber}>1</span>
								<span>,</span>
								{'\n'}
								{'			'}<span className={styles.codeKey}>"name"</span>
								<span>: </span>
								<span className={styles.codeString}>"Producto demo"</span>
								{'\n'}
								{'		'}{'}'}
								{'\n'}
								{'	'}<span>]</span>
								{'\n'}
								<span>{'}'}</span>
							</code>
						</pre>

						<div className={styles.terminalFooter}>
							<span>
								<span className={styles.footerDot} />
								{t('playground.hero.apiStatus')}
							</span>

							<span>{t('playground.hero.httpPreview')}</span>
						</div>
					</div>
				</motion.div>
			</div>

			<ScrollIndicator text={t('playground.hero.scrollInstruction')} />
		</section>
	)
}

export default PlaygroundHero
