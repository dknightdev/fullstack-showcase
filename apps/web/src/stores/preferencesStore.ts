import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

type Accent = 'blue' | 'green' | 'purple' | 'orange'

type Language = 'es' | 'en'

interface PreferencesState {
	theme: Theme
	accent: Accent
	language: Language
	setTheme: (theme: Theme) => void
	setAccent: (accent: Accent) => void
	setLanguage: (language: Language) => void
}

export const usePreferencesStore = create<PreferencesState>()(
	persist(
		(set) => ({
			theme: 'dark',
			accent: 'blue',
			language: 'es',
			setTheme: (theme) => set({ theme }),
			setAccent: (accent) => set({ accent }),
			setLanguage: (language) => set({ language })
		}),
		{
			name: 'portfolio-preferences'
		}
	)
)
