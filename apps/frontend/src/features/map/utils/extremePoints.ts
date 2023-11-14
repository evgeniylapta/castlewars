import { halfMapSize } from './mapSize'
import { ExtremePoints, Point } from '../types'

export function extremePoints(centerPoint: Point, mapSize: number): ExtremePoints {
  return {
    startPoint: {
      x: centerPoint.x - halfMapSize(mapSize),
      y: centerPoint.y - halfMapSize(mapSize)
    },
    endPoint: {
      x: centerPoint.x + halfMapSize(mapSize),
      y: centerPoint.y + halfMapSize(mapSize)
    }
  }
}
