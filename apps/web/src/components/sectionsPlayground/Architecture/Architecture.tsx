import { useTranslation } from 'react-i18next'
import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import ArchitectureOverview from './components/ArchitectureOverview/ArchitectureOverview'
import ServiceArchitecture from './components/ServiceArchitecture/ServiceArchitecture'
import TechnicalDecisions from './components/TechnicalDecisions/TechnicalDecisions'

import styles from './Architecture.module.css'

const Architecture = () => {
	const { t } = useTranslation()

	return (
		<Section id='architecture'>
			<SectionHeading
				eyebrow={t('playground.architecture.eyebrow')}
				title={t('playground.architecture.title')}
				highlight={t('playground.architecture.highlight')}
			/>

			<div className={styles.content}>
				<ArchitectureOverview />
				<ServiceArchitecture />
				<TechnicalDecisions />
			</div>

		</Section>
	)
}

export default Architecture
