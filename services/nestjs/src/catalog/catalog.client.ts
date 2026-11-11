import { Injectable, Logger } from '@nestjs/common'
import { CatalogError, type Catalog, type CatalogProduct } from './catalog.contract'
import type { MovementKind } from '@/orders/movements/movement.types'

@Injectable()
export class CatalogClient implements Catalog {
	private readonly logger = new Logger(CatalogClient.name)
	private readonly baseUrl: string
	private readonly timeout: number

	constructor() {
		const url = process.env.CATALOG_API_URL
		if (!url) throw new Error('CATALOG_API_URL es obligatorio')

		const parsed = new URL(url)
		if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('CATALOG_API_URL debe usar HTTP o HTTPS')

		this.baseUrl = url.replace(/\/+$/, '')
		this.timeout = Number(process.env.CATALOG_TIMEOUT_MS ?? '5000')

		if (!Number.isSafeInteger(this.timeout) || this.timeout < 1) throw new Error('CATALOG_TIMEOUT_MS debe ser un entero positivo')
	}

	private async request(path: string, init?: RequestInit): Promise<Response> {
		try {
			return await fetch(`${this.baseUrl}${path}`, {
				...init,
				signal: AbortSignal.timeout(this.timeout)
			})
		} catch (error) {
			const timedOut = error instanceof Error && error.name === 'TimeoutError'
			this.logger.warn(`Fallo en la solicitud al catálogo: ${error instanceof Error ? error.message : 'error de red'}`)

			throw new CatalogError('Fallo en la solicitud al catálogo o tiempo de espera agotado', 'uncertain', undefined, timedOut)
		}
	}

	async getProduct(id: number): Promise<CatalogProduct> {
		const response = await this.request(`/api/products/${id}`)

		if (!response.ok) {
			throw new CatalogError('Fallo al consultar el producto en el catálogo', 'failed', response.status)
		}

		try {
			return await response.json() as CatalogProduct
		} catch {
			throw new CatalogError('Respuesta inválida del producto del catálogo', 'failed', response.status)
		}
	}

	async moveStock(id: number, quantity: number, kind: MovementKind): Promise<void> {
		const action = kind === 'Decrease' ? 'decrease' : 'increase'

		const response = await this.request(`/api/products/${id}/stock/${action}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ quantity })
		})

		if (response.ok) return

		if (response.status >= 400 && response.status < 500) {
			throw new CatalogError('El catálogo rechazó el movimiento de inventario', 'failed', response.status)
		}

		throw new CatalogError('Respuesta inesperada del movimiento de inventario', 'uncertain', response.status)
	}
}
