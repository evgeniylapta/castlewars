import constate from 'constate'
import { getCalculatedCastleCold } from 'sharedUtils';
import { useMemo } from 'react';
import { TCastleExtended, useSelectedCastleDetailsContext } from '../../castle';
import { useNewDateInterval } from '../../../shared/hooks/useNewDateInterval';

function useCastleCalculatedGold(castle?: TCastleExtended) {
  const newDate = useNewDateInterval()

  return useMemo(() => (
    castle
      ? getCalculatedCastleCold(
        castle.castleResources.gold,
        new Date(castle.castleResources.goldLastUpdate)
      )
      : undefined
  ), [castle, newDate])
}

const useContext = () => {
  const { castleDetailsQuery: { data } } = useSelectedCastleDetailsContext()

  return {
    calculatedGold: useCastleCalculatedGold(data),
  }
}

export const [CastleResourcesProvider, useCastleResourcesContext] = constate(useContext)
