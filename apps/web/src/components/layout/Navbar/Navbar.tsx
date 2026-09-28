import { useEffect, useRef, useState } from 'react'
import { TbAdjustmentsHorizontal, TbMenu2, TbX } from 'react-icons/tb'

import useActiveSection from '@/hooks/useActiveSection'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'

import Preferences from './Preferences/Preferences'

import styles from './Navbar.module.css'

const navigationItems = [
	{
		id: 'about',
		label: 'Sobre mi'
	},
	{
		id: 'experience',
		label: 'Experiencia'
	},
	{
		id: 'projects',
		label: 'Proyectos'
	},
	{
		id: 'skills',
		label: 'Habilidades'
	},
	{
		id: 'contact',
		label: 'Contacto'
	}
]

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
	const headerRef = useRef<HTMLElement | null>(null)

	const sectionIds = navigationItems.map((item) => item.id)
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

		window.addEventListener('scroll', closeMenus, { passive: true })
		document.addEventListener('pointerdown', handlePointerDown)

		return () => {
			window.removeEventListener('scroll', closeMenus)
			document.removeEventListener('pointerdown', handlePointerDown)
		}
	}, [isMenuOpen, isPreferencesOpen])

	return (
		<header ref={headerRef} className={styles.header}>
			<nav className={styles.navbar}>
				<div className={styles.navbarMain}>
					<a href='#' className={styles.logo}>
						DC
					</a>

					<div className={styles.links}>
						{navigationItems.map((item) => (
							<a
								key={item.id}
								href={`#${item.id}`}
								className={activeSection === item.id ? styles.active : ''}
							>
								{item.label}
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
							aria-label={isPreferencesOpen ? 'Cerrar preferencias' : 'Abrir preferencias'}
							aria-expanded={isPreferencesOpen}
							title={isPreferencesOpen ? 'Cerrar preferencias' : 'Abrir preferencias'}
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
							aria-label={isMenuOpen ? 'Cerrar menu de navegacion' : 'Abrir menu de navegacion'}
							aria-expanded={isMenuOpen}
							title={isMenuOpen ? 'Cerrar menu de navegacion' : 'Abrir menu de navegacion'}
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
						{navigationItems.map((item) => (
							<a
								key={item.id}
								href={`#${item.id}`}
								className={activeSection === item.id ? styles.active : ''}
								onClick={() => setIsMenuOpen(false)}
							>
								{item.label}
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
