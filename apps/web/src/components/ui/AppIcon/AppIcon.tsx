import type { IconType } from 'react-icons'

type AppIconProps = {
	icon: IconType
	size?: number
	className?: string
	label?: string
}

const AppIcon = ({ icon: Icon, size = 18, className = '', label }: AppIconProps) => {
	const iconClassName = ['uiIcon', className].filter(Boolean).join(' ')

	if (label) {
		return (
			<Icon
				className={iconClassName}
				size={size}
				role='img'
				aria-label={label}
				focusable='false'
			/>
		)
	}

	return (
		<Icon
			className={iconClassName}
			size={size}
			aria-hidden='true'
			focusable='false'
		/>
	)
}

export default AppIcon
