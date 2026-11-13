import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { OrdersModule } from './orders/orders.module'
import { getSecurityConfig } from './config/security.config'

const securityConfig = getSecurityConfig()

@Module({
	imports: [
		OrdersModule,
		ThrottlerModule.forRoot([
			{
				ttl: securityConfig.rateLimit.windowMs,
				limit: securityConfig.rateLimit.maxRequests
			}
		])
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})

export class AppModule {}
