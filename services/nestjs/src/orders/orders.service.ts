
import { randomUUID } from 'node:crypto'
import { BadGatewayException, BadRequestException, ConflictException, GatewayTimeoutException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CatalogError, type Catalog, CATALOG } from '../catalog/catalog.contract'
import type { MovementKind } from '@/orders/movements/movement.types'
import { ORDERS_REPOSITORY, type OrdersRepository } from './repositories/orders-repository.contract'
import { Order } from './entities/order'
import { OrderItem } from './entities/order-item'
import type { CreateOrderDto, ListOrdersDto } from './dto/orders.dto'
import { OrderResponseMapper } from './mappers/order-response.mapper'

@Injectable()
export class OrdersService {
	constructor(
		@Inject(ORDERS_REPOSITORY) private readonly ordersRepository: OrdersRepository,
		@Inject(CATALOG) private readonly catalog: Catalog
	) {}

	async create(request: CreateOrderDto) {
		if (new Set(request.items.map(item => item.productId)).size !== request.items.length) {
			throw new BadRequestException('No se permiten IDs de producto duplicados')
		}

		const orderItems: OrderItem[] = []

		for (const item of request.items) {
			let product

			try {
				product = await this.catalog.getProduct(item.productId)
			} catch (error) {
				if (error instanceof CatalogError) {
					if (error.httpStatus === 404) throw new NotFoundException(`Producto ${item.productId} inexistente`)
					if (error.timedOut) throw new GatewayTimeoutException('Tiempo de espera agotado al consultar el catálogo')
					throw new BadGatewayException('Error al consultar el catálogo')
				}

				throw error
			}

			if (!product.isActive) throw new ConflictException(`Producto ${item.productId} inactivo`)
			if (product.stockQuantity < item.quantity) throw new ConflictException(`Stock insuficiente para el producto ${item.productId}`)

			orderItems.push(new OrderItem({
				productId: item.productId,
				productName: product.name,
				sku: product.sku,
				quantity: item.quantity,
				unitPrice: product.price.toFixed(2)
			}))
		}

		const order = Order.create(randomUUID(), orderItems)
		const savedOrder = await this.ordersRepository.create(order)

		const deductedItems: OrderItem[] = []
		let failure: 'Failed' | 'Uncertain' | null = null

		for (const item of savedOrder.items) {
			const outcome = await this.move(savedOrder.id, item.productId, item.quantity, 'Decrease')

			if (outcome !== 'Succeeded') {
				failure = outcome
				break
			}

			deductedItems.push(item)
		}

		if (failure) {
			let compensationSucceeded = true

			for (const item of [...deductedItems].reverse()) {
				const outcome = await this.move(savedOrder.id, item.productId, item.quantity, 'Restore')

				if (outcome !== 'Succeeded') {
					compensationSucceeded = false
				}
			}

			if (failure === 'Failed' && compensationSucceeded) {
				savedOrder.reject()
			}
		} else {
			savedOrder.confirm()
		}

		await this.ordersRepository.save(savedOrder)

		return OrderResponseMapper.toResponse(savedOrder)
	}

	async get(id: string) {
		const order = await this.ordersRepository.find(id)

		if (!order) throw new NotFoundException(`Pedido ${id} inexistente`)

		return OrderResponseMapper.toResponse(order)
	}

	async list(query: ListOrdersDto) {
		const fromDate = query.fromDate ? new Date(query.fromDate) : undefined
		const toDate = query.toDate ? new Date(query.toDate) : undefined

		if (fromDate && toDate && fromDate > toDate) {
			throw new BadRequestException('La fecha de inicio no puede ser posterior a la fecha de fin')
		}

		const { items, totalCount } = await this.ordersRepository.list({
			page: query.page,
			pageSize: query.pageSize,
			status: query.status,
			sortBy: query.sortBy,
			sortDirection: query.sortDirection,
			fromDate,
			toDate
		})

		return {
			items: items.map(item => OrderResponseMapper.toResponse(item)),
			currentPage: query.page,
			pageSize: query.pageSize,
			totalCount,
			totalPages: Math.ceil(totalCount / query.pageSize)
		}
	}

	private async move(orderId: string, productId: number, quantity: number, kind: MovementKind) {
		const movementId = await this.ordersRepository.startMovement(orderId, productId, quantity, kind)

		let outcome: 'Succeeded' | 'Failed' | 'Uncertain' = 'Succeeded'
		let detail: string | undefined

		try {
			await this.catalog.moveStock(productId, quantity, kind)
		} catch (error) {
			if (error instanceof CatalogError) {
				outcome = error.outcome === 'failed' ? 'Failed' : 'Uncertain'
				detail = error.httpStatus ? `Catalog HTTP ${error.httpStatus}` : error.message
			} else {
				throw error
			}
		}

		await this.ordersRepository.finishMovement(movementId, outcome, detail)

		return outcome
	}
}
