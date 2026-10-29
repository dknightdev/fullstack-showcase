import { useEffect, useState } from 'react'

const useActiveSection = (sectionIds: string[]) => {
	const [activeSection, setActiveSection] = useState<string>('')

	useEffect(() => {
		const handleScroll = () => {
			const sections = sectionIds
				.map((id) => document.getElementById(id))
				.filter((section): section is HTMLElement => section !== null)

			if (!sections.length) {
				return
			}

			const offset = window.innerHeight * 0.3

			let currentSectionId = ''

			sections.forEach((section) => {
				const { top } = section.getBoundingClientRect()

				if (top <= offset) {
					currentSectionId = section.id
				}
			})

			setActiveSection(currentSectionId)
		}

		handleScroll()

		window.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [sectionIds.join(',')])

	return activeSection
}

export default useActiveSection
