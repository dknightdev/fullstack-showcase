import type { ApiId } from '../types'

export const API_BASE_URLS: Record<ApiId, string> = {
	dotnet: 'https://products-api.showcase.example',
	nestjs: 'https://orders-api.showcase.example',
	laravel: 'https://reports-api.showcase.example'
}
