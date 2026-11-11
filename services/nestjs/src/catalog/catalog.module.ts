import { Module } from '@nestjs/common'
import { CatalogClient } from './catalog.client'
import { CATALOG } from './catalog.contract'

@Module({
	providers: [
		{
			provide: CATALOG,
			useClass: CatalogClient
		}
	],
	exports: [CATALOG]
})

export class CatalogModule {}
