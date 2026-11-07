import type { ApiDefinition } from '../types'
import { CATALOG_BASE_URL } from './config'

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
		reads: ['orders', 'inventory'],
		writes: ['orders'],
		endpointIds: []
	},
	{
		id: 'laravel',
		technology: 'Laravel',
		reads: ['products', 'inventory', 'orders'],
		writes: [],
		endpointIds: []
	}
]

export const getApi = (id: ApiDefinition['id']): ApiDefinition => {
	const api = apis.find((item) => item.id === id)

	if (!api) {
		throw new Error(`Unknown API: ${id}`)
	}

	return api
}
