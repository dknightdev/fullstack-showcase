
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type { OrderStatus } from '../entities/order'
import { Order } from '../entities/order'
import { OrderItem } from '../entities/order-item'
import type { MovementKind, MovementOutcome } from '../movements/movement.types'
import type { OrderListFilters, OrdersRepository } from './orders-repository.contract'
import { PrismaService } from '../../database/prisma.service'

const includeOrder = { items: { orderBy: { id: 'asc' as const } } }
type PersistedOrder = Prisma.OrderGetPayload<{ include: typeof includeOrder }>

function toDomain(order: PersistedOrder): Order {
	return Order.reconstitute({
		id: order.id,
		status: order.status as OrderStatus,
		items: order.items.map(item => new OrderItem({
			productId: item.productId,
			productName: item.name,
			sku: item.sku,
			quantity: item.quantity,
			unitPrice: item.unitPrice.toFixed(2)
		})),
		createdAt: order.createdAt,
		updatedAt: order.updatedAt
	})
}

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
	constructor(private readonly db: PrismaService) {}

	async create(order: Order): Promise<Order> {
		const persisted = await this.db.order.create({
			data: {
				id: order.id,
				status: order.status,
				total: order.total,
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
				items: {
					create: order.items.map(item => ({
						productId: item.productId,
						name: item.productName,
						sku: item.sku,
						quantity: item.quantity,
						unitPrice: item.unitPrice
					}))
				}
			},
			include: includeOrder
		})

		return toDomain(persisted)
	}

	async find(id: string): Promise<Order | null> {
		const order = await this.db.order.findUnique({
			where: { id },
			include: includeOrder
		})

		return order ? toDomain(order) : null
	}

	async list(filters: OrderListFilters): Promise<{ items: Order[], totalCount: number }> {
		const where: Prisma.OrderWhereInput = {
			...(filters.status && { status: filters.status }),
			...((filters.fromDate || filters.toDate) && {
				createdAt: {
					...(filters.fromDate && { gte: filters.fromDate }),
					...(filters.toDate && { lte: filters.toDate })
				}
			})
		}

		const orderBy: Prisma.OrderOrderByWithRelationInput[] = [
			{ [filters.sortBy]: filters.sortDirection },
			{ id: 'desc' }
		]

		const [items, totalCount] = await this.db.$transaction([
			this.db.order.findMany({
				where,
				include: includeOrder,
				orderBy,
				skip: (filters.page - 1) * filters.pageSize,
				take: filters.pageSize
			}),
			this.db.order.count({ where })
		])

		return { items: items.map(toDomain), totalCount }
	}

	async save(order: Order): Promise<void> {
		await this.db.order.update({
			where: { id: order.id },
			data: {
				status: order.status,
				updatedAt: order.updatedAt
			}
		})
	}

	async startMovement(orderId: string, productId: number, quantity: number, kind: MovementKind): Promise<number> {
		const movement = await this.db.inventoryMovement.create({
			data: {
				orderId,
				productId,
				quantity,
				kind,
				status: 'Started'
			}
		})

		return movement.id
	}

	async finishMovement(id: number, status: MovementOutcome, detail?: string): Promise<void> {
		await this.db.inventoryMovement.update({
			where: { id },
			data: { status, detail }
		})
	}
}
