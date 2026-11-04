export type ProductFixture = {
	id: number
	sku: string
	name: string
	price: number
	stock: number
	category: string
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled'

export type OrderItemFixture = {
	productId: number
	quantity: number
}

export type OrderFixture = {
	id: number
	customerEmail: string
	status: OrderStatus
	items: OrderItemFixture[]
	createdAt: string
}

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'cancelled']

export const LOW_STOCK_THRESHOLD = 10

export const NEXT_PRODUCT_ID = 6

export const NEXT_ORDER_ID = 1004

export const FIXTURE_TIMESTAMP = '2026-04-01T12:00:00Z'

export const products: ProductFixture[] = [
	{ id: 1, sku: 'KB-001', name: 'Mechanical keyboard', price: 89.9, stock: 25, category: 'peripherals' },
	{ id: 2, sku: 'MS-002', name: 'Wireless mouse', price: 39.5, stock: 8, category: 'peripherals' },
	{ id: 3, sku: 'MN-003', name: '27" monitor', price: 289, stock: 12, category: 'displays' },
	{ id: 4, sku: 'HB-004', name: 'USB-C hub', price: 49.99, stock: 0, category: 'accessories' },
	{ id: 5, sku: 'LS-005', name: 'Laptop stand', price: 34, stock: 60, category: 'accessories' }
]

export const orders: OrderFixture[] = [
	{
		id: 1001,
		customerEmail: 'ana@example.com',
		status: 'paid',
		items: [{ productId: 1, quantity: 1 }, { productId: 2, quantity: 2 }],
		createdAt: '2026-02-03T10:15:00Z'
	},
	{
		id: 1002,
		customerEmail: 'luis@example.com',
		status: 'shipped',
		items: [{ productId: 3, quantity: 1 }],
		createdAt: '2026-02-14T16:40:00Z'
	},
	{
		id: 1003,
		customerEmail: 'marta@example.com',
		status: 'pending',
		items: [{ productId: 2, quantity: 1 }, { productId: 4, quantity: 3 }],
		createdAt: '2026-03-09T08:05:00Z'
	}
]

export const salesByMonth = [
	{ period: '2026-01', orders: 42, revenue: 6120.5 },
	{ period: '2026-02', orders: 55, revenue: 8240.75 },
	{ period: '2026-03', orders: 61, revenue: 9310.2 }
]

export const salesByDay = [
	{ period: '2026-03-29', orders: 2, revenue: 310.4 },
	{ period: '2026-03-30', orders: 3, revenue: 455.9 },
	{ period: '2026-03-31', orders: 1, revenue: 89.9 }
]
