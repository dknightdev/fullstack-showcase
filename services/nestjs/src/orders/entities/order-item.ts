import { DomainValidationError } from '../../common/errors/domain-validation.error'

export interface OrderItemProps {
	productId: number
	productName: string
	sku: string
	quantity: number
	unitPrice: string
}

export class OrderItem {
	readonly productId: number
	readonly productName: string
	readonly sku: string
	readonly quantity: number
	readonly unitPrice: string

	constructor(props: OrderItemProps) {
		const errors: Record<string, string[]> = {}

		const addError = (field: string, message: string) => {
			if (!errors[field]) {
				errors[field] = []
			}

			errors[field].push(message)
		}

		if (!Number.isSafeInteger(props.productId) || props.productId <= 0) {
			addError('productId', 'El identificador del producto debe ser un entero positivo.')
		}

		if (!props.productName.trim()) {
			addError('productName', 'El nombre del producto es obligatorio.')
		}

		if (!props.sku.trim()) {
			addError('sku', 'El SKU del producto es obligatorio.')
		}

		if (!Number.isSafeInteger(props.quantity) || props.quantity <= 0) {
			addError('quantity', 'La cantidad debe ser un entero positivo.')
		}

		if (!/^\d+\.\d{2}$/.test(props.unitPrice)) {
			addError('unitPrice', 'El precio debe tener exactamente dos decimales.')
		}

		if (Object.keys(errors).length > 0) {
			throw new DomainValidationError(errors)
		}

		this.productId = props.productId
		this.productName = props.productName
		this.sku = props.sku
		this.quantity = props.quantity
		this.unitPrice = props.unitPrice
	}

	get subtotal(): string {
		const [whole, decimal] = this.unitPrice.split('.')
		const cents = (BigInt(whole) * 100n + BigInt(decimal)) * BigInt(this.quantity)

		return `${cents / 100n}.${(cents % 100n).toString().padStart(2, '0')}`
	}
}
