import constate from 'constate'
import { useMemo } from 'react'
import { Point } from '../types'
import { useMapCenterContext } from './mapCenterContext'
import { useMapSizeContext } from './mapSizeContext'

function usePoints(centerPoint: Point) {
  const { mapSize } = useMapSizeContext()

  const mapSizeHalf = (mapSize - 1) / 2

  const extremePoints: { startPoint: Point, endPoint: Point } = useMemo(
    () => ({
      startPoint: { x: centerPoint.x - mapSizeHalf, y: centerPoint.y - mapSizeHalf },
      endPoint: { x: centerPoint.x + mapSizeHalf, y: centerPoint.y + mapSizeHalf }
    }),
    [centerPoint, mapSize]
  )

  return {
    pointsList: useMemo(() => {
      const result: Point[] = []

      for (let { y } = extremePoints.endPoint; y >= extremePoints.startPoint.y; y -= 1) {
        for (let { x } = extremePoints.startPoint; x <= extremePoints.endPoint.x; x += 1) {
          result.push({ x, y })
        }
      }

      return result
    }, [extremePoints]),
    startPoint: extremePoints.startPoint
  }
}

function useNumbers(mapStartPoint: Point) {
  const { mapSize } = useMapSizeContext()

  const x = useMemo(() => {
    let i = mapStartPoint.x
    return Array.from(Array(mapSize), () => {
      i += 1
      return i
    })
  }, [mapStartPoint, mapSize])

  const y = useMemo(() => {
    let i = mapStartPoint.y
    return Array.from(Array(mapSize), () => {
      i += 1
      return i
    }).reverse()
  }, [mapStartPoint, mapSize])

  return { x, y }
}

const useContext = () => {
  const { currentCenterPoint } = useMapCenterContext()

  const { pointsList, startPoint } = usePoints(currentCenterPoint)

  return {
    numbers: useNumbers(startPoint),
    pointsList
  }
}

export const [MapPointsProvider, useMapPointsContext] = constate(useContext)
