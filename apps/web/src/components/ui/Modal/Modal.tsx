import { useEffect, type MouseEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TbX } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'
import styles from './Modal.module.css'

type ModalProps = {
	isOpen: boolean
	onClose: () => void
	title?: string
	children: ReactNode
	size?: 'default' | 'fullscreen'
}

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	size = 'default'
}: ModalProps) => {
	const { t } = useTranslation()

	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

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
					className={`${styles.overlay} ${size === 'fullscreen' ? styles.fullscreenOverlay : ''}`}
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
						className={`${styles.modal} ${size === 'fullscreen' ? styles.fullscreenModal : ''}`}
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
							: t('ui.modal.dialog')
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
						<header
							className={`${styles.header} ${size === 'fullscreen' ? styles.fullscreenHeader : ''}`}
						>
							{title && (
								<h2 id='modal-title'>
									{title}
								</h2>
							)}

							<Button
								variant='icon'
								className={size === 'fullscreen' ? styles.fullscreenClose : undefined}
								onClick={onClose}
								aria-label={t('ui.modal.close')}
								title={t('ui.modal.close')}
								autoFocus
							>
								<AppIcon icon={TbX} />
							</Button>
						</header>

						<div
							className={`${styles.content} ${size === 'fullscreen' ? styles.fullscreenContent : ''}`}
						>
							{children}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default Modal
