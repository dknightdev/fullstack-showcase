import { useEffect, useState, type ReactNode } from 'react'

import { motion, useReducedMotion, type Variants } from 'motion/react'

import { motionConfig } from '@/config/motion'
import { MOBILE_QUERY } from '@/config/breakpoints'

type RevealProps = {
	children: ReactNode
	delay?: number
	direction?: 'up' | 'left' | 'right'
	className?: string
}

const offsetMap = {
	left: { x: -motionConfig.distance.normal, y: 0 },
	right: { x: motionConfig.distance.normal, y: 0 },
	up: { x: 0, y: motionConfig.distance.normal }
}

const Reveal = ({
	children,
	delay = 0,
	direction = 'up',
	className
}: RevealProps) => {
	const shouldReduceMotion = useReducedMotion()
	const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)

	useEffect(() => {
		const mediaQuery = window.matchMedia(MOBILE_QUERY)
		const handleChange = (event: MediaQueryListEvent) => {setIsMobile(event.matches)}

		mediaQuery.addEventListener('change', handleChange)

		return () => {
			mediaQuery.removeEventListener('change', handleChange)
		}
	}, [])

	const offset = offsetMap[direction]

	if (isMobile || shouldReduceMotion) {
		return <div className={className}>{children}</div>
	}

	const variants: Variants = {
		hidden: {
			opacity: 0,
			...offset
		},
		visible: {
			opacity: 1,
			x: 0,
			y: 0,
			transition: {
				duration: motionConfig.duration.reveal,
				delay,
				ease: motionConfig.ease
			}
		}
	}

	return (
		<motion.div
			className={className}
			variants={variants}
			initial='hidden'
			whileInView='visible'
			viewport={{
				once: true,
				amount: 0.25
			}}
		>
			{children}
		</motion.div>
	)
}

export default Reveal
