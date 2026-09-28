import { useEffect } from 'react'

import Home from '@/pages/Home/Home'
import MainLayout from '@/layouts/MainLayout/MainLayout'

import { usePreferencesStore } from '@/stores/preferencesStore'

function App() {
	const theme = usePreferencesStore((state) => state.theme)
	const accent = usePreferencesStore((state) => state.accent)

	useEffect(() => {
		document.documentElement.dataset.theme = theme
		document.documentElement.dataset.accent = accent
	}, [theme, accent])

	return (
		<MainLayout>
			<Home />
		</MainLayout>
	)
}

export default App
