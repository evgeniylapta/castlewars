import constate from 'constate'
import { getCalculatedCastleCold } from 'sharedUtils';
import { useInterval } from 'react-use';
import { useCallback, useEffect, useState } from 'react';
import { TCastleExtended, useSelectedCastleDetailsContext } from '../../castle';

function useCastleCalculatedGold(castle?: TCastleExtended) {
  const [gold, setGold] = useState<number>()

  const calculate = useCallback(() => setGold(
    castle
    ? getCalculatedCastleCold(
      castle.castleResources.gold,
      new Date(castle.castleResources.goldLastUpdate)
    )
    : undefined
  ), [castle])

  useEffect(() => calculate(), [castle])
  useInterval(() => calculate(), 1000)

  return gold
}

const useContext = () => {
  const { castleDetailsQuery: { data } } = useSelectedCastleDetailsContext()

  return {
    calculatedGold: useCastleCalculatedGold(data),
  }
}

export const [CastleResourcesProvider, useCastleResourcesContext] = constate(useContext)
