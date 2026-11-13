import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get()
	@HttpCode(200)
	@ApiOperation({ summary: 'Health check', description: 'Returns if the API is running' })
	@ApiResponse({
		status: 200,
		description: 'API is healthy',
		schema: {
			properties: {
				status: { type: 'string', example: 'ok' }
			}
		}
	})
	getHealth() {
		return { status: 'ok' };
	}

	@Get('ready')
	@HttpCode(200)
	@ApiOperation({ summary: 'Readiness check', description: 'Returns if the API and database are ready' })
	@ApiResponse({
		status: 200,
		description: 'API and database are ready',
		schema: {
			properties: {
				status: { type: 'string', example: 'ok' },
				database: { type: 'string', example: 'connected' }
			}
		}
	})
	@ApiResponse({
		status: 503,
		description: 'Database is unavailable',
		schema: {
			properties: {
				status: { type: 'string', example: 'unavailable' },
				database: { type: 'string', example: 'disconnected' }
			}
		}
	})
	async getReady() {
		return this.healthService.checkReadiness();
	}
}
