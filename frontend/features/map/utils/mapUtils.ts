import { Point } from '../types'

export function isPointsEqual(firstPoint: Point, secondPoint: Point) {
  return firstPoint.x === secondPoint.x && firstPoint.y === secondPoint.y
}
