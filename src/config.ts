// App-wide switches.
export const EMAIL_DOMAIN = 'tip.edu.ph' // keep in sync with firestore.rules, storage.rules and functions/index.js
export const MIN_PASSWORD_LENGTH = 8
export const LIST_LIMIT = 100
export const AVATAR_COLORS = ['#7C3AED', '#2563EB', '#059669', '#DB2777', '#D97706', '#0891B2', '#DC2626']
export const pickColor = (): string => AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
