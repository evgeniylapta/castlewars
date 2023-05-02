import constate from 'constate'
import { useState } from 'react'
import { useCastlesQuery } from '../query'
import { mapSize } from '../utils/mapSize'
import { mapRange } from '../utils/mapRange'
import { useCastleContext } from '../../../entities/castle'
import { pointByCastle } from '../utils/castle'
import { Point } from '../types'

function useInitialMapCenter(): Point {
  const { myCastleQuery: { data: myCastle } } = useCastleContext()

  return myCastle
    ? { x: myCastle.x, y: myCastle.y }
    : { x: 0, y: 0 }
}

function useMapCenter() {
  const [centerPoint, setCenterPoint] = useState<Point>(useInitialMapCenter())

  return {
    centerPoint,
    setCenterPoint
  }
}

function useExpanding() {
  const [isExpanded, setIsExpanded] = useState(false)

  return {
    isExpanded,
    expandMap: () => setIsExpanded(true),
    collapseMap: () => setIsExpanded(false)
  }
}

function useGoToMyCastlePoint({ setCenterPoint }: ReturnType<typeof useMapCenter>) {
  const { myCastleQuery: { data: myCastle } } = useCastleContext()
  const { setSelectedCastleId } = useCastleContext()

  return () => {
    if (myCastle) {
      setCenterPoint(pointByCastle(myCastle))
      setSelectedCastleId(undefined)
    }
  }
}

const useContext = () => {
  const expanding = useExpanding()
  const mapCenter = useMapCenter()

  return ({
    ...mapCenter,
    ...expanding,
    castlesQuery: useCastlesQuery(
      mapRange(
        mapCenter.centerPoint,
        mapSize(expanding.isExpanded)
      )
    ),
    goToMyCastlePoint: useGoToMyCastlePoint(mapCenter)
  })
}

export const [MapContextProvider, useMapContext] = constate(useContext)
