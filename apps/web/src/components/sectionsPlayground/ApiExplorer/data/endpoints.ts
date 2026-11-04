import type { Endpoint, EndpointId } from '../types'

const productBody = (extra: Record<string, unknown>) => JSON.stringify(
	{
		sku: 'KB-001',
		name: 'Mechanical keyboard',
		price: 89.9,
		stock: 25,
		category: 'peripherals',
		...extra
	},
	null,
	2
)

const orderBody = JSON.stringify(
	{
		customerEmail: 'ana@example.com',
		items: [
			{ productId: 1, quantity: 2 },
			{ productId: 3, quantity: 1 }
		]
	},
	null,
	2
)

export const endpoints: Endpoint[] = [
	{
		id: 'listProducts',
		apiId: 'dotnet',
		method: 'GET',
		path: '/api/products',
		group: 'productsRead',
		params: [
			{ name: 'category', kind: 'query', defaultValue: '' },
			{ name: 'page', kind: 'query', defaultValue: '1' },
			{ name: 'pageSize', kind: 'query', defaultValue: '3' }
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
		defaultBody: productBody({})
	},
	{
		id: 'updateProduct',
		apiId: 'dotnet',
		method: 'PUT',
		path: '/api/products/{id}',
		group: 'productsWrite',
		params: [{ name: 'id', kind: 'path', defaultValue: '2' }],
		defaultBody: productBody({ sku: 'MS-002', name: 'Wireless mouse', price: 39.5, stock: 40 })
	},
	{
		id: 'deleteProduct',
		apiId: 'dotnet',
		method: 'DELETE',
		path: '/api/products/{id}',
		group: 'productsWrite',
		params: [{ name: 'id', kind: 'path', defaultValue: '5' }]
	},
	{
		id: 'listOrders',
		apiId: 'nestjs',
		method: 'GET',
		path: '/api/orders',
		group: 'ordersRead',
		params: [
			{ name: 'status', kind: 'query', defaultValue: '' },
			{ name: 'page', kind: 'query', defaultValue: '1' }
		]
	},
	{
		id: 'getOrder',
		apiId: 'nestjs',
		method: 'GET',
		path: '/api/orders/{id}',
		group: 'ordersRead',
		params: [{ name: 'id', kind: 'path', defaultValue: '1001' }]
	},
	{
		id: 'getOrderStatus',
		apiId: 'nestjs',
		method: 'GET',
		path: '/api/orders/{id}/status',
		group: 'ordersRead',
		params: [{ name: 'id', kind: 'path', defaultValue: '1002' }]
	},
	{
		id: 'createOrder',
		apiId: 'nestjs',
		method: 'POST',
		path: '/api/orders',
		group: 'ordersWrite',
		params: [],
		defaultBody: orderBody
	},
	{
		id: 'salesReport',
		apiId: 'laravel',
		method: 'GET',
		path: '/api/reports/sales',
		group: 'reports',
		params: [
			{ name: 'from', kind: 'query', defaultValue: '2026-01-01' },
			{ name: 'to', kind: 'query', defaultValue: '2026-03-31' },
			{ name: 'groupBy', kind: 'query', defaultValue: 'month' }
		]
	},
	{
		id: 'inventoryReport',
		apiId: 'laravel',
		method: 'GET',
		path: '/api/reports/inventory',
		group: 'reports',
		params: [{ name: 'lowStockOnly', kind: 'query', defaultValue: 'false' }]
	},
	{
		id: 'ordersReport',
		apiId: 'laravel',
		method: 'GET',
		path: '/api/reports/orders',
		group: 'reports',
		params: [{ name: 'status', kind: 'query', defaultValue: '' }]
	}
]

export const getEndpoint = (id: EndpointId): Endpoint => {
	const endpoint = endpoints.find((item) => item.id === id)

	if (!endpoint) {
		throw new Error(`Unknown endpoint: ${id}`)
	}

	return endpoint
}
