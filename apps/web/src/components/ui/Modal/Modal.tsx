import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import styles from './Modal.module.css'

type ModalProps = {
	isOpen: boolean
	onClose: () => void
	title?: string
	children: ReactNode
}

const Modal = ({
	isOpen,
	onClose,
	title,
	children
}: ModalProps) => {
	const closeButtonRef = useRef<HTMLButtonElement | null>(null)

	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		requestAnimationFrame(() => {
			closeButtonRef.current?.focus()
		})

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className={styles.overlay}
					onMouseDown={handleBackdropClick}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{
						duration: 0.3,
						ease: 'easeOut'
					}}
				>
					<motion.div
						className={styles.modal}
						role='dialog'
						aria-modal='true'
						aria-labelledby={
							title
								? 'modal-title'
								: undefined
						}
						aria-label={
							title
								? undefined
								: 'Ventana modal'
						}
						onMouseDown={(event) => {
							event.stopPropagation()
						}}
						initial={{
							opacity: 0,
							y: 20,
							scale: 0.97
						}}
						animate={{
							opacity: 1,
							y: 0,
							scale: 1
						}}
						exit={{
							opacity: 0,
							y: 20,
							scale: 0.97
						}}
						transition={{
							duration: 0.3,
							ease: [0.22, 1, 0.36, 1]
						}}
					>
						<header className={styles.header}>
							{title && (
								<h2 id='modal-title'>
									{title}
								</h2>
							)}

							<button
								ref={closeButtonRef}
								type='button'
								className={styles.close}
								onClick={onClose}
								aria-label='Cerrar ventana'
							>
								<span></span>
								<span></span>
							</button>
						</header>

						<div className={styles.content}>
							{children}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default Modal
