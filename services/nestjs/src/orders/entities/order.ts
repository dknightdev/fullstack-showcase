import { DomainValidationError } from '../../common/errors/domain-validation.error'
import { InvalidOrderTransitionError } from '../errors/invalid-order-transition.error'
import { OrderItem } from './order-item'

export type OrderStatus = 'Pending' | 'Confirmed' | 'Rejected'

export interface OrderProps {
	id: string
	status: OrderStatus
	items: OrderItem[]
	createdAt: Date
	updatedAt: Date
}

export class Order {
	private readonly _id: string
	private _status: OrderStatus
	private readonly _items: OrderItem[]
	private readonly _total: string
	private readonly _createdAt: Date
	private _updatedAt: Date

	private constructor(props: OrderProps) {
		const errors: Record<string, string[]> = {}

		if (!props.id.trim()) {
			errors.id = ['El identificador del pedido es obligatorio.']
		}

		if (props.items.length === 0) {
			errors.items = ['El pedido debe contener al menos un producto.']
		}

		if (Object.keys(errors).length > 0) {
			throw new DomainValidationError(errors)
		}

		this._id = props.id
		this._status = props.status
		this._items = [...props.items]
		this._total = this.calculateTotal()
		this._createdAt = props.createdAt
		this._updatedAt = props.updatedAt
	}

	static create(id: string, items: OrderItem[]): Order {
		const now = new Date()

		return new Order({
			id,
			status: 'Pending',
			items,
			createdAt: now,
			updatedAt: now
		})
	}

	static reconstitute(props: OrderProps): Order {
		return new Order(props)
	}

	get id(): string {
		return this._id
	}

	get status(): OrderStatus {
		return this._status
	}

	get items(): readonly OrderItem[] {
		return this._items
	}

	get total(): string {
		return this._total
	}

	get createdAt(): Date {
		return this._createdAt
	}

	get updatedAt(): Date {
		return this._updatedAt
	}

	confirm(): void {
		this.assertTransition('Confirmed')
		this._status = 'Confirmed'
		this._updatedAt = new Date()
	}

	reject(): void {
		this.assertTransition('Rejected')
		this._status = 'Rejected'
		this._updatedAt = new Date()
	}

	private assertTransition(to: OrderStatus): void {
		const transitions: Record<OrderStatus, readonly OrderStatus[]> = {
			Pending: ['Confirmed', 'Rejected'],
			Confirmed: [],
			Rejected: []
		}

		if (!transitions[this._status].includes(to)) {
			throw new InvalidOrderTransitionError(this._status, to)
		}
	}

	private calculateTotal(): string {
		const cents = this._items.reduce((total, item) => {
			const [whole, decimal] = item.subtotal.split('.')
			return total + BigInt(whole) * 100n + BigInt(decimal)
		}, 0n)

		return `${cents / 100n}.${(cents % 100n).toString().padStart(2, '0')}`
	}
}
