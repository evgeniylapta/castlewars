import constate from 'constate'
import { useMemo } from 'react'
import { useCastleDetailsQuery } from '../query'
import { useSelectedMapPointContext } from '../../../features/map'
import { useCastlesRangeContext } from './castlesRangeContext'
import { useMyCastleContext } from './myCastleDetailsContext'

const useContext = () => {
  const { myCastleDetailsQuery: { data: myCastleDetails } } = useMyCastleContext()
  const { selectedPoint } = useSelectedMapPointContext()
  const { castlesQuery: { data: castles } } = useCastlesRangeContext()

  const myCastleId = myCastleDetails?.id

  const selectedCastleId = useMemo(
    () => castles?.find(({ x, y }) => selectedPoint.x === x && selectedPoint.y === y)?.id
      || myCastleId,
    [castles, selectedPoint, myCastleId]
  )

  return {
    castleDetailsQuery: useCastleDetailsQuery(selectedCastleId),
    selectedCastleId,
    isMyCastleSelected: selectedCastleId === myCastleId
  }
}

export const [SelectedCastleDetailsProvider, useSelectedCastleDetailsContext] = constate(useContext)
