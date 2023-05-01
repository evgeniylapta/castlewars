import { Point, Uuid } from '../../../shared/types'
import { Castle, CellModel, ExtremePoints } from '../types'
import { castleByPoint } from './castle'

function cellModel(
  castles: Castle[],
  point: Point,
  myCastleId?: Uuid,
  selectedCastleId?: Uuid
): CellModel {
  const foundCastle = castleByPoint(castles, point)

  return {
    castleId: foundCastle?.id,
    isOwnCastle: !!myCastleId && foundCastle?.id === myCastleId,
    isSelectedCastle: !!selectedCastleId && foundCastle?.id === selectedCastleId,
    point
  }
}

export function cellsModels(
  castles: Castle[],
  extremePoints: ExtremePoints,
  myCastleId?: Uuid,
  selectedCastleId?: Uuid
) {
  const result: CellModel[] = []

  for (let { y } = extremePoints.endPoint; y >= extremePoints.startPoint.y; y -= 1) {
    for (let { x } = extremePoints.startPoint; x <= extremePoints.endPoint.x; x += 1) {
      result.push(cellModel(castles, { x, y }, myCastleId, selectedCastleId))
    }
  }

  return result
}
