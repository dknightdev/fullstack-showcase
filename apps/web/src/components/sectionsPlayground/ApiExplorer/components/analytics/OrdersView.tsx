import { useTranslation } from 'react-i18next'
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip, type PieSectorShapeProps } from 'recharts'
import type { OrdersData } from '../../analytics/types'
import { formatDate, formatNumber } from '@/utils/format'
import styles from './Analytics.module.css'

const colors = {
	Pending: 'var(--color-warning)',
	Confirmed: 'var(--color-success)',
	Rejected: 'var(--color-error)'
} as const

type OrderItem = OrdersData['data'][number]

interface CustomPieSectorProps extends PieSectorShapeProps {
    payload?: OrderItem
}

const OrdersView = ({ data }: { data: OrdersData }) => {
	const { t, i18n } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer.analytics' })
	const locale = i18n.resolvedLanguage ?? i18n.language
	const rows = data.data
		.map(item => ({ ...item, label: t(`statuses.${item.status}`) }))
		.sort((a, b) => b.percentage - a.percentage)

	return (
		<div className={styles.content}>
			<p className={styles.period}>
				<strong>{t('period')}:</strong> {formatDate(data.period.from, locale)} - {formatDate(data.period.to, locale)}
			</p>
			<div className={styles.donut}>
				{data.total > 0 && (
					<ResponsiveContainer width='100%' height='100%'>
						<PieChart accessibilityLayer>
							<Pie
								data={rows}
								dataKey='count'
								nameKey='label'
								innerRadius={65}
								outerRadius={95}
								shape={(props: CustomPieSectorProps) => {
									const status = props.payload?.status;
									const fillColor = status && status in colors ? colors[status] : 'var(--color-success)'

									return <Sector {...props} fill={fillColor} />;
								}}
							/>
							<Tooltip wrapperStyle={{ zIndex: 1 }} content={({ active, payload }) => {
								const item = payload?.[0]?.payload
								const row = rows.find(candidate => candidate.status === item?.status)
								if (!active || !row) return null

								return (
									<div className={styles.tooltip}>
										<strong>{row.label}</strong>
										<p><strong>{t('count')}:</strong> {formatNumber(row.count, locale)}</p>
										<p><strong>{t('percentage')}:</strong> {formatNumber(row.percentage, locale)}%</p>
									</div>
								)
							}} />
						</PieChart>
					</ResponsiveContainer>
				)}
				{data.total === 0 && <div className={styles.emptyDonut} aria-hidden='true' />}
				<span className={styles.donutTotal}>
					{t('totalOrders')}: <br/>
					{formatNumber(data.total, locale)}
				</span>
			</div>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>{t('status')}</th>
						<th>{t('count')}</th>
						<th>{t('percentage')}</th>
					</tr>
				</thead>
				<tbody>
					{rows.map(row => (
						<tr key={row.status}>
							<td><span className={styles.statusDot} style={{ backgroundColor: colors[row.status] }} />{row.label}</td>
							<td>{formatNumber(row.count, locale)}</td>
							<td>{formatNumber(row.percentage, locale)}%</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default OrdersView
