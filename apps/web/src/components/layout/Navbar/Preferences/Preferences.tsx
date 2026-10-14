import { usePreferencesStore } from '@/stores/preferencesStore'
import { TbLanguage, TbMoon, TbSunHigh } from 'react-icons/tb'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'

import styles from './Preferences.module.css'

const Preferences = () => {
	const theme = usePreferencesStore((state) => state.theme)
	const accent = usePreferencesStore((state) => state.accent)

	const setTheme = usePreferencesStore((state) => state.setTheme)
	const setAccent = usePreferencesStore((state) => state.setAccent)

	return (
		<div className={styles.container}>
			<div className={styles.row}>
				<span className={styles.label}>Tema</span>
				<Button
					variant='icon'
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
					aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
				>
					{theme === 'dark' ? <AppIcon icon={TbSunHigh} size={18} /> : <AppIcon icon={TbMoon} size={18} />}
				</Button>
			</div>

			<div className={styles.row}>
				<span className={styles.label}>Color</span>
				<div className={styles.accents}>
					<button
						type='button'
						className={`${styles.accent} ${styles.blue} ${accent === 'blue' ? styles.active : ''}`}
						onClick={() => setAccent('blue')}
						aria-label='Acento azul'
					/>

					<button
						type='button'
						className={`${styles.accent} ${styles.green} ${accent === 'green' ? styles.active : ''}`}
						onClick={() => setAccent('green')}
						aria-label='Acento verde'
					/>

					<button
						type='button'
						className={`${styles.accent} ${styles.purple} ${accent === 'purple' ? styles.active : ''}`}
						onClick={() => setAccent('purple')}
						aria-label='Acento morado'
					/>
				</div>
			</div>

			<div className={styles.row}>
				<span className={styles.label}>Idioma</span>
				<Button
					variant='icon'
					aria-label='Cambiar idioma'
				>
					<AppIcon icon={TbLanguage} size={18} />
				</Button>
			</div>
		</div>
	)
}

export default Preferences
