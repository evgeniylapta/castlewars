import constate from 'constate'
import { MapRange } from '../../map/types';
import { useMemo } from 'react';
import { useCastlesQuery } from '../query';
import { useMapCenterContext, useMapSizeContext } from '../../map';

const extraMapRange = 5

function useMapRange(): MapRange {
  const { currentCenterPoint } = useMapCenterContext()
  const { mapSizeHalf } = useMapSizeContext()

  return useMemo(() => ({
      minX: currentCenterPoint.x - mapSizeHalf - extraMapRange,
      maxX: currentCenterPoint.x + mapSizeHalf + extraMapRange,
      minY: currentCenterPoint.y - mapSizeHalf - extraMapRange,
      maxY: currentCenterPoint.y + mapSizeHalf + extraMapRange
    }
  ), [mapSizeHalf, currentCenterPoint])

}

const useContext = () => {
  return {
    castlesQuery: useCastlesQuery(useMapRange()),
  }
}

export const [CastlesRangeProvider, useCastlesRangeContext] = constate(useContext)
