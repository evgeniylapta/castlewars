import express from 'express';
import {
  createCastle,
  getCastleDetails,
  getCastles,
  getCurrentUserCastle,
  getDistanceBetweenCastles
} from './castle.controller';
import validateGuard from '../../middlewares/validate';
import { CastleCreateDto } from './dto/CastleCreateDto';
import { GetCastlesQueryDto } from './dto/GetCastlesQueryDto';
import { getCastleDetailsQueryDto } from './dto/GetCastleDetailsQueryDto';
import { GetDistanceBetweenCastlesQueryDto } from './dto/GetDistanceBetweenPointsQueryDto';

const router = express.Router();

router.route('/')
  .get(validateGuard({ Query: GetCastlesQueryDto }), getCastles)
  .post(validateGuard({ Body: CastleCreateDto }), createCastle);

router.get('/my', getCurrentUserCastle)

router.get('/distance', validateGuard({ Query: GetDistanceBetweenCastlesQueryDto }), getDistanceBetweenCastles)

router.get('/details', validateGuard({ Query: getCastleDetailsQueryDto }), getCastleDetails)

export default router;
