import type { HttpMethod } from '../../sectionsPlayground/ApiExplorer/types'
import styles from './MethodBadge.module.css'

type MethodBadgeProps = {
	method: HttpMethod
}

const MethodBadge = ({ method }: MethodBadgeProps) => {
	return (
		<span className={`${styles.badge} ${styles[method.toLowerCase()]}`}>
			{method}
		</span>
	)
}

export default MethodBadge
