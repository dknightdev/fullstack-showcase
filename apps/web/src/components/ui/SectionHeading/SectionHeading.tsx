import styles from './SectionHeading.module.css'

type SectionHeadingProps = {
	eyebrow: string
	title: string
	highlight: string
	description?: string
}

const SectionHeading = ({ eyebrow, title, highlight, description }: SectionHeadingProps) => {
	return (
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
		</div>
	)
}

export default SectionHeading
