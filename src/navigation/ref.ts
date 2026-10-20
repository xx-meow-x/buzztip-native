import { createNavigationContainerRef } from '@react-navigation/native'
import type { RootStackParamList } from '../types'

// Lets sheets (which live outside the navigator) change screens.
export const navRef = createNavigationContainerRef<RootStackParamList>()
export function go<K extends keyof RootStackParamList>(...args: undefined extends RootStackParamList[K] ? [name: K, params?: RootStackParamList[K]] : [name: K, params: RootStackParamList[K]]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (navRef.isReady()) (navRef.navigate as any)(...args)
}
