import { useEffect } from 'react'

export function useCustomEventSubscribe(eventName: string, listener: () => void) {
  useEffect(() => {
    document.addEventListener(eventName, listener)

    return () => {
      document.removeEventListener(eventName, listener)
    }
  }, [])
}

export function publishCustomEvent(eventName: string) {
  const event = new CustomEvent(eventName)
  document.dispatchEvent(event)
}
