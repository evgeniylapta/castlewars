import { Point } from '../../../shared/types'

export function isPointsEqual(firstPoint: Point, secondPoint: Point) {
  return firstPoint.x === secondPoint.x && firstPoint.y === secondPoint.y
}
