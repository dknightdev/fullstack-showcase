import { ReactLenis } from 'lenis/react'

import 'lenis/dist/lenis.css'

const SmoothScroll = () => {
	return (
		<ReactLenis
			root
			options={{
				lerp: 0.1,
				smoothWheel: true,
				anchors: true
			}}
		/>
	)
}

export default SmoothScroll
