import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'motion/react'
import { useLocation, useOutlet } from 'react-router-dom'

import styles from './MainLayout.module.css'

import Navbar, { type NavbarLink } from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import PageTransition from '@/components/layout/PageTransition/PageTransition'
import FloatingPlaygroundButton from '@/components/ui/FloatingPlaygroundButton/FloatingPlaygroundButton'

const homeSections = ['about', 'experience', 'projects', 'skills', 'contact']

const MainLayout = () => {
	const { t } = useTranslation()
	const { pathname } = useLocation()
	const outlet = useOutlet()

	const isHome = pathname === '/'

	const links: NavbarLink[] = isHome
		? homeSections.map((id) => ({ id, label: t(`navbar.${id}`) }))
		: []

	return (
		<>
			<Navbar links={links} />

			<main className={styles.container}>
				<AnimatePresence mode='wait' onExitComplete={() => window.scrollTo(0, 0)}>
					<PageTransition key={pathname}>
						{outlet}
					</PageTransition>
				</AnimatePresence>
			</main>

			<Footer />

			<FloatingPlaygroundButton isHome={isHome} />
		</>
	)
}

export default MainLayout
