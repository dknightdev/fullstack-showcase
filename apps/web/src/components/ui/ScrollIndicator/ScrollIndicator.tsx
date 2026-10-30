import { useEffect, useState } from 'react'

import styles from './ScrollIndicator.module.css'
import { TbChevronDown } from 'react-icons/tb'
import AppIcon from '../AppIcon/AppIcon'

const ScrollIndicator = ({ text }: { text: string }) => {
	const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(true)

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
		<div
			className={`${styles.scrollIndicator} ${!isScrollIndicatorVisible ? styles.hidden : ''}`}
		>
			<span className={styles.scrollText}>
				{text}
			</span>

			<span className={styles.scrollIcon} aria-hidden='true'>
				<AppIcon icon={TbChevronDown} size={18} />
			</span>
		</div>
	)
}

export default ScrollIndicator
