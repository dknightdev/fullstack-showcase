import About from '@/components/sections/About/About'
import Contact from '@/components/sections/Contact/Contact'
import Experience from '@/components/sections/Experience/Experience'
import Hero from '@/components/sections/Hero/Hero'
import Projects from '@/components/sections/Projects/Projects'
import Skills from '@/components/sections/Skills/Skills'

const Home = () => {
	return (
		<>
			<Hero />
			<About />
			<Experience />
			<Projects />
			<Skills />
			<Contact />
		</>
	)
}

export default Home
