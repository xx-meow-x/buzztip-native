import { useState } from 'react'

type Rules<V> = { [K in keyof V]?: (value: V[K], all: V) => string | null }

// Tiny form helper: typed values, a setter per field, an errors object and a busy flag.
export function useForm<V extends Record<string, unknown>>(initial: V) {
  const [values, setValues] = useState<V>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof V, string>>>({})
  const [busy, setBusy] = useState(false)
  const set = <K extends keyof V>(key: K) => (v: V[K]) => setValues((s) => ({ ...s, [key]: v }))
  const validate = (rules: Rules<V>) => {
    const errs: Partial<Record<keyof V, string>> = {}
    for (const key of Object.keys(rules) as (keyof V)[]) {
      const msg = rules[key]?.(values[key], values)
      if (msg) errs[key] = msg
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }
  return { values, setValues, set, errors, validate, busy, setBusy }
}

export const required = (msg: string) => (v: unknown) => (String(v ?? '').trim() ? null : msg)
