import type { EndpointId } from '../types'
import type { AnalyticsData, AnalyticsEndpoint, OrdersData, SalesData, SummaryData, TopProductsData } from './types'

type SummaryResponse = Omit<SummaryData, 'sales'> & {
	sales: Omit<SummaryData['sales'], 'totalRevenue'> & { totalRevenue: string }
}

type SalesResponse = Omit<SalesData, 'data'> & {
	data: (Omit<SalesData['data'][number], 'revenue'> & { revenue: string })[]
}

type TopProductsResponse = Omit<TopProductsData, 'data'> & {
	data: (Omit<TopProductsData['data'][number], 'revenue'> & { revenue: string })[]
}

const requireObject = (value: unknown) => {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('Expected object')
}

const amount = (value: string) => {
	if (typeof value !== 'string') throw new Error('Invalid monetary value')
	const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value)
	if (!match) throw new Error('Invalid monetary value')
	const cents = BigInt(match[1]) * 100n + BigInt((match[2] ?? '').padEnd(2, '0'))
	if (cents > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Monetary value exceeds safe range')
	return { text: value, value: Number(cents) / 100 }
}

const date = (value: string): string => {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Invalid date')
	const parsed = new Date(`${value}T00:00:00Z`)
	if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw new Error('Invalid date')
	return value
}

const period = <T extends { from: string, to: string }>(value: T): T => ({
	...value,
	from: date(value.from),
	to: date(value.to)
})

export const isAnalyticsEndpoint = (id: EndpointId): id is AnalyticsEndpoint =>
	id === 'analyticsSummary' || id === 'analyticsSales' || id === 'analyticsTopProducts' || id === 'analyticsOrders'

export const parseAnalytics = (endpoint: AnalyticsEndpoint, value: unknown): AnalyticsData => {
	if (endpoint === 'analyticsSummary') {
		const response = value as SummaryResponse
		requireObject(response.catalog)
		requireObject(response.orders)
		return { endpoint, data: {
			...response,
			period: {
				from: response.period.from === null ? null : date(response.period.from),
				to: response.period.to === null ? null : date(response.period.to)
			},
			sales: { ...response.sales, totalRevenue: amount(response.sales.totalRevenue) }
		} }
	}

	if (endpoint === 'analyticsSales') {
		const response = value as SalesResponse
		return { endpoint, data: {
			...response,
			period: period(response.period),
			data: response.data.map(item => ({ ...item, date: date(item.date), revenue: amount(item.revenue) }))
		} }
	}

	if (endpoint === 'analyticsTopProducts') {
		const response = value as TopProductsResponse
		return { endpoint, data: {
			...response,
			period: period(response.period),
			data: response.data.map(item => ({ ...item, revenue: amount(item.revenue) }))
		} }
	}

	const response = value as OrdersData
	if (!Array.isArray(response.data)) throw new Error('Expected array')
	return { endpoint, data: { ...response, period: period(response.period) } }
}
