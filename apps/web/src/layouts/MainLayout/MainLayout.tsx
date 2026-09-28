import type { ReactNode } from 'react'
import styles from './MainLayout.module.css'

import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'

interface MainLayoutProps {
	children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
	return (
		<>
			<Navbar />

			<main className={styles.container}>
				{children}
			</main>

			<Footer />
		</>
	)
}

export default MainLayout
