import constate from 'constate'
import { useCastleDetailsQuery, useMyCastleQuery } from '../query';
import { useSelectedMapPointContext } from '../../map';
import { useCastlesContext } from './castlesContext';
import { useMyCastleContext } from './myCastleContext';
import { useMemo } from 'react';

const useContext = () => {
  const { myCastleId } = useMyCastleContext()
  const { selectedPoint } = useSelectedMapPointContext()
  const { castlesQuery: { data: castles } } = useCastlesContext()

  const selectedCastleId = useMemo(
    () => castles?.find(({ x, y }) => selectedPoint.x === x && selectedPoint.y === y)?.id || myCastleId,
    [castles, selectedPoint, myCastleId]
  )

  return {
    castleDetailsQuery: useCastleDetailsQuery(selectedCastleId)
  }
}

export const [CastleDetailsProvider, useCastleDetailsContext] = constate(useContext)
