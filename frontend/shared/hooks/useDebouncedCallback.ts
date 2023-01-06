import { useCallback } from 'react'
import debounce from 'lodash/debounce'

export function useDebouncedCallback(func: (...rest: any) => void, deps = []) {
  return useCallback(
    debounce(func, 200, { leading: true, trailing: true }),
    deps
  )
}
