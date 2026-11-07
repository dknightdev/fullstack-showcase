import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/catalog-api': {
				target: 'http://localhost:5280',
				changeOrigin: true,
				rewrite: (url) => url.replace(/^\/catalog-api(?=\/|$)/, '')
			}
		}
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	}
})
