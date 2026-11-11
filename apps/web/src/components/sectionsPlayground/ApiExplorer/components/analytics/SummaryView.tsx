import { useTranslation } from 'react-i18next'
import type { SummaryData } from '../../analytics/types'
import { formatCurrency, formatDate, formatNumber } from '@/utils/format'
import styles from './Analytics.module.css'

const SummaryView = ({ data }: { data: SummaryData }) => {
	const { t, i18n } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer.analytics' })
	const locale = i18n.resolvedLanguage ?? i18n.language

	const { sales, catalog, orders, period } = data

	const groups = [
		{ title: 'sales', cards: [
			['revenue', formatCurrency(sales.totalRevenue.text, locale)],
			['confirmedOrders', formatNumber(sales.confirmedOrders, locale)],
			['unitsSold', formatNumber(sales.unitsSold, locale)]
		] },
		{ title: 'catalog', cards: [
			['totalProducts', formatNumber(catalog.totalProducts, locale)],
			['activeProducts', formatNumber(catalog.activeProducts, locale)],
			['outOfStockProducts', formatNumber(catalog.outOfStockProducts, locale)]
		] },
		{ title: 'orders', cards: [
			['pending', formatNumber(orders.pending, locale)],
			['confirmed', formatNumber(orders.confirmed, locale)],
			['rejected', formatNumber(orders.rejected, locale)],
			['totalOrders', formatNumber(orders.total, locale)]
		] }
	] as const

	return (
		<div className={styles.content}>
			<p className={styles.period}>
				<strong>{t('period')}:</strong> {period.from ? formatDate(period.from, locale) : '—'} - {period.to ? formatDate(period.to, locale) : '—'}
			</p>
			<p className={styles.note}>{t('summaryScope')}</p>
			{groups.map(group => (
				<section key={group.title} className={styles.summaryGroup}>
					<h3 className={styles.groupTitle}>{t(`groups.${group.title}`)}</h3>
					<dl className={styles.cards}>
						{group.cards.map(([label, value]) => (
							<div key={label} className={styles.card}>
								<dt>{t(label)}</dt>
								<dd>{value}</dd>
							</div>
						))}
					</dl>
				</section>
			))}
		</div>
	)
}

export default SummaryView
