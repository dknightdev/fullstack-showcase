import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Select from '@/components/ui/Select/Select'
import type { TopProductsData } from '../../analytics/types'
import { formatChartCurrency, formatCurrency, formatDate, formatNumber } from '@/utils/format'
import styles from './Analytics.module.css'

const TopProductsView = ({ data }: { data: TopProductsData }) => {
	const { t, i18n } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer.analytics' })
	const locale = i18n.resolvedLanguage ?? i18n.language
	const [metric, setMetric] = useState<'unitsSold' | 'revenue'>('unitsSold')
	const rows = data.data.map(item => ({ ...item, label: `${item.name} (${item.sku})`, revenueValue: item.revenue.value }))

	return (
		<div className={styles.content}>
			<p className={styles.period}>
				<strong>{t('period')}:</strong> {formatDate(data.period.from, locale)} - {formatDate(data.period.to, locale)}
			</p>
			{rows.length === 0 ? <p className={styles.empty}>{t('empty')}</p> : (
				<>
					<label className={styles.selector}>
						{t('metric')}
						<Select value={metric} onChange={event => setMetric(event.target.value === 'revenue' ? 'revenue' : 'unitsSold')}>
							<option value='unitsSold'>{t('unitsSold')}</option>
							<option value='revenue'>{t('revenue')}</option>
						</Select>
					</label>
					<div className={`${styles.tableWrap} custom-scroll`}>
						<div className={styles.chartTall} style={{ height: Math.max(240, rows.length * 38) }}>
							<ResponsiveContainer width='100%' height='100%'>
								<BarChart data={rows} layout='vertical' margin={{ left: 10 }} accessibilityLayer>
									<CartesianGrid stroke='var(--color-border)' strokeDasharray='3 3' />
									<XAxis
										type='number'
										stroke='var(--color-text-soft)'
										tickFormatter={value => metric === 'revenue' ? formatChartCurrency(value, locale) : formatNumber(value, locale)}
									/>
									<YAxis
										type='category'
										dataKey='label'
										width={140}
										stroke='var(--color-text-soft)'
										interval={0}
									/>
									<Tooltip
										content={({ active, payload }) => {
											const item = payload?.[0]?.payload
											if (!active || !item) return null

											const row = rows.find(candidate => candidate.productId === item.productId)
											if (!row) return null

											return (
												<div className={styles.tooltip}>
													<strong>{row.label}</strong>
													<p><strong>{t('unitsSold')}:</strong> {formatNumber(row.unitsSold, locale)}</p>
													<p><strong>{t('revenue')}:</strong> {formatCurrency(row.revenue.text, locale)}</p>
												</div>
											)
										}}
										cursor={{ fill: 'var(--color-text-transparent)' }}
									/>
									<Bar dataKey={metric === 'revenue' ? 'revenueValue' : 'unitsSold'} fill='var(--color-primary)' />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
					<div className={`${styles.tableWrap} custom-scroll`}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>{t('product')}</th>
									<th>{t('unitsSold')}</th>
									<th>{t('revenue')}</th>
								</tr>
							</thead>
							<tbody>
								{rows.map(row => (
									<tr key={row.productId}>
										<td>{row.label}</td>
										<td>{formatNumber(row.unitsSold, locale)}</td>
										<td>{formatCurrency(row.revenue.text, locale)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	)
}

export default TopProductsView
