
import { Order } from '../entities/order'
import { OrderResponse } from '../dto/orders-response.dto'

export class OrderResponseMapper {
	static toResponse(order: Order): OrderResponse {
		return {
			id: order.id,
			status: order.status,
			total: order.total,
			createdAt: order.createdAt,
			updatedAt: order.updatedAt,
			items: order.items.map(item => ({
				productId: item.productId,
				productName: item.productName,
				sku: item.sku,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				subtotal: item.subtotal
			}))
		}
	}
}
