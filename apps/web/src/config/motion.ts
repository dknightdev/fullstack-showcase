
import type { Transition } from 'motion/react'

export const motionConfig = {
	ease: [0.22, 1, 0.36, 1],
	duration: {
		fast: 0.2,
		normal: 0.3,
		slow: 0.5,
		reveal: 0.7
	},
	distance: {
		normal: 20
	},
	scale: {
		modal: 0.97
	},
	opacity: {
		hidden: 0,
		visible: 1
	}
} satisfies {
	ease: Transition['ease']
	duration: Record<string, number>
	distance: Record<string, number>
	scale: Record<string, number>
	opacity: Record<string, number>
}
