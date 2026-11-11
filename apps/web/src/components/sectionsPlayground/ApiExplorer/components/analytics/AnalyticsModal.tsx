import { useTranslation } from 'react-i18next'
import Modal from '@/components/ui/Modal/Modal'
import type { AnalyticsData } from '../../analytics/types'
import SummaryView from './SummaryView'
import SalesView from './SalesView'
import TopProductsView from './TopProductsView'
import OrdersView from './OrdersView'

type Props = {
	isOpen: boolean
	onClose: () => void
	data: AnalyticsData
}

const AnalyticsModal = ({ isOpen, onClose, data }: Props) => {
	const { t } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer.analytics' })

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={t(`titles.${data.endpoint}`)}>
			{data.endpoint === 'analyticsSummary' && <SummaryView data={data.data} />}
			{data.endpoint === 'analyticsSales' && <SalesView data={data.data} />}
			{data.endpoint === 'analyticsTopProducts' && <TopProductsView data={data.data} />}
			{data.endpoint === 'analyticsOrders' && <OrdersView data={data.data} />}
		</Modal>
	)
}

export default AnalyticsModal
