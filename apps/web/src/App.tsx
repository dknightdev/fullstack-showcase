import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Navigate, Route, Routes } from 'react-router-dom'

import Home from '@/pages/Home/Home'
import Playground from '@/pages/Playground/Playground'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import ScrollBackground from './components/layout/ScrollBackground/ScrollBackground'

import { usePreferencesStore } from '@/stores/preferencesStore'
import SmoothScroll from './components/layout/SmoothScroll/SmoothScroll'

function App() {
	const theme = usePreferencesStore((state) => state.theme)
	const accent = usePreferencesStore((state) => state.accent)
	const language = usePreferencesStore((state) => state.language)

	const { i18n } = useTranslation()

	useEffect(() => {
		document.documentElement.dataset.theme = theme
		document.documentElement.dataset.accent = accent
		document.documentElement.lang = language

		if (i18n.language !== language) {
			void i18n.changeLanguage(language)
		}
	}, [theme, accent, language, i18n])

	return (
		<>
			<SmoothScroll />
			<ScrollBackground />

			<Routes>
				<Route element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path='playground' element={<Playground />} />
					<Route path='*' element={<Navigate to='/' replace />} />
				</Route>
			</Routes>
		</>
	)
}

export default App
