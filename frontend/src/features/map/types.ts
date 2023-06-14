import { Uuid } from '../../shared'

export type MapRange = { minX: number, minY: number, maxX: number, maxY: number }

export type Point = { x: number, y: number }

export type ExtremePoints = {
  startPoint: Point
  endPoint: Point
}

export type CellModel = {
  castleId?: Uuid
  isOwnCastle: boolean
  isSelectedCastle: boolean
  point: Point
}
