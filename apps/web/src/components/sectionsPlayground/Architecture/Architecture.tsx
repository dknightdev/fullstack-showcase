import Section from '@/components/ui/Section/Section'
import SectionHeading from '@/components/ui/SectionHeading/SectionHeading'
import ArchitectureOverview from './components/ArchitectureOverview/ArchitectureOverview'
import ServiceArchitecture from './components/ServiceArchitecture/ServiceArchitecture'
import TechnicalDecisions from './components/TechnicalDecisions/TechnicalDecisions'

import styles from './Architecture.module.css'

const Architecture = () => {
	return (
		<Section id='architecture'>
			<SectionHeading
				eyebrow='Diseño del sistema'
				title='Una arquitectura con'
				highlight='diferentes enfoques'
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
