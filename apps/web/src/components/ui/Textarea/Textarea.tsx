import type { ComponentProps } from 'react'

import styles from '../FormControl/FormControl.module.css'

const Textarea = ({ className, ...props }: ComponentProps<'textarea'>) => (
	<textarea {...props} className={`${styles.control} ${styles.textarea} custom-scroll ${className ?? ''}`} />
)

export default Textarea
