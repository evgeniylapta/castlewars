import { MapRange, Point } from '../types'
import { halfMapSize } from './mapSize'

export function mapRange(centerPoint: Point, mapSize: number): MapRange {
  const extraMapRange = 5

  return {
    minX: centerPoint.x - halfMapSize(mapSize) - extraMapRange,
    maxX: centerPoint.x + halfMapSize(mapSize) + extraMapRange,
    minY: centerPoint.y - halfMapSize(mapSize) - extraMapRange,
    maxY: centerPoint.y + halfMapSize(mapSize) + extraMapRange
  }
}
