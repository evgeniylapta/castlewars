import { calculateCastleCold } from 'sharedUtils'
import { useMemo } from 'react'
import { useNewDateInterval, PossibleUndefined } from '../../../shared'
import { CastleResources } from '../../../commonTypes'

export function useCalculatedGoldInterval(resources: PossibleUndefined<CastleResources>) {
  const newDate = useNewDateInterval()

  return useMemo(() => {
    if (!resources) {
      return 0
    }

    return calculateCastleCold(resources?.gold, new Date(resources?.goldLastUpdate))
  }, [newDate, resources])
}
