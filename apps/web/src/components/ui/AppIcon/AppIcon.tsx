import styles from './AppIcon.module.css'
import type { IconType } from 'react-icons'
import { motion, useReducedMotion } from 'motion/react'

import { motionConfig } from '@/config/motion'

type AppIconProps = {
	icon: IconType
	size?: number
	className?: string
}

type AnimatedIconProps = {
    icon: IconType
    toggleIcon: IconType
    toggle: boolean
    size?: number
    className?: string
}


const AppIcon = ({ icon: Icon, size = 18, className = '' }: AppIconProps) => {
	const iconClassName = [styles.uiIcon, className].filter(Boolean).join(' ')

	return (
		<Icon
			className={iconClassName}
			size={size}
			aria-hidden='true'
			focusable='false'
		/>
	)
}

export const AnimatedIcon = ({
    icon: Icon,
    toggleIcon: ToggleIcon,
    toggle,
    size = 18,
    className = ''
}: AnimatedIconProps) => {
    const shouldReduceMotion = useReducedMotion()
    const duration = shouldReduceMotion ? 0 : motionConfig.duration.fast
    const iconClassName = [styles.uiIcon, className].filter(Boolean).join(' ')

    return (
        <motion.span
            className={styles.container}
			style={{
                width: size,
                height: size
            }}
        >
            <motion.span
                className={styles.containerUiIcon}
                animate={{
                    opacity: toggle ? 0 : 1,
                    rotate: shouldReduceMotion ? 0 : toggle ? -45 : 0,
                    scale: shouldReduceMotion ? 1 : toggle ? 0.7 : 1
                }}
                transition={{ duration, ease: motionConfig.ease }}
                aria-hidden='true'
            >
                <Icon
                    className={iconClassName}
                    size={size}
                    aria-hidden='true'
                    focusable='false'
                />
            </motion.span>

            <motion.span
                className={styles.containerUiIcon}
                animate={{
                    opacity: toggle ? 1 : 0,
                    rotate: shouldReduceMotion ? 0 : toggle ? 0 : 45,
                    scale: shouldReduceMotion ? 1 : toggle ? 1 : 0.7
                }}
                transition={{ duration, ease: motionConfig.ease }}
                aria-hidden='true'
            >
                <ToggleIcon
                    className={iconClassName}
                    size={size}
                    aria-hidden='true'
                    focusable='false'
                />
            </motion.span>
        </motion.span>
    )
}

export default AppIcon
