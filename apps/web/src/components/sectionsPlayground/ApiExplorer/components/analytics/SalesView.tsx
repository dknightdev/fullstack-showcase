import { useTranslation } from 'react-i18next'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SalesData } from '../../analytics/types'
import { formatChartCurrency, formatCurrency, formatDate, formatNumber } from '@/utils/format'
import styles from './Analytics.module.css'

const SalesView = ({ data }: { data: SalesData }) => {
	const { t, i18n } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer.analytics' })
	const locale = i18n.resolvedLanguage ?? i18n.language

	const formatChartDate = (date: string) => formatDate(date, locale)
	const rows = data.data.map(item => ({ ...item, revenueValue: item.revenue.value }))

	return (
		<div className={styles.content}>
			<p className={styles.period}>
				<strong>{t('period')}:</strong> {formatDate(data.period.from, locale)} - {formatDate(data.period.to, locale)} · {t(`intervals.${data.period.interval}`)}
			</p>
			<div className={styles.chartSection}>
				<h3>{t('revenue')}</h3>
				<div className={styles.chart}>
					<ResponsiveContainer width='100%' height='100%'>
						<AreaChart data={rows} accessibilityLayer>
							<CartesianGrid stroke='var(--color-border)' strokeDasharray='3 3' />
							<XAxis
								dataKey='date'
								stroke='var(--color-text-soft)'
								minTickGap={24}
								tickFormatter={formatChartDate}
							/>
							<YAxis
								stroke='var(--color-text-soft)'
								width={75}
								tickFormatter={value => formatChartCurrency(value, locale)}
							/>
							<Tooltip content={({ active, label }) => {
								const row = rows.find(item => item.date === label)
								if (!active || !row) return null

								return (
									<div className={styles.tooltip}>
										<div>
											<strong>{formatDate(row.date, locale)}</strong>
											<p><strong>{t('revenue')}:</strong> {formatCurrency(row.revenue.text, locale)}</p>
										</div>
									</div>
								)
							}} />
							<Area
								dataKey='revenueValue'
								name={t('revenue')}
								stroke='var(--color-primary)'
								fill='var(--color-primary-transparent-foreground)'
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>
			{(['confirmedOrders', 'unitsSold'] as const).map(metric => (
				<div className={styles.chartSection} key={metric}>
					<h3>{t(metric)}</h3>
					<div className={styles.chart}>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart data={rows} accessibilityLayer>
								<CartesianGrid stroke='var(--color-border)' strokeDasharray='3 3' />
								<XAxis
									dataKey='date'
									stroke='var(--color-text-soft)'
									minTickGap={24}
									tickFormatter={formatChartDate}
								/>
								<YAxis
									stroke='var(--color-text-soft)'
									allowDecimals={false}
									width={60}
									tickFormatter={value => formatNumber(value, locale)}
								/>
								<Tooltip
									content={({ active, label }) => {
										const row = rows.find(item => item.date === label)
										if (!active || !row) return null

										return (
											<div className={styles.tooltip}>
												<div>
													<strong>{formatDate(row.date, locale)}</strong>
													<p><strong>{t(metric)}:</strong> {formatNumber(row[metric], locale)}</p>
												</div>
											</div>
										)
									}}
									cursor={{ fill: 'var(--color-text-transparent)' }}
								/>
								<Bar dataKey={metric} name={t(metric)} fill='var(--color-primary)' />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			))}
			<div className={`${styles.tableWrap} custom-scroll`}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>{t('date')}</th>
							<th>{t('revenue')}</th>
							<th>{t('confirmedOrders')}</th>
							<th>{t('unitsSold')}</th>
						</tr>
					</thead>
					<tbody>
						{rows.map(row => (
							<tr key={row.date}>
								<td>{formatDate(row.date, locale)}</td>
								<td>{formatCurrency(row.revenue.text, locale)}</td>
								<td>{formatNumber(row.confirmedOrders, locale)}</td>
								<td>{formatNumber(row.unitsSold, locale)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default SalesView
