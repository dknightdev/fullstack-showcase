
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common'
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { OrdersService } from './orders.service'
import { CreateOrderDto, ListOrdersDto } from './dto/orders.dto'
import { OrderPageResponse, OrderResponse } from './dto/orders-response.dto'

@ApiTags('Orders')
@Controller('api/orders')
export class OrdersController {
	constructor(private readonly orders: OrdersService) {}

	@Post()
	@ApiOperation({
		summary: 'Crea y procesa un pedido',
		description: 'El pedido puede quedar Confirmed, Rejected o Pending si requiere conciliación.'
	})
	@ApiCreatedResponse({ description: 'Pedido creado y procesado', type: OrderResponse })
	@ApiBadRequestResponse({ description: 'Datos inválidos' })
	@ApiNotFoundResponse({ description: 'Producto inexistente' })
	@ApiConflictResponse({ description: 'Producto inactivo o inventario insuficiente' })
	create(@Body() request: CreateOrderDto) {
		return this.orders.create(request)
	}

	@Get()
	@ApiOperation({ summary: 'Lista pedidos con filtros, ordenamiento y paginación' })
	@ApiOkResponse({ description: 'Página de pedidos', type: OrderPageResponse })
	@ApiBadRequestResponse({ description: 'Parámetros inválidos' })
	list(@Query() query: ListOrdersDto) {
		return this.orders.list(query)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Consulta un pedido' })
	@ApiOkResponse({ description: 'Pedido encontrado', type: OrderResponse })
	@ApiBadRequestResponse({ description: 'Identificador UUID inválido' })
	@ApiNotFoundResponse({ description: 'Pedido inexistente' })
	get(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
		return this.orders.get(id)
	}
}
