const env = import.meta.env

if (!env.VITE_CATALOG_API_URL || !env.VITE_ORDERS_API_URL || !env.VITE_ANALYTICS_API_URL) {
	throw new Error('Missing API environment variables')
}

export const CATALOG_BASE_URL = env.VITE_CATALOG_API_URL
export const ORDERS_BASE_URL = env.VITE_ORDERS_API_URL
export const ANALYTICS_BASE_URL = env.VITE_ANALYTICS_API_URL
