/** Shared clipboard helpers for tool sections. */
import { useRef, useState } from 'react'

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

/** Copy-feedback state: idle → ok/fail for 1.8s. */
export function useCopyFeedback(): ['idle' | 'ok' | 'fail', (ok: boolean) => void] {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle')
  const timer = useRef<number | null>(null)
  const trigger = (ok: boolean) => {
    setState(ok ? 'ok' : 'fail')
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 1800)
  }
  return [state, trigger]
}
