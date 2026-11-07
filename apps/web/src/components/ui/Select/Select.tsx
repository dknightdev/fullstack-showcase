import type { ComponentProps } from 'react'

import styles from '../FormControl/FormControl.module.css'

const Select = ({ className, ...props }: ComponentProps<'select'>) => (
	<select data-lenis-prevent {...props} className={`${styles.control} ${styles.select} ${className ?? ''}`} />
)

export default Select
