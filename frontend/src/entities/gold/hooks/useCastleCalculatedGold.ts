import { calculateCastleCold } from 'sharedUtils'
import { useMemo } from 'react'
import { useNewDateInterval } from '../../../shared/hooks/useNewDateInterval'

export function useCalculatedGoldInterval(gold?: number, goldLastUpdate?: string) {
  const newDate = useNewDateInterval()

  return useMemo(() => {
    if (!gold || !goldLastUpdate) {
      return 0
    }

    return calculateCastleCold(gold, new Date(goldLastUpdate))
  }, [newDate, gold, goldLastUpdate])
}
