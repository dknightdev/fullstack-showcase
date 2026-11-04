import type { ApiDefinition } from '../types'
import { API_BASE_URLS } from './config'

export const apis: ApiDefinition[] = [
	{
		id: 'dotnet',
		technology: '.NET',
		baseUrl: API_BASE_URLS.dotnet,
		reads: ['products', 'inventory'],
		writes: ['products', 'inventory'],
		endpointIds: [
			'listProducts',
			'getProduct',
			'createProduct',
			'updateProduct',
			'deleteProduct'
		]
	},
	{
		id: 'nestjs',
		technology: 'NestJS',
		baseUrl: API_BASE_URLS.nestjs,
		reads: ['orders', 'inventory'],
		writes: ['orders'],
		endpointIds: [
			'listOrders',
			'getOrder',
			'createOrder',
			'getOrderStatus'
		]
	},
	{
		id: 'laravel',
		technology: 'Laravel',
		baseUrl: API_BASE_URLS.laravel,
		reads: ['products', 'inventory', 'orders'],
		writes: [],
		endpointIds: [
			'salesReport',
			'inventoryReport',
			'ordersReport'
		]
	}
]

export const getApi = (id: ApiDefinition['id']): ApiDefinition => {
	const api = apis.find((item) => item.id === id)

	if (!api) {
		throw new Error(`Unknown API: ${id}`)
	}

	return api
}
