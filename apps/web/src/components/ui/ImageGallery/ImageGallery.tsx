import { useEffect, useRef, useState, type MouseEvent, type UIEvent } from 'react'
import { useTranslation } from 'react-i18next'

import {
	TbChevronLeft,
	TbChevronRight
} from 'react-icons/tb'

import AppIcon from '@/components/ui/AppIcon/AppIcon'

import styles from './ImageGallery.module.css'

type ImageGalleryProps = {
	images: string[]
	alt: string
	mode?: 'preview' | 'carousel' | 'fullscreen'
	initialIndex?: number
	onOpen?: (index: number) => void
}

const IMAGE_WIDTH = 1920
const IMAGE_HEIGHT = 1080

const ImageGallery = ({
	images,
	alt,
	mode = 'preview',
	initialIndex = 0,
	onOpen
}: ImageGalleryProps) => {
	const { t } = useTranslation()
	const [currentIndex, setCurrentIndex] = useState(initialIndex)
	const imageViewportRef = useRef<HTMLDivElement>(null)

	const hasMultipleImages = images.length > 1
	const isPreview = mode === 'preview'
	const safeInitialIndex = Math.min(initialIndex, images.length - 1)

	useEffect(() => {
		const viewport = imageViewportRef.current
		if (!viewport || safeInitialIndex <= 0) return

		viewport.scrollTo({
			left: safeInitialIndex * viewport.clientWidth,
			behavior: 'auto'
		})
	}, [safeInitialIndex])

	const previousImage = () => {
		const index = currentIndex === 0
			? images.length - 1
			: currentIndex - 1

		imageViewportRef.current?.scrollTo({
			left: index * imageViewportRef.current.clientWidth,
			behavior: 'smooth'
		})
	}

	const nextImage = () => {
		const index = currentIndex === images.length - 1
			? 0
			: currentIndex + 1

		imageViewportRef.current?.scrollTo({
			left: index * imageViewportRef.current.clientWidth,
			behavior: 'smooth'
		})
	}

	const handleImageScroll = (event: UIEvent<HTMLDivElement>) => {
		const viewport = event.currentTarget
		if (!viewport.clientWidth) return

		const index = Math.round(viewport.scrollLeft / viewport.clientWidth)

		setCurrentIndex(index)
	}

	useEffect(() => {
		if (mode !== 'fullscreen') return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				event.preventDefault()
				previousImage()
			}

			if (event.key === 'ArrowRight') {
				event.preventDefault()
				nextImage()
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [mode, images.length, currentIndex])

	const handleImageClick = (
		event: MouseEvent<HTMLButtonElement>
	) => {
		if (!isPreview) return

		event.stopPropagation()
		onOpen?.(currentIndex)
	}

	return (
		<div
			className={`${styles.gallery} ${styles[mode]}`}
		>
			{isPreview ? (
				<div
					ref={imageViewportRef}
					className={styles.image}
					onScroll={handleImageScroll}
				>
					{images.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type='button'
							className={styles.slide}
							onClick={handleImageClick}
							aria-label={t('ui.imageGallery.openImages', { alt })}
						>
							<img
								src={image}
								width={IMAGE_WIDTH}
								height={IMAGE_HEIGHT}
								loading='lazy'
								decoding='async'
								alt={t('ui.imageGallery.imageAlt', {
									alt,
									index: index + 1
								})}
							/>
						</button>
					))}
				</div>
			) : (
				<div
					ref={imageViewportRef}
					className={styles.image}
					onScroll={handleImageScroll}
				>
					{images.map((image, index) => (
						<div
							key={`${image}-${index}`}
							className={styles.slide}
						>
							<img
								src={image}
								width={IMAGE_WIDTH}
								height={IMAGE_HEIGHT}
								loading='lazy'
								decoding='async'
								alt={t('ui.imageGallery.imageAlt', {
									alt,
									index: index + 1
								})}
							/>
						</div>
					))}
				</div>
			)}

			{!isPreview && hasMultipleImages && (
				<>
					<button
						type='button'
						className={`${styles.navigation} ${styles.previous}`}
						onClick={previousImage}
						aria-label={t('ui.imageGallery.previousImage')}
					>
						<AppIcon
							icon={TbChevronLeft}
							size={24}
						/>
					</button>

					<button
						type='button'
						className={`${styles.navigation} ${styles.next}`}
						onClick={nextImage}
						aria-label={t('ui.imageGallery.nextImage')}
					>
						<AppIcon
							icon={TbChevronRight}
							size={24}
						/>
					</button>

					<span className={styles.counter}>
						{currentIndex + 1} / {images.length}
					</span>
				</>
			)}
		</div>
	)
}

export default ImageGallery
