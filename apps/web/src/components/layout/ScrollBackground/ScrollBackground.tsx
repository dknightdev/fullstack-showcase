
import { useEffect, useRef } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'

import styles from './ScrollBackground.module.css'
import { TABLET_QUERY } from '@/config/breakpoints'

type Particle = {
	x: number
	y: number
	vx: number
	vy: number
	radius: number
}

const MAX_PARTICLES = 90
const MAX_PARTICLES_MOBILE = 50
const CONNECTION_DISTANCE = 130
const CONNECTION_DISTANCE_MOBILE = 100
const MAX_PIXEL_RATIO = 1.5

const THEME_STYLES = {
	dark: { dotOpacity: 0.45, lineOpacity: 0.2, radiusBoost: 0 },
	light: { dotOpacity: 0.75, lineOpacity: 0.32, radiusBoost: 0.3 }
}

const getThemeStyle = () => {
	return document.documentElement.dataset.theme === 'light'
		? THEME_STYLES.light
		: THEME_STYLES.dark
}

const getAccentColor = () => {
	return getComputedStyle(document.documentElement)
		.getPropertyValue('--color-primary')
		.trim() || '#3b82f6'
}

const ScrollBackground = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const scrollProgressRef = useRef(0)

	const { scrollYProgress } = useScroll()

	useMotionValueEvent(scrollYProgress, 'change', (progress) => {
		scrollProgressRef.current = progress
	})

	useEffect(() => {
		const canvas = canvasRef.current

		if (!canvas) return

		const context = canvas.getContext('2d', { alpha: true })

		if (!context) return

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

		const particles: Particle[] = []

		let width = 0
		let height = 0
		let pixelRatio = 1
		let animationFrame = 0
		let isVisible = true
		let isPageVisible = !document.hidden
		let isReducedMotion = reducedMotion.matches
		let accentColor = getAccentColor()
		let themeStyle = getThemeStyle()
		let lastFrameTime = 0

		const resize = () => {
			const bounds = canvas.getBoundingClientRect()

			width = bounds.width
			height = bounds.height
			pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)

			canvas.width = Math.round(width * pixelRatio)
			canvas.height = Math.round(height * pixelRatio)

			context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

			const isMobile = window.matchMedia(TABLET_QUERY).matches
			const targetCount = isMobile
				? MAX_PARTICLES_MOBILE
				: MAX_PARTICLES

			while (particles.length < targetCount) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * 0.6,
					vy: (Math.random() - 0.5) * 0.6,
					radius: Math.random() * 1.2 + 0.7
				})
			}

			particles.length = Math.min(particles.length, targetCount)

			particles.forEach((particle) => {
				particle.x = Math.min(particle.x, width)
				particle.y = Math.min(particle.y, height)
			})

			draw()
		}

		const draw = () => {
			context.clearRect(0, 0, width, height)

			if (!width || !height) return

			const isMobile = window.matchMedia(TABLET_QUERY).matches
			const connectionDistance = isMobile
				? CONNECTION_DISTANCE_MOBILE
				: CONNECTION_DISTANCE

			const progress = isReducedMotion
				? 0
				: scrollProgressRef.current

			//* Mover según scroll.
			const angle = progress * 0.45
			const cos = Math.cos(angle)
			const sin = Math.sin(angle)
			const centerX = width / 2
			const centerY = height / 2
			const offsetX = progress * width * 0.07
			const offsetY = progress * height * 0.1

			const points = particles.map((particle) => {
				const x = particle.x - centerX
				const y = particle.y - centerY

				return {
					x: centerX + x * cos - y * sin + offsetX,
					y: centerY + x * sin + y * cos + offsetY,
					radius: particle.radius
				}
			})

			//* Conexiones.
			context.lineWidth = 0.7
			context.strokeStyle = accentColor

			for (let i = 0; i < points.length; i++) {
				for (let j = i + 1; j < points.length; j++) {
					const dx = points[i].x - points[j].x
					const dy = points[i].y - points[j].y
					const distanceSquared = dx * dx + dy * dy

					if (distanceSquared > connectionDistance ** 2) continue

					const distance = Math.sqrt(distanceSquared)
					const opacity = (1 - distance / connectionDistance) * themeStyle.lineOpacity

					context.globalAlpha = opacity
					context.beginPath()
					context.moveTo(points[i].x, points[i].y)
					context.lineTo(points[j].x, points[j].y)
					context.stroke()
				}
			}

			//* Puntos luminosos.
			context.fillStyle = accentColor

			for (const point of points) {
				context.globalAlpha = themeStyle.dotOpacity
				context.beginPath()
				context.arc(point.x, point.y, point.radius + themeStyle.radiusBoost, 0, Math.PI * 2)
				context.fill()
			}

			context.globalAlpha = 1
		}

		const animate = (time: number) => {
			animationFrame = 0

			if (!isVisible || !isPageVisible) return

			//* Limitar 30 FPS.
			if (time - lastFrameTime >= 1000 / 30) {
				lastFrameTime = time

				if (!isReducedMotion) {
					for (const particle of particles) {
						particle.x += particle.vx
						particle.y += particle.vy

						if (particle.x < 0 || particle.x > width) {
							particle.vx *= -1
							particle.x = Math.max(0, Math.min(width, particle.x))
						}

						if (particle.y < 0 || particle.y > height) {
							particle.vy *= -1
							particle.y = Math.max(0, Math.min(height, particle.y))
						}
					}
				}

				draw()
			}

			animationFrame = requestAnimationFrame(animate)
		}

		const startAnimation = () => {
			if (
				!isVisible ||
				!isPageVisible ||
				isReducedMotion ||
				animationFrame
			) {
				return
			}

			animationFrame = requestAnimationFrame(animate)
		}

		const stopAnimation = () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame)
				animationFrame = 0
			}
		}

		const updateMotionPreference = () => {
			isReducedMotion = reducedMotion.matches

			if (isReducedMotion) {
				stopAnimation()
				draw()
			} else {
				startAnimation()
			}
		}

		const handleVisibilityChange = () => {
			isPageVisible = !document.hidden

			if (isPageVisible) {
				startAnimation()
			} else {
				stopAnimation()
			}
		}

		const resizeObserver = new ResizeObserver(resize)

		resizeObserver.observe(canvas)

		const themeObserver = new MutationObserver(() => {
			accentColor = getAccentColor()
			themeStyle = getThemeStyle()
			draw()
		})

		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['style', 'class', 'data-accent', 'data-theme']
		})

		const intersectionObserver = new IntersectionObserver(([entry]) => {
			isVisible = entry.isIntersecting

			if (isVisible) {
				startAnimation()
			} else {
				stopAnimation()
			}
		})

		intersectionObserver.observe(canvas)

		document.addEventListener('visibilitychange', handleVisibilityChange)
		reducedMotion.addEventListener('change', updateMotionPreference)

		resize()

		if (!isReducedMotion) {
			startAnimation()
		}

		return () => {
			stopAnimation()
			resizeObserver.disconnect()
			themeObserver.disconnect()
			intersectionObserver.disconnect()

			document.removeEventListener('visibilitychange', handleVisibilityChange)

			reducedMotion.removeEventListener('change', updateMotionPreference)
		}
	}, [])

	return (
		<div className={styles.background} aria-hidden='true'>
			<canvas
				ref={canvasRef}
				className={styles.canvas}
			/>
		</div>
	)
}

export default ScrollBackground
