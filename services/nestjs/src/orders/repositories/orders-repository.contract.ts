
import { Order } from '../entities/order'
import type { OrderStatus } from '../entities/order'
import type { MovementKind, MovementOutcome } from '../movements/movement.types'

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY')

export type OrderSortBy = 'createdAt' | 'total'
export type OrderSortDirection = 'asc' | 'desc'

export interface OrderListFilters {
	page: number
	pageSize: number
	status?: OrderStatus
	sortBy: OrderSortBy
	sortDirection: OrderSortDirection
	fromDate?: Date
	toDate?: Date
}

export interface OrdersRepository {
	create(order: Order): Promise<Order>
	find(id: string): Promise<Order | null>
	list(filters: OrderListFilters): Promise<{ items: Order[], totalCount: number }>
	save(order: Order): Promise<void>
	startMovement(orderId: string, productId: number, quantity: number, kind: MovementKind): Promise<number>
	finishMovement(id: number, status: MovementOutcome, detail?: string): Promise<void>
}
