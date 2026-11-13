import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class HealthService {
	constructor(private readonly prisma: PrismaService) {}

	async checkReadiness() {
		try {
			await this.prisma.$queryRaw`SELECT 1`;
			return {
				status: 'ok',
				database: 'connected'
			};
		} catch {
			return {
				status: 'unavailable',
				database: 'disconnected'
			};
		}
	}
}
