import type { ApiDefinition } from '../types'
import { ANALYTICS_BASE_URL, CATALOG_BASE_URL, ORDERS_BASE_URL } from './config'

export const apis: ApiDefinition[] = [
	{
		id: 'dotnet',
		technology: '.NET',
		baseUrl: CATALOG_BASE_URL,
		reads: ['products', 'inventory'],
		writes: ['products', 'inventory'],
		endpointIds: [
			'listProducts',
			'getProduct',
			'createProduct',
			'updateProduct',
			'deleteProduct',
			'activateProduct',
			'deactivateProduct',
			'setProductStock',
			'increaseProductStock',
			'decreaseProductStock'
		]
	},
	{
		id: 'nestjs',
		technology: 'NestJS',
		baseUrl: ORDERS_BASE_URL,
		reads: ['orders', 'inventory'],
		writes: ['orders'],
		endpointIds: ['listOrders', 'getOrder', 'createOrder']
	},
	{
		id: 'go',
		technology: 'Go',
		baseUrl: ANALYTICS_BASE_URL,
		reads: ['products', 'inventory', 'orders'],
		writes: [],
		endpointIds: ['analyticsSummary', 'analyticsSales', 'analyticsTopProducts', 'analyticsOrders']
	}
]

export const getApi = (id: ApiDefinition['id']): ApiDefinition => {
	const api = apis.find((item) => item.id === id)

	if (!api) {
		throw new Error(`Unknown API: ${id}`)
	}

	return api
}
