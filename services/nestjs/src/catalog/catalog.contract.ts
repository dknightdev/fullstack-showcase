import { MovementKind } from "@/orders/movements/movement.types"

export type CatalogProduct = {
	id: number
	name: string
	sku: string
	price: number
	stockQuantity: number
	isActive: boolean
}

export class CatalogError extends Error {
	constructor(message: string, readonly outcome: 'failed' | 'uncertain', readonly httpStatus?: number, readonly timedOut = false) {
		super(message)
		this.name = CatalogError.name
	}
}

export const CATALOG = Symbol('CATALOG')

export interface Catalog {
	getProduct(id: number): Promise<CatalogProduct>
	moveStock(id: number, quantity: number, kind: MovementKind): Promise<void>
}
