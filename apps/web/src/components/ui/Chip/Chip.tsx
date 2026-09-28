
import { type ReactNode } from 'react'
import type { IconType } from 'react-icons'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import styles from './Chip.module.css'

type ChipProps = {
	children: ReactNode
	icon?: IconType
}

const Chip = ({ children, icon }: ChipProps) => {
	return (
		<span className={styles.chip}>
			{icon && <AppIcon icon={icon} size={16} />}
			{children}
		</span>
	)
}

export default Chip
