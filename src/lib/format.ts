const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

export const initials = (name = ''): string =>
  name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

// "now", "5m", "3h", "Yesterday", "Sep 3"
export function timeAgo(at: number | null | undefined): string {
  if (!at) return ''
  const diff = Date.now() - at
  if (diff < MIN) return 'now'
  if (diff < HOUR) return `${Math.floor(diff / MIN)}m`
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`
  if (diff < 2 * DAY) return 'Yesterday'
  return new Date(at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const shortDate = (at: number) => new Date(at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
export const clock = (at: number) => new Date(at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
export const weekday = (at: number) => new Date(at).toLocaleDateString('en-US', { weekday: 'short' })
export const peso = (n: number | string) => '₱' + Number(n).toLocaleString('en-PH')

// Join a date picker value and a time picker value into one timestamp (ms).
export const combine = (date: Date, time: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes()).getTime()

export const tomorrowAt = (h: number, m = 0): Date => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(h, m, 0, 0)
  return d
}
