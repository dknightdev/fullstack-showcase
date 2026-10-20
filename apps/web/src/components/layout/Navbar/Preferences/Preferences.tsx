import { usePreferencesStore } from '@/stores/preferencesStore'
import { useTranslation } from 'react-i18next'
import { TbMoon, TbSunHigh } from 'react-icons/tb'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'

import styles from './Preferences.module.css'

const Preferences = () => {
	const { t } = useTranslation()
	const theme = usePreferencesStore((state) => state.theme)
	const accent = usePreferencesStore((state) => state.accent)
	const language = usePreferencesStore((state) => state.language)

	const setTheme = usePreferencesStore((state) => state.setTheme)
	const setAccent = usePreferencesStore((state) => state.setAccent)
	const setLanguage = usePreferencesStore((state) => state.setLanguage)

	return (
		<div className={styles.container}>
			<div className={styles.row}>
				<span className={styles.label}>{t('preferences.language')}</span>
				<Button
					variant='icon'
					onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
					aria-label={t(language === 'es' ? 'preferences.switchToEnglish' : 'preferences.switchToSpanish')}
					aria-pressed={language === 'en'}
					title={t(language === 'es' ? 'preferences.switchToEnglish' : 'preferences.switchToSpanish')}
				>
					<span className={styles.languageFlag} aria-hidden='true'>
						{language === 'es' ? '🇪🇸' : '🇺🇸'}
					</span>
				</Button>
			</div>

			<div className={styles.row}>
				<span className={styles.label}>{t('preferences.theme')}</span>
				<Button
					variant='icon'
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
					aria-label={t(theme === 'dark' ? 'preferences.switchToLight' : 'preferences.switchToDark')}
				>
					{theme === 'dark' ? <AppIcon icon={TbSunHigh} size={18} /> : <AppIcon icon={TbMoon} size={18} />}
				</Button>
			</div>

			<div className={`${styles.row} ${styles.colorRow}`}>
				<span className={styles.label}>{t('preferences.color')}</span>
				<div className={styles.accents}>
					<button
						type='button'
						className={`${styles.accent} ${styles.blue} ${accent === 'blue' ? styles.active : ''}`}
						onClick={() => setAccent('blue')}
						aria-label={t('preferences.blueAccent')}
					/>

					<button
						type='button'
						className={`${styles.accent} ${styles.green} ${accent === 'green' ? styles.active : ''}`}
						onClick={() => setAccent('green')}
						aria-label={t('preferences.greenAccent')}
					/>

					<button
						type='button'
						className={`${styles.accent} ${styles.purple} ${accent === 'purple' ? styles.active : ''}`}
						onClick={() => setAccent('purple')}
						aria-label={t('preferences.purpleAccent')}
					/>

					<button
						type='button'
						className={`${styles.accent} ${styles.orange} ${accent === 'orange' ? styles.active : ''}`}
						onClick={() => setAccent('orange')}
						aria-label={t('preferences.orangeAccent')}
					/>
				</div>
			</div>
		</div>
	)
}

export default Preferences
