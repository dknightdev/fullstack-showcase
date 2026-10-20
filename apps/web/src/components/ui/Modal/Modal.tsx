import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TbX } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'
import { motionConfig } from '@/config/motion'
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
	const onCloseRef = useRef(onClose)
	const closedByPopStateRef = useRef(false)
	const pendingBackRef = useRef<number | null>(null)

	useEffect(() => {
		onCloseRef.current = onClose
	}, [onClose])

	useEffect(() => {
		if (!isOpen) return

		closedByPopStateRef.current = false

		if (pendingBackRef.current !== null) {
			window.clearTimeout(pendingBackRef.current)
			pendingBackRef.current = null
		} else {
			window.history.pushState({ modal: true }, '')
		}

		const handlePopState = () => {
			closedByPopStateRef.current = true
			onCloseRef.current()
		}

		window.addEventListener('popstate', handlePopState)

		return () => {
			window.removeEventListener('popstate', handlePopState)

			if (!closedByPopStateRef.current) {
				pendingBackRef.current = window.setTimeout(() => {
					pendingBackRef.current = null
					window.history.back()
				}, 0)
			}
		}
	}, [isOpen])

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
					initial={{ opacity: motionConfig.opacity.hidden }}
					animate={{ opacity: motionConfig.opacity.visible }}
					exit={{ opacity: motionConfig.opacity.hidden }}
					transition={{
						duration: motionConfig.duration.normal,
						ease: motionConfig.ease
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
							opacity: motionConfig.opacity.hidden,
							y: motionConfig.distance.normal,
							scale: motionConfig.scale.modal
						}}
						animate={{
							opacity: motionConfig.opacity.visible,
							y: 0,
							scale: 1
						}}
						exit={{
							opacity: motionConfig.opacity.hidden,
							y: motionConfig.distance.normal,
							scale: motionConfig.scale.modal
						}}
						transition={{
							duration: motionConfig.duration.normal,
							ease: motionConfig.ease
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
							data-lenis-prevent
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
