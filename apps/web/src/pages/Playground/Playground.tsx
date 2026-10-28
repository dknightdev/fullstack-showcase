import { useTranslation } from 'react-i18next'

import styles from './Playground.module.css'

const Playground = () => {
	const { t } = useTranslation()

	return (
		<section className={styles.page}>
			<h1 className={styles.title}>{t('playground.title')}</h1>
			<p className={styles.description}>{t('playground.description')}</p>
		</section>
	)
}

export default Playground
