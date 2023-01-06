import constate from 'constate'
import { MapRange } from '../../map/types';
import { useMemo, useState } from 'react';
import { useCastleDetailsQuery, useCastlesQuery } from '../query';
import { TCastle } from '../types';
import { useMapCenterContext, useMapSizeContext } from '../../map';

const extraMapRange = 5

function useMapRange(): MapRange {
  const { currentCenterPoint } = useMapCenterContext()
  const { mapSizeHalf } = useMapSizeContext()

  return useMemo(() => ({
      minX: currentCenterPoint.x - mapSizeHalf - extraMapRange,
      maxX: currentCenterPoint.x + mapSizeHalf + extraMapRange,
      minY: currentCenterPoint.y - mapSizeHalf -extraMapRange,
      maxY: currentCenterPoint.y + mapSizeHalf + extraMapRange
    }
  ), [mapSizeHalf, currentCenterPoint])

}

function useSelectedCastle() {
  const [selectedCastleId, setSelectedCastleId] = useState<TCastle['id']>()

  return {
    castleDetailsQuery: useCastleDetailsQuery(selectedCastleId),
    setSelectedCastleId
  }
}

const useContext = () => {
  return {
    castlesQuery: useCastlesQuery(useMapRange()),
    castleDetails: useSelectedCastle(),
  }
}

export const [CastlesProvider, useCastlesContext] = constate(useContext)
