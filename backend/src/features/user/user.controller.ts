import { Request, Response } from 'express'
import { findCurrentUser } from './user.service'

export const userController = async (req: Request, res: Response) => {
  res.send(await findCurrentUser())
}
