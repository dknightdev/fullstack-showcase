import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon'

type ButtonBaseProps = {
	variant: ButtonVariant
	children: ReactNode
	className?: string
}

type ButtonProps =
	| (ButtonBaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href'> & { href: string })
	| (ButtonBaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & { href?: never })

const Button = (props: ButtonProps) => {
	if ('href' in props && typeof props.href === 'string') {
		const { variant, children, className, href, ...anchorProps } = props
		const buttonClassName = `${className ?? ''} ${styles.button} ${styles[variant]}`

		return (
			<a
				{...anchorProps}
				href={href}
				className={buttonClassName}
			>
				{children}
			</a>
		)
	}

	const { variant, children, className, ...buttonProps } = props
	const buttonClassName = `${className ?? ''} ${styles.button} ${styles[variant]}`

	return (
		<button
			{...buttonProps}
			type={buttonProps.type ?? 'button'}
			className={buttonClassName}
		>
			{children}
		</button>
	)
}

export default Button
