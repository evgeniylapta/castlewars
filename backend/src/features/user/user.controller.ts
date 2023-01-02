import { prisma } from '../../config/prisma';
import { Request, Response } from 'express';
import { RequestHandler, RouteParameters } from 'express-serve-static-core';

export const getUser = async (
  req: Request<any, any, { hello: string }, { hello2: string }>,
  res: Response
) => {
  req.

  res.send(await prisma.user.findMany());
};

