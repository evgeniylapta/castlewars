import { Request, Response } from 'express'
import { findTribeTypes } from '../tribe/tribe.service'
import { findUnitTypes } from '../unit/services/unitType.service'

export const unitTypesController = async (req: Request, res: Response) => {
  res.send(await findUnitTypes())
}

export const tribeTypesController = async (req: Request, res: Response) => {
  res.send(await findTribeTypes())
}
