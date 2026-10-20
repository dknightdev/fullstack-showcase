import type { ReactNode } from 'react'
import styles from './SectionHeading.module.css'
import Reveal from '../Reveal/Reveal'

type SectionHeadingProps = {
	eyebrow: string
	title: string
	highlight: string
	description?: string
	action?: ReactNode
}

const SectionHeading = ({
	eyebrow,
	title,
	highlight,
	description,
	action
}: SectionHeadingProps) => {
	return (
		<Reveal direction='left'>
			<div className={styles.heading}>
				<p className={styles.eyebrow}>
					{eyebrow}
				</p>

				<h2>
					{title}
					<span>{highlight}</span>
				</h2>

				{description && (
					<p className={styles.description}>
						{description}
					</p>
				)}

				{action && (
					<div className={styles.action}>
						{action}
					</div>
				)}
			</div>
		</Reveal>
	)
}

export default SectionHeading
