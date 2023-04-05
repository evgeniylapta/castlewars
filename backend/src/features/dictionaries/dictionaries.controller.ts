import { Request, Response } from 'express'
import { tribeTypes } from '../tribe/tribe.service'
import { unitTypes } from '../unit/services/unitType.service'

export const unitTypesController = async (req: Request, res: Response) => {
  res.send(await unitTypes())
}

export const tribeTypesController = async (req: Request, res: Response) => {
  res.send(await tribeTypes())
}
