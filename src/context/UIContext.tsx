import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { SheetMap, SheetName } from '../types'

// Bottom sheets and toasts, available from any screen.
interface UIValue {
  sheet: { type: SheetName; props: object } | null
  openSheet: <K extends SheetName>(type: K, props?: SheetMap[K]) => void
  closeSheet: () => void
  toast: (msg: string) => void
  toastMsg: string | null
}
const Ctx = createContext<UIValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<UIValue['sheet']>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const openSheet = useCallback<UIValue['openSheet']>((type, props) => setSheet({ type, props: props ?? {} }), [])
  const closeSheet = useCallback(() => setSheet(null), [])
  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToastMsg(null), 2400)
  }, [])

  const value = useMemo(() => ({ sheet, openSheet, closeSheet, toast, toastMsg }), [sheet, openSheet, closeSheet, toast, toastMsg])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useUI(): UIValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useUI must be used inside <UIProvider>')
  return v
}
