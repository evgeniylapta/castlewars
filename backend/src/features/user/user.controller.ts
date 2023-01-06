import { Request, Response } from 'express';
import { findCurrentUser } from './user.service';

export const getUser = async (req: Request, res: Response) => {
  res.send(await findCurrentUser());
};

