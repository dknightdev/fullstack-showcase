import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAdjustmentsHorizontal, TbMenu2, TbX } from 'react-icons/tb'

import useActiveSection from '@/hooks/useActiveSection'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'

import Preferences from './Preferences/Preferences'

import styles from './Navbar.module.css'

const navigationItems = [
	'about',
	'experience',
	'projects',
	'skills',
	'contact'
]

const SCROLL_CLOSE_DISTANCE = 120

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
	const headerRef = useRef<HTMLElement | null>(null)
	const { t } = useTranslation()

	const sectionIds = navigationItems
	const activeSection = useActiveSection(sectionIds)

	useEffect(() => {
		if (!isMenuOpen && !isPreferencesOpen) {
			return
		}

		const closeMenus = () => {
			setIsMenuOpen(false)
			setIsPreferencesOpen(false)
		}

		const handlePointerDown = (event: PointerEvent) => {
			if (!(event.target instanceof Node)) {
				return
			}

			if (headerRef.current?.contains(event.target)) {
				return
			}

			closeMenus()
		}

		const startScrollY = window.scrollY

		const handleScroll = () => {
			if (Math.abs(window.scrollY - startScrollY) >= SCROLL_CLOSE_DISTANCE) {
				closeMenus()
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		document.addEventListener('pointerdown', handlePointerDown)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			document.removeEventListener('pointerdown', handlePointerDown)
		}
	}, [isMenuOpen, isPreferencesOpen])

	return (
		<header ref={headerRef} className={styles.header}>
			<nav className={styles.navbar}>
				<div className={styles.navbarMain}>
					<a href='#hero' className={styles.logo}>
						DC
					</a>

					<div className={styles.links}>
						{navigationItems.map((sectionId) => (
							<a
								key={sectionId}
								href={`#${sectionId}`}
								className={activeSection === sectionId ? styles.active : ''}
							>
								{t(`navbar.${sectionId}`)}
							</a>
						))}
					</div>

					<div className={styles.actions}>
						<Button
							variant='icon'
							onClick={() => {
								setIsPreferencesOpen((isOpen) => !isOpen)
								setIsMenuOpen(false)
							}}
							aria-label={t(isPreferencesOpen ? 'navbar.closePreferences' : 'navbar.openPreferences')}
							aria-expanded={isPreferencesOpen}
							title={t(isPreferencesOpen ? 'navbar.closePreferences' : 'navbar.openPreferences')}
						>
							{isPreferencesOpen
								? <AppIcon icon={TbX} size={18} />
								: <AppIcon icon={TbAdjustmentsHorizontal} size={18} />}
						</Button>

						<Button
							variant='icon'
							className={styles.menuButton}
							onClick={() => {
								setIsMenuOpen((isOpen) => !isOpen)
								setIsPreferencesOpen(false)
							}}
							aria-label={t(isMenuOpen ? 'navbar.closeMenu' : 'navbar.openMenu')}
							aria-expanded={isMenuOpen}
							title={t(isMenuOpen ? 'navbar.closeMenu' : 'navbar.openMenu')}
						>
							{isMenuOpen ? <AppIcon icon={TbX} size={18} /> : <AppIcon icon={TbMenu2} size={18} />}
						</Button>
					</div>
				</div>

				<div
					className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : styles.menuClosed}`}
					aria-hidden={!isMenuOpen}
				>
					<div className={styles.menuContent}>
						{navigationItems.map((sectionId) => (
							<a
								key={sectionId}
								href={`#${sectionId}`}
								className={activeSection === sectionId ? styles.active : ''}
								onClick={() => setIsMenuOpen(false)}
							>
								{t(`navbar.${sectionId}`)}
							</a>
						))}
					</div>
				</div>
			</nav>

			<div
				className={`${styles.preferencesMenu} ${isPreferencesOpen ? styles.preferencesOpen : styles.preferencesClosed}`}
				aria-hidden={!isPreferencesOpen}
			>
				<div className={styles.preferencesContent}>
					<Preferences />
				</div>
			</div>
		</header>
	)
}

export default Navbar
