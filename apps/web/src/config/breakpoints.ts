export const BREAKPOINTS = {
    tablet: 768,
    mobile: 425
} as const

export const TABLET_QUERY = `(max-width: ${BREAKPOINTS.tablet}px)`
export const MOBILE_QUERY = `(max-width: ${BREAKPOINTS.mobile}px)`
