import { type ComponentPropsWithoutRef } from 'react'
import styles from './Section.module.css'

type SectionProps = ComponentPropsWithoutRef<'section'>

const Section = ({ children, className, ...props }: SectionProps) => {
	return (
		<section
			{...props}
			className={`${styles.section} ${className ?? ''}`}
		>
			<div className={styles.container}>
				{children}
			</div>
		</section>
	)
}

export default Section
