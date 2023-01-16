import { prisma } from '../../config/prisma';
import { CastleCreateDto } from './dto/castleCreateDto';
import { Request } from 'express';
import { findCurrentUser } from '../user/user.service';
import { GetCastlesQueryDto } from './dto/getCastlesQueryDto';
import { getCastleDetailsQueryDto } from './dto/getCastleDetailsQueryDto';
import {
  calculateDistanceBetweenCastles,
  findCastlesByCoordsRanges,
} from './castle.service';
import { GetDistanceBetweenCastlesQueryDto } from './dto/getDistanceBetweenPointsQueryDto';

export const getCastles = async (req: Request<object, object, object, GetCastlesQueryDto>, res) => {
  const { minX, minY, maxX, maxY } = req.query

  res.send(await findCastlesByCoordsRanges(Number(minX), Number(minY), Number(maxX), Number(maxY)));
};

export const getCurrentUserCastle = async (req, res) => {
  const { id: userId } = await findCurrentUser()

  res.send(await prisma.castle.findFirst({ where: { userId } }));
};

export const getCastleDetails = async (req: Request<object, object, object, getCastleDetailsQueryDto>, res) => {
  const { castleId } = req.query

  res.send(await prisma.castle.findFirst({
    where: {
      id: castleId
    },
    include: {
      unitGroups: true,
      castleResources: true,
      user: true
    }
  }));
};

export const createCastle = async (req: Request<object, object, CastleCreateDto>, res) => {
  const { y, x, userId } = req.body

  res.send(await prisma.castle.create({
    data: { userId, y, x }
  }));
};

export const getDistanceBetweenCastles = async (req: Request<object, object, object, GetDistanceBetweenCastlesQueryDto>, res) => {
  const { fromCastleId, toCastleId } = req.query

  res.send(await calculateDistanceBetweenCastles(fromCastleId, toCastleId));
};
