
import { type ReactNode } from 'react'
import type { IconType } from 'react-icons'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import styles from './Chip.module.css'

type ChipProps = {
	children: ReactNode
	icon?: IconType
	size?: 'normal' | 'small'
}

const Chip = ({ children, icon, size = 'normal' }: ChipProps) => {
	return (
		<span className={`${styles.chip} ${styles[size]}`}>
			{icon && <AppIcon icon={icon} size={18} />}
			{children}
		</span>
	)
}

export default Chip
