import type { Endpoint, EndpointId, RequestInput, SimulatedResponse } from '../types'
import {
	FIXTURE_TIMESTAMP,
	LOW_STOCK_THRESHOLD,
	NEXT_ORDER_ID,
	NEXT_PRODUCT_ID,
	ORDER_STATUSES,
	orders,
	products,
	salesByDay,
	salesByMonth,
	type OrderFixture,
	type OrderStatus,
	type ProductFixture
} from '../data/fixtures'
import { parseJson } from './validateRequest'

type HandlerContext = {
	pathParams: Record<string, string>
	queryParams: Record<string, string>
	body: unknown
}

type HandlerResult = {
	status: number
	body: unknown
}

type FieldError = {
	field: string
	code: 'required' | 'invalid_type' | 'out_of_range' | 'unknown_product'
}

type ProductInput = Omit<ProductFixture, 'id'>

type OrderRequestItem = {
	productId: number
	quantity: number
}

const BASE_LATENCY_MS: Record<Endpoint['apiId'], number> = {
	dotnet: 45,
	nestjs: 80,
	laravel: 120
}

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const round2 = (value: number): number => Math.round(value * 100) / 100

const parseId = (value: string | undefined): number | null =>
	value !== undefined && /^\d+$/.test(value.trim()) ? Number(value.trim()) : null

const parsePositiveInt = (value: string | undefined, fallback: number): number | null => {
	if (!value?.trim()) {
		return fallback
	}

	const parsed = parseId(value)

	return parsed !== null && parsed > 0 ? parsed : null
}

const badRequest = (details: FieldError[]): HandlerResult => ({
	status: 400,
	body: { error: 'BAD_REQUEST', details }
})

const notFound = (resource: string, id: number): HandlerResult => ({
	status: 404,
	body: { error: 'NOT_FOUND', resource, id }
})

const paginate = <T>(
	items: T[],
	ctx: HandlerContext,
	defaultPageSize: number
): HandlerResult => {
	const page = parsePositiveInt(ctx.queryParams.page, 1)
	const pageSize = parsePositiveInt(ctx.queryParams.pageSize, defaultPageSize)
	const errors: FieldError[] = []

	if (page === null) {
		errors.push({ field: 'page', code: 'out_of_range' })
	}

	if (pageSize === null || pageSize > MAX_PAGE_SIZE) {
		errors.push({ field: 'pageSize', code: 'out_of_range' })
	}

	if (page === null || pageSize === null || errors.length) {
		return badRequest(errors)
	}

	const start = (page - 1) * pageSize

	return {
		status: 200,
		body: {
			data: items.slice(start, start + pageSize),
			meta: { page, pageSize, total: items.length }
		}
	}
}

const validateProductBody = (
	body: unknown
): { value: ProductInput } | { errors: FieldError[] } => {
	if (!isRecord(body)) {
		return { errors: [{ field: 'body', code: 'invalid_type' }] }
	}

	const errors: FieldError[] = []
	const { sku, name, price, stock, category } = body

	const checkString = (field: string, value: unknown) => {
		if (value === undefined) {
			errors.push({ field, code: 'required' })
		} else if (typeof value !== 'string' || !value.trim()) {
			errors.push({ field, code: 'invalid_type' })
		}
	}

	checkString('sku', sku)
	checkString('name', name)
	checkString('category', category)

	if (price === undefined) {
		errors.push({ field: 'price', code: 'required' })
	} else if (typeof price !== 'number' || !Number.isFinite(price)) {
		errors.push({ field: 'price', code: 'invalid_type' })
	} else if (price <= 0) {
		errors.push({ field: 'price', code: 'out_of_range' })
	}

	if (stock === undefined) {
		errors.push({ field: 'stock', code: 'required' })
	} else if (typeof stock !== 'number' || !Number.isInteger(stock)) {
		errors.push({ field: 'stock', code: 'invalid_type' })
	} else if (stock < 0) {
		errors.push({ field: 'stock', code: 'out_of_range' })
	}

	if (errors.length) {
		return { errors }
	}

	return {
		value: {
			sku: String(sku).trim(),
			name: String(name).trim(),
			price: Number(price),
			stock: Number(stock),
			category: String(category).trim()
		}
	}
}

const getOrderTotal = (order: OrderFixture): number =>
	round2(
		order.items.reduce((total, item) => {
			const product = products.find((candidate) => candidate.id === item.productId)

			return total + (product?.price ?? 0) * item.quantity
		}, 0)
	)

const toOrderView = (order: OrderFixture) => ({
	id: order.id,
	customerEmail: order.customerEmail,
	status: order.status,
	items: order.items.map((item) => ({
		...item,
		unitPrice: products.find((candidate) => candidate.id === item.productId)?.price ?? 0
	})),
	total: getOrderTotal(order),
	createdAt: order.createdAt
})

const isOrderStatus = (value: string): value is OrderStatus =>
	ORDER_STATUSES.some((status) => status === value)

const filterOrdersByStatus = (
	status: string | undefined
): { orders: OrderFixture[] } | { errors: FieldError[] } => {
	const value = status?.trim()

	if (!value) {
		return { orders }
	}

	if (!isOrderStatus(value)) {
		return { errors: [{ field: 'status', code: 'out_of_range' }] }
	}

	return { orders: orders.filter((order) => order.status === value) }
}

const validateOrderBody = (
	body: unknown
): { customerEmail: string, items: OrderRequestItem[] } | { errors: FieldError[] } => {
	if (!isRecord(body)) {
		return { errors: [{ field: 'body', code: 'invalid_type' }] }
	}

	const errors: FieldError[] = []
	const { customerEmail, items } = body

	if (customerEmail === undefined) {
		errors.push({ field: 'customerEmail', code: 'required' })
	} else if (typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
		errors.push({ field: 'customerEmail', code: 'invalid_type' })
	}

	const parsedItems: OrderRequestItem[] = []

	if (items === undefined) {
		errors.push({ field: 'items', code: 'required' })
	} else if (!Array.isArray(items) || items.length === 0) {
		errors.push({ field: 'items', code: 'invalid_type' })
	} else {
		items.forEach((item: unknown, index) => {
			const prefix = `items[${index}]`

			if (!isRecord(item)) {
				errors.push({ field: prefix, code: 'invalid_type' })
				return
			}

			const { productId, quantity } = item

			if (typeof productId !== 'number' || !Number.isInteger(productId) || productId <= 0) {
				errors.push({ field: `${prefix}.productId`, code: 'invalid_type' })
			} else if (!products.some((product) => product.id === productId)) {
				errors.push({ field: `${prefix}.productId`, code: 'unknown_product' })
			}

			if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
				errors.push({ field: `${prefix}.quantity`, code: 'out_of_range' })
			}

			if (
				typeof productId === 'number' &&
				typeof quantity === 'number'
			) {
				parsedItems.push({ productId, quantity })
			}
		})
	}

	if (errors.length) {
		return { errors }
	}

	return { customerEmail: String(customerEmail), items: parsedItems }
}

const handlers: Record<EndpointId, (ctx: HandlerContext) => HandlerResult> = {
	// .NET: products and inventory (the only API allowed to write them)
	listProducts: (ctx) => {
		const category = ctx.queryParams.category?.trim()
		const filtered = category
			? products.filter((product) => product.category === category)
			: products

		return paginate(filtered, ctx, DEFAULT_PAGE_SIZE)
	},
	getProduct: (ctx) => {
		const id = parseId(ctx.pathParams.id)

		if (id === null) {
			return badRequest([{ field: 'id', code: 'invalid_type' }])
		}

		const product = products.find((candidate) => candidate.id === id)

		return product
			? { status: 200, body: { data: product } }
			: notFound('product', id)
	},
	createProduct: (ctx) => {
		const result = validateProductBody(ctx.body)

		if ('errors' in result) {
			return badRequest(result.errors)
		}

		if (products.some((product) => product.sku === result.value.sku)) {
			return {
				status: 409,
				body: { error: 'SKU_ALREADY_EXISTS', sku: result.value.sku }
			}
		}

		return {
			status: 201,
			body: {
				data: { id: NEXT_PRODUCT_ID, ...result.value },
				location: `/api/products/${NEXT_PRODUCT_ID}`
			}
		}
	},
	updateProduct: (ctx) => {
		const id = parseId(ctx.pathParams.id)

		if (id === null) {
			return badRequest([{ field: 'id', code: 'invalid_type' }])
		}

		const result = validateProductBody(ctx.body)

		if ('errors' in result) {
			return badRequest(result.errors)
		}

		if (!products.some((product) => product.id === id)) {
			return notFound('product', id)
		}

		if (products.some((product) => product.sku === result.value.sku && product.id !== id)) {
			return {
				status: 409,
				body: { error: 'SKU_ALREADY_EXISTS', sku: result.value.sku }
			}
		}

		return {
			status: 200,
			body: { data: { id, ...result.value }, updatedAt: FIXTURE_TIMESTAMP }
		}
	},
	deleteProduct: (ctx) => {
		const id = parseId(ctx.pathParams.id)

		if (id === null) {
			return badRequest([{ field: 'id', code: 'invalid_type' }])
		}

		if (!products.some((product) => product.id === id)) {
			return notFound('product', id)
		}

		const referencedBy = orders
			.filter((order) => order.items.some((item) => item.productId === id))
			.map((order) => order.id)

		if (referencedBy.length) {
			return {
				status: 409,
				body: { error: 'PRODUCT_IN_USE', referencedByOrders: referencedBy }
			}
		}

		return { status: 204, body: null }
	},

	// NestJS: orders (reads inventory only through a controlled check)
	listOrders: (ctx) => {
		const filtered = filterOrdersByStatus(ctx.queryParams.status)

		if ('errors' in filtered) {
			return badRequest(filtered.errors)
		}

		return paginate(filtered.orders.map(toOrderView), ctx, DEFAULT_PAGE_SIZE)
	},
	getOrder: (ctx) => {
		const id = parseId(ctx.pathParams.id)

		if (id === null) {
			return badRequest([{ field: 'id', code: 'invalid_type' }])
		}

		const order = orders.find((candidate) => candidate.id === id)

		return order
			? { status: 200, body: { data: toOrderView(order) } }
			: notFound('order', id)
	},
	getOrderStatus: (ctx) => {
		const id = parseId(ctx.pathParams.id)

		if (id === null) {
			return badRequest([{ field: 'id', code: 'invalid_type' }])
		}

		const order = orders.find((candidate) => candidate.id === id)

		return order
			? { status: 200, body: { data: { id: order.id, status: order.status } } }
			: notFound('order', id)
	},
	createOrder: (ctx) => {
		const result = validateOrderBody(ctx.body)

		if ('errors' in result) {
			return badRequest(result.errors)
		}

		const requested = new Map<number, number>()

		result.items.forEach((item) => {
			requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.quantity)
		})

		const availability = [...requested].map(([productId, quantity]) => ({
			productId,
			requested: quantity,
			available: products.find((product) => product.id === productId)?.stock ?? 0
		}))

		const shortages = availability.filter((item) => item.requested > item.available)

		// The orders service never touches stock directly: it asks the products service.
		const inventoryCheck = { checkedBy: 'products-api', items: availability }

		if (shortages.length) {
			return {
				status: 409,
				body: { error: 'INSUFFICIENT_STOCK', inventoryCheck: { ...inventoryCheck, items: shortages } }
			}
		}

		const order: OrderFixture = {
			id: NEXT_ORDER_ID,
			customerEmail: result.customerEmail,
			status: 'pending',
			items: result.items,
			createdAt: FIXTURE_TIMESTAMP
		}

		return {
			status: 201,
			body: {
				data: toOrderView(order),
				inventoryCheck: { ...inventoryCheck, reservation: 'confirmed' },
				location: `/api/orders/${NEXT_ORDER_ID}`
			}
		}
	},

	// Laravel: read-only analytics
	salesReport: (ctx) => {
		const from = ctx.queryParams.from?.trim() ?? ''
		const to = ctx.queryParams.to?.trim() ?? ''
		const groupBy = ctx.queryParams.groupBy?.trim() || 'month'
		const errors: FieldError[] = []

		if (!DATE_PATTERN.test(from)) {
			errors.push({ field: 'from', code: 'invalid_type' })
		}

		if (!DATE_PATTERN.test(to)) {
			errors.push({ field: 'to', code: 'invalid_type' })
		}

		if (!errors.length && from > to) {
			errors.push({ field: 'to', code: 'out_of_range' })
		}

		if (groupBy !== 'day' && groupBy !== 'month') {
			errors.push({ field: 'groupBy', code: 'out_of_range' })
		}

		if (errors.length) {
			return badRequest(errors)
		}

		const series = (groupBy === 'day' ? salesByDay : salesByMonth).filter((row) => {
			const length = row.period.length

			return row.period >= from.slice(0, length) && row.period <= to.slice(0, length)
		})

		return {
			status: 200,
			body: {
				data: {
					from,
					to,
					groupBy,
					series,
					totals: {
						orders: series.reduce((sum, row) => sum + row.orders, 0),
						revenue: round2(series.reduce((sum, row) => sum + row.revenue, 0))
					}
				}
			}
		}
	},
	inventoryReport: (ctx) => {
		const lowStockOnly = ctx.queryParams.lowStockOnly?.trim() || 'false'

		if (lowStockOnly !== 'true' && lowStockOnly !== 'false') {
			return badRequest([{ field: 'lowStockOnly', code: 'invalid_type' }])
		}

		const items = products
			.filter((product) => lowStockOnly === 'false' || product.stock <= LOW_STOCK_THRESHOLD)
			.map((product) => ({
				productId: product.id,
				sku: product.sku,
				stock: product.stock,
				level: product.stock === 0
					? 'out_of_stock'
					: product.stock <= LOW_STOCK_THRESHOLD ? 'low' : 'ok'
			}))

		return {
			status: 200,
			body: {
				data: {
					lowStockThreshold: LOW_STOCK_THRESHOLD,
					totalUnits: products.reduce((sum, product) => sum + product.stock, 0),
					items
				}
			}
		}
	},
	ordersReport: (ctx) => {
		const filtered = filterOrdersByStatus(ctx.queryParams.status)

		if ('errors' in filtered) {
			return badRequest(filtered.errors)
		}

		const totals = filtered.orders.map(getOrderTotal)
		const revenue = round2(totals.reduce((sum, total) => sum + total, 0))

		return {
			status: 200,
			body: {
				data: {
					totalOrders: filtered.orders.length,
					revenue,
					averageOrderValue: totals.length ? round2(revenue / totals.length) : 0,
					byStatus: ORDER_STATUSES.map((status) => ({
						status,
						count: filtered.orders.filter((order) => order.status === status).length
					}))
				}
			}
		}
	}
}

// Deterministic pseudo latency derived from the request, not a real measurement.
const getSimulatedDuration = (endpoint: Endpoint, url: string): number => {
	let hash = 0

	for (const char of `${endpoint.method} ${url}`) {
		hash = (hash * 31 + char.charCodeAt(0)) % 9973
	}

	return BASE_LATENCY_MS[endpoint.apiId] + (hash % 70)
}

export const simulateResponse = (
	endpoint: Endpoint,
	input: RequestInput,
	url: string
): SimulatedResponse => {
	const parsedBody = endpoint.defaultBody !== undefined ? parseJson(input.body) : null
	const result = handlers[endpoint.id]({
		pathParams: input.pathParams,
		queryParams: input.queryParams,
		body: parsedBody?.ok ? parsedBody.value : undefined
	})

	return {
		status: result.status,
		body: result.body,
		durationMs: getSimulatedDuration(endpoint, url)
	}
}
