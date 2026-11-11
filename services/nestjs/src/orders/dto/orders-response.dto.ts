import { ApiProperty } from '@nestjs/swagger'
import { OrderStatus } from '@prisma/client'

export class OrderItemResponse {
	@ApiProperty({ example: 1 })
	productId!: number

	@ApiProperty({ example: '27" Monitor' })
	productName!: string

	@ApiProperty({ example: 'MN-003' })
	sku!: string

	@ApiProperty({ example: 2 })
	quantity!: number

	@ApiProperty({ type: String, example: '89.90' })
	unitPrice!: string

	@ApiProperty({ type: String, example: '179.80' })
	subtotal!: string
}

export class OrderResponse {
	@ApiProperty({ type: String, format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
	id!: string

	@ApiProperty({ enum: OrderStatus })
	status!: OrderStatus

	@ApiProperty({ type: String, example: '179.80' })
	total!: string

	@ApiProperty({ type: String, format: 'date-time' })
	createdAt!: Date

	@ApiProperty({ type: String, format: 'date-time' })
	updatedAt!: Date

	@ApiProperty({ type: [OrderItemResponse] })
	items!: OrderItemResponse[]
}

export class OrderPageResponse {
	@ApiProperty({ type: [OrderResponse] })
	items!: OrderResponse[]

	@ApiProperty({ example: 1 })
	currentPage!: number

	@ApiProperty({ example: 10 })
	pageSize!: number

	@ApiProperty({ example: 25 })
	totalCount!: number

	@ApiProperty({ example: 3 })
	totalPages!: number
}
