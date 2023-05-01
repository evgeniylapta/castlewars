import { Castle } from '../types'
import { Point } from '../../../shared/types'

export function pointByCastle(castle: Castle): Point {
  return {
    x: castle.x,
    y: castle.y
  }
}

export function castleByPoint(castles: Castle[], point: Point) {
  return castles?.find(({ x, y }) => point.x === x && y === point.y)
}
