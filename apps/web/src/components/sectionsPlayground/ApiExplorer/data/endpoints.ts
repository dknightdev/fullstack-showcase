import type { Endpoint, EndpointId, EndpointParam } from '../types'

const periodParams: EndpointParam[] = [
	{ name: 'from', kind: 'query', defaultValue: '', placeholder: 'YYYY-MM-DD' },
	{ name: 'to', kind: 'query', defaultValue: '', placeholder: 'YYYY-MM-DD' }
]

export const endpoints: Endpoint[] = [
	{
		id: 'listProducts',
		apiId: 'dotnet',
		method: 'GET',
		path: '/api/products',
		group: 'productsRead',
		params: [
			{ name: 'page', kind: 'query', defaultValue: '1' },
			{ name: 'pageSize', kind: 'query', defaultValue: '10' },
			{ name: 'search', kind: 'query', defaultValue: '' },
			{
				name: 'isActive', kind: 'query', defaultValue: '',
				options: [
					{ value: '', label: 'defaultActive' },
					{ value: 'true', label: 'active' },
					{ value: 'false', label: 'inactive' }
				]
			},
			{
				name: 'sortBy', kind: 'query', defaultValue: '',
				options: [
					{ value: '', label: 'defaultName' },
					{ value: 'Name', label: 'name' },
					{ value: 'Sku', label: 'sku' },
					{ value: 'Price', label: 'price' },
					{ value: 'StockQuantity', label: 'stockQuantity' },
					{ value: 'CreatedAt', label: 'createdAt' },
					{ value: 'UpdatedAt', label: 'updatedAt' }
				]
			},
			{
				name: 'sortDirection', kind: 'query', defaultValue: '',
				options: [
					{ value: '', label: 'defaultAscending' },
					{ value: 'Asc', label: 'ascending' },
					{ value: 'Desc', label: 'descending' }
				]
			}
		]
	},
	{
		id: 'getProduct',
		apiId: 'dotnet',
		method: 'GET',
		path: '/api/products/{id}',
		group: 'productsRead',
		params: [{ name: 'id', kind: 'path', defaultValue: '1' }]
	},
	{
		id: 'createProduct',
		apiId: 'dotnet',
		method: 'POST',
		path: '/api/products',
		group: 'productsWrite',
		params: [],
		defaultBody: JSON.stringify({
			name: 'Mechanical keyboard',
			description: 'Mechanical keyboard',
			sku: 'KB-001',
			price: 89.9,
			stockQuantity: 25
		}, null, 2)
	},
	{
		id: 'updateProduct',
		apiId: 'dotnet',
		method: 'PUT',
		path: '/api/products/{id}',
		group: 'productsWrite',
		params: [{ name: 'id', kind: 'path', defaultValue: '1' }],
		defaultBody: JSON.stringify({
			name: 'Wireless mouse',
			description: 'Wireless mouse',
			sku: 'MS-002',
			price: 39.5
		}, null, 2)
	},
	{
		id: 'deleteProduct',
		apiId: 'dotnet',
		method: 'DELETE',
		path: '/api/products/{id}',
		group: 'productsWrite',
		params: [{ name: 'id', kind: 'path', defaultValue: '1' }]
	},
	{
		id: 'activateProduct',
		apiId: 'dotnet',
		method: 'PATCH',
		path: '/api/products/{id}/activate',
		group: 'productsWrite',
		params: [{ name: 'id', kind: 'path', defaultValue: '1' }]
	},
	{
		id: 'deactivateProduct',
		apiId: 'dotnet',
		method: 'PATCH',
		path: '/api/products/{id}/deactivate',
		group: 'productsWrite',
		params: [{ name: 'id', kind: 'path', defaultValue: '1' }]
	},
	{
		id: 'setProductStock',
		apiId: 'dotnet',
		method: 'PATCH',
		path: '/api/products/{id}/stock',
		group: 'inventory',
		params: [{ name: 'id', kind: 'path', defaultValue: '1' }],
		defaultBody: JSON.stringify({ stockQuantity: 25 }, null, 2)
	},
	{
		id: 'increaseProductStock',
		apiId: 'dotnet',
		method: 'POST',
		path: '/api/products/{id}/stock/increase',
		group: 'inventory',
		params: [{ name: 'id', kind: 'path', defaultValue: '1' }],
		defaultBody: JSON.stringify({ quantity: 5 }, null, 2)
	},
	{
		id: 'decreaseProductStock',
		apiId: 'dotnet',
		method: 'POST',
		path: '/api/products/{id}/stock/decrease',
		group: 'inventory',
		params: [{ name: 'id', kind: 'path', defaultValue: '1' }],
		defaultBody: JSON.stringify({ quantity: 5 }, null, 2)
	},
	{
		id: 'listOrders',
		apiId: 'nestjs',
		method: 'GET',
		path: '/api/orders',
		group: 'ordersRead',
		params: [
			{ name: 'page', kind: 'query', defaultValue: '1' },
			{ name: 'pageSize', kind: 'query', defaultValue: '10' },
			{
				name: 'status', kind: 'query', defaultValue: '',
				options: [
					{ value: '', label: 'allStatuses' },
					{ value: 'Pending', label: 'pending' },
					{ value: 'Confirmed', label: 'confirmed' },
					{ value: 'Rejected', label: 'rejected' }
				]
			},
			{
				name: 'sortBy', kind: 'query', defaultValue: '',
				options: [
					{ value: '', label: 'defaultCreatedAt' },
					{ value: 'createdAt', label: 'createdAt' },
					{ value: 'total', label: 'total' }
				]
			},
			{
				name: 'sortDirection', kind: 'query', defaultValue: '',
				options: [
					{ value: '', label: 'defaultDescending' },
					{ value: 'asc', label: 'ascending' },
					{ value: 'desc', label: 'descending' }
				]
			},
			{ name: 'fromDate', kind: 'query', defaultValue: '', placeholder: '2026-11-01T00:00:00.000Z' },
			{ name: 'toDate', kind: 'query', defaultValue: '', placeholder: '2026-11-10T23:59:59.999Z' }
		]
	},
	{
		id: 'getOrder',
		apiId: 'nestjs',
		method: 'GET',
		path: '/api/orders/{id}',
		group: 'ordersRead',
		params: [{ name: 'id', kind: 'path', defaultValue: '', placeholder: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' }]
	},
	{
		id: 'createOrder',
		apiId: 'nestjs',
		method: 'POST',
		path: '/api/orders',
		group: 'ordersWrite',
		params: [],
		defaultBody: JSON.stringify({ items: [{ productId: 1, quantity: 1 }] }, null, 2)
	},
	{
		id: 'analyticsSummary', apiId: 'go', method: 'GET', path: '/api/analytics/summary',
		group: 'analytics', params: [...periodParams]
	},
	{
		id: 'analyticsSales', apiId: 'go', method: 'GET', path: '/api/analytics/sales',
		group: 'analytics',
		params: [...periodParams, {
			name: 'interval', kind: 'query', defaultValue: '',
			options: [
				{ value: '', label: 'defaultDay' },
				{ value: 'day', label: 'day' },
				{ value: 'week', label: 'week' },
				{ value: 'month', label: 'month' }
			]
		}]
	},
	{
		id: 'analyticsTopProducts', apiId: 'go', method: 'GET', path: '/api/analytics/top-products',
		group: 'analytics',
		params: [...periodParams, { name: 'limit', kind: 'query', defaultValue: '' }]
	},
	{
		id: 'analyticsOrders', apiId: 'go', method: 'GET', path: '/api/analytics/orders',
		group: 'analytics', params: [...periodParams]
	}
]

export const getEndpoint = (id: EndpointId): Endpoint => {
	const endpoint = endpoints.find((item) => item.id === id)

	if (!endpoint) {
		throw new Error(`Unknown endpoint: ${id}`)
	}

	return endpoint
}
