import constate from 'constate'
import { useCastleDetailsQuery } from '../query';
import { useSelectedMapPointContext } from '../../map';
import { useCastlesRangeContext } from './castlesRangeContext';
import { useMyCastleContext } from './myCastleDetailsContext';
import { useMemo } from 'react';

const useContext = () => {
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()
  const { selectedPoint } = useSelectedMapPointContext()
  const { castlesQuery: { data: castles } } = useCastlesRangeContext()

  const myCastleId = myCastleDetails?.id

  const selectedCastleId = useMemo(
    () => castles?.find(({ x, y }) => selectedPoint.x === x && selectedPoint.y === y)?.id || myCastleId,
    [castles, selectedPoint, myCastleId]
  )

  return {
    castleDetailsQuery: useCastleDetailsQuery(selectedCastleId),
    selectedCastleId,
    isMyCastleSelected: selectedCastleId === myCastleId
  }
}

export const [SelectedCastleDetailsProvider, useSelectedCastleDetailsContext] = constate(useContext)
