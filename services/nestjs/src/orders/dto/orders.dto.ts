
import { Type } from 'class-transformer'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsEnum, IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { OrderStatus } from '@prisma/client'

export enum OrderSortBy {
	CreatedAt = 'createdAt',
	Total = 'total'
}

export enum OrderSortDirection {
	Asc = 'asc',
	Desc = 'desc'
}

export class OrderItemInput {
	@ApiProperty({ minimum: 1, example: 1 })
	@IsInt()
	@Min(1)
	@Max(2147483647)
	productId!: number

	@ApiProperty({ minimum: 1, maximum: 5000, example: 2 })
	@IsInt()
	@Min(1)
	@Max(5000)
	quantity!: number
}

export class CreateOrderDto {
	@ApiProperty({ type: [OrderItemInput], minItems: 1, maxItems: 100 })
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(100)
	@ValidateNested({ each: true })
	@Type(() => OrderItemInput)
	items!: OrderItemInput[]
}

export class ListOrdersDto {
	@ApiPropertyOptional({ type: Number, minimum: 1, default: 1, example: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(1000000)
	page = 1

	@ApiPropertyOptional({ type: Number, minimum: 1, maximum: 100, default: 10, example: 10 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	pageSize = 10

	@ApiPropertyOptional({ enum: OrderStatus })
	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus

	@ApiPropertyOptional({ enum: OrderSortBy, default: OrderSortBy.CreatedAt })
	@IsOptional()
	@IsEnum(OrderSortBy)
	sortBy = OrderSortBy.CreatedAt

	@ApiPropertyOptional({ enum: OrderSortDirection, default: OrderSortDirection.Desc })
	@IsOptional()
	@IsEnum(OrderSortDirection)
	sortDirection = OrderSortDirection.Desc

	@ApiPropertyOptional({
		type: String,
		format: 'date-time',
		example: '2026-11-01T00:00:00.000Z',
		description: 'Fecha inicial de creación de los pedidos (inclusive).'
	})
	@IsOptional()
	@IsDateString({ strict: true })
	fromDate?: string

	@ApiPropertyOptional({
		type: String,
		format: 'date-time',
		example: '2026-11-10T23:59:59.999Z',
		description: 'Fecha final de creación de los pedidos (inclusive).'
	})
	@IsOptional()
	@IsDateString({ strict: true })
	toDate?: string
}
