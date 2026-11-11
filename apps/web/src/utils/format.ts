const currency = 'USD'

export const formatDate = (date: string, locale: string): string =>
	new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	}).format(new Date(`${date}T00:00:00Z`))

export const formatCurrency = (amount: string, locale: string): string => {
	const [whole, fraction = ''] = amount.split('.')
	const cents = Number(fraction.padEnd(2, '0'))

	const formattedCents = new Intl.NumberFormat(locale, {
		minimumIntegerDigits: 2,
		useGrouping: false
	}).format(cents)

	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency
	}).formatToParts(BigInt(whole)).map(part =>
		part.type === 'fraction' ? formattedCents : part.value
	).join('')
}

export const formatChartCurrency = (amount: number, locale: string): string =>
	new Intl.NumberFormat(locale, { style: 'currency', currency, notation: 'compact' }).format(amount)

export const formatNumber = (value: number, locale: string): string =>
	new Intl.NumberFormat(locale).format(value)
