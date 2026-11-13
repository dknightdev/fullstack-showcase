export interface SecurityConfig {
	cors: {
		allowedOrigins: string[];
	};
	rateLimit: {
		maxRequests: number;
		windowMs: number;
	};
	requestLimits: {
		maxBodySize: string;
	};
}

export function getSecurityConfig(): SecurityConfig {
	const env = process.env.NODE_ENV ?? 'development';

	if (env === 'development') {
		return {
			cors: {
				allowedOrigins: ['http://localhost:3000', 'http://localhost:5173']
			},
			rateLimit: {
				maxRequests: 1000,
				windowMs: 60 * 1000
			},
			requestLimits: {
				maxBodySize: '10mb'
			}
		};
	}

	return {
		cors: {
			allowedOrigins: [
				'https://dubancaballero.dev',
				'https://www.dubancaballero.dev'
			]
		},
		rateLimit: {
			maxRequests: 100,
			windowMs: 60 * 1000
		},
		requestLimits: {
			maxBodySize: '1mb'
		}
	};
}
