import { Request, Response } from 'express';
import { findUnitTypes } from '../unit/unit.service';
import { findTribeTypes } from '../tribe/tribe.service';

export const getUnitTypes = async (req: Request, res: Response) => {
  res.send(await findUnitTypes());
};

export const getTribeTypes = async (req: Request, res: Response) => {
  res.send(await findTribeTypes());
};
