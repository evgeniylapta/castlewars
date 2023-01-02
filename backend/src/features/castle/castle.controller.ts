import { prisma } from '../../config/prisma';
import { CastleCreateDto } from './dto/castleCreateDto';
import { Request } from 'express';

export const getCastles = async (req, res) => {
  res.send(await prisma.castle.findMany());
};

export const createCastle = async (req: Request<object, object, CastleCreateDto>, res) => {
  const { y, x, userId } = req.body

  // res.send(await prisma.castle.create({
  //   data: { userId, y, x }
  // }));

  res.send([]);
};
