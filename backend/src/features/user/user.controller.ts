import { Request, Response } from 'express'
import { currentUser } from './user.service'

export const userController = async (req: Request, res: Response) => {
  res.send(await currentUser())
}
