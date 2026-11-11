export type AnalyticsEndpoint = 'analyticsSummary' | 'analyticsSales' | 'analyticsTopProducts' | 'analyticsOrders'

type Period = { from: string, to: string }
type Amount = { text: string, value: number }

export type SummaryData = {
	period: { from: string | null, to: string | null }
	sales: { totalRevenue: Amount, confirmedOrders: number, unitsSold: number }
	catalog: { totalProducts: number, activeProducts: number, outOfStockProducts: number }
	orders: { pending: number, confirmed: number, rejected: number, total: number }
}

export type SalesData = {
	period: Period & { interval: 'day' | 'week' | 'month' }
	data: { date: string, revenue: Amount, confirmedOrders: number, unitsSold: number }[]
}

export type TopProductsData = {
	period: Period
	data: { productId: number, name: string, sku: string, unitsSold: number, revenue: Amount }[]
}

export type OrdersData = {
	period: Period
	total: number
	data: { status: 'Pending' | 'Confirmed' | 'Rejected', count: number, percentage: number }[]
}

export type AnalyticsData =
	| { endpoint: 'analyticsSummary', data: SummaryData }
	| { endpoint: 'analyticsSales', data: SalesData }
	| { endpoint: 'analyticsTopProducts', data: TopProductsData }
	| { endpoint: 'analyticsOrders', data: OrdersData }
