import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TbHome2, TbTerminal2 } from 'react-icons/tb'

import { AnimatedIcon } from '@/components/ui/AppIcon/AppIcon'

import styles from './FloatingPlaygroundButton.module.css'

interface FloatingPlaygroundButtonProps {
	isHome: boolean
}

const FloatingPlaygroundButton = ({ isHome }: FloatingPlaygroundButtonProps) => {
	const { t } = useTranslation()
	const label = t(isHome ? 'playground.open' : 'playground.backHome')

	return (
		<Link
			to={isHome ? '/playground' : '/'}
			className={styles.button}
			aria-label={label}
			title={label}
		>
			<AnimatedIcon
				icon={TbTerminal2}
				toggleIcon={TbHome2}
				toggle={!isHome}
				size={24}
			/>
		</Link>
	)
}

export default FloatingPlaygroundButton
