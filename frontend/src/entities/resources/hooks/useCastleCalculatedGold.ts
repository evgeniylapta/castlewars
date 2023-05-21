import { calculateCastleCold } from 'sharedUtils'
import { useMemo } from 'react'
import { useNewDateInterval } from '../../../shared/hooks/useNewDateInterval'
import { CastleResources } from '../../../commonTypes'
import { PossibleUndefined } from '../../../shared/types'

export function useCalculatedGoldInterval(resources: PossibleUndefined<CastleResources>) {
  const newDate = useNewDateInterval()

  return useMemo(() => {
    if (!resources) {
      return 0
    }

    return calculateCastleCold(resources?.gold, new Date(resources?.goldLastUpdate))
  }, [newDate, resources])
}
