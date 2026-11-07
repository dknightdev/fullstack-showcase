import type { ComponentProps } from 'react'

import styles from '../FormControl/FormControl.module.css'

const Textarea = ({ className, ...props }: ComponentProps<'textarea'>) => (
	<textarea {...props} className={`${styles.control} ${styles.textarea} ${className ?? ''}`} />
)

export default Textarea
