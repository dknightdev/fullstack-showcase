
import { Children, isValidElement, useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import AppIcon from '../AppIcon/AppIcon'
import { TbChevronDown } from 'react-icons/tb'

import styles from './Select.module.css'

type OptionProps = {
	value: string
	disabled?: boolean
	children: ReactNode
}

type SelectProps = {
	value: string
	onChange: (value: string) => void
	children: ReactNode
	className?: string
	placeholder?: string
	disabled?: boolean
}

const Select = ({
	value,
	onChange,
	children,
	className,
	placeholder = 'Select an option',
	disabled = false
}: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false)

	const containerRef = useRef<HTMLDivElement>(null)
	const id = useId()

	const options = Children.toArray(children)
		.filter(isValidElement)
		.map((option) => option as React.ReactElement<OptionProps>)

	const selectedOption = options.find((option) => option.props.value === value)

	const close = () => setIsOpen(false)

	const selectOption = (optionValue: string) => {
		onChange(optionValue)
		close()
	}

	useEffect(() => {
		if (!isOpen) return

		const handlePointerDown = (event: PointerEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				close()
			}
		}

		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === 'Escape') {
				close()
			}
		}

		document.addEventListener('pointerdown', handlePointerDown)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('pointerdown', handlePointerDown)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen])

	return (
		<div ref={containerRef} className={`${styles.container} ${className ?? ''}`}>
			<button
				type='button'
				className={styles.trigger}
				disabled={disabled}
				aria-haspopup='listbox'
				aria-expanded={isOpen}
				aria-controls={id}
				onClick={() => setIsOpen((open) => !open)}
			>
				<span className={selectedOption ? styles.value : styles.placeholder}>
					{selectedOption?.props.children ?? placeholder}
				</span>

				<AppIcon icon={TbChevronDown} size={15} />
			</button>

			{isOpen && (
				<div
					id={id}
					role='listbox'
					className={`${styles.options} custom-scroll`}
					data-lenis-prevent
				>
					{options.map((option) => {
						const optionValue = option.props.value
						const isSelected = optionValue === value
						const isDisabled = option.props.disabled

						return (
							<div
								key={optionValue}
								role='option'
								aria-selected={isSelected}
								aria-disabled={isDisabled}
								className={[
									styles.option,
									isSelected ? styles.selected : '',
									isDisabled ? styles.disabled : ''
								].filter(Boolean).join(' ')}
								onPointerDown={(event) => {
									event.preventDefault()

									if (!isDisabled) selectOption(optionValue)
								}}
							>
								{option.props.children}
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default Select
