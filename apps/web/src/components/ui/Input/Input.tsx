import type { ComponentProps } from 'react'

import styles from '../FormControl/FormControl.module.css'

const Input = ({ className, ...props }: ComponentProps<'input'>) => (
	<input {...props} className={`${styles.control} ${className ?? ''}`} />
)

export default Input
