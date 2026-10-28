import type { ReactNode } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import { motionConfig } from '@/config/motion'

type PageTransitionProps = {
	children: ReactNode
}

const PageTransition = ({ children }: PageTransitionProps) => {
	const shouldReduceMotion = useReducedMotion()
	const offset = shouldReduceMotion ? 0 : motionConfig.distance.normal

	return (
		<motion.div
			initial={{ opacity: motionConfig.opacity.hidden, y: offset }}
			animate={{
				opacity: motionConfig.opacity.visible,
				y: 0,
				transition: { duration: motionConfig.duration.slow, ease: motionConfig.ease }
			}}
			exit={{
				opacity: motionConfig.opacity.hidden,
				y: -offset,
				transition: { duration: motionConfig.duration.normal, ease: motionConfig.ease }
			}}
		>
			{children}
		</motion.div>
	)
}

export default PageTransition
