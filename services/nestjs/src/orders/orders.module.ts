import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { PrismaOrdersRepository } from './repositories/orders.repository'
import { ORDERS_REPOSITORY } from './repositories/orders-repository.contract'
import { DatabaseModule } from '../database/database.module'
import { CatalogModule } from '../catalog/catalog.module'

@Module({
	imports: [DatabaseModule, CatalogModule],
	controllers: [OrdersController],
	providers: [
		OrdersService,
		{
			provide: ORDERS_REPOSITORY,
			useClass: PrismaOrdersRepository
		}
	]
})

export class OrdersModule {}
