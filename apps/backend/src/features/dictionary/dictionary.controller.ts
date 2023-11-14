import { Request, Response } from 'express'
import { findTribeTypes } from '../tribe/tribe.service'
import { findUnitTypes } from '../unitType/unitType.service'
import { CustomRequest } from '../../types/express'

export const unitTypesController = async (req: CustomRequest<true>, res: Response) => {
  res.send(await findUnitTypes())
}

export const tribeTypesController = async (req: Request, res: Response) => {
  res.send(await findTribeTypes())
}
