import express from 'express';
import {
  createCastle,
  getCastleDetails,
  getCastles,
  getCurrentUserCastle,
  getDistanceBetweenCastles
} from './castle.controller';
import validateGuard from '../../middlewares/validate';
import { CastleCreateDto } from './dto/castleCreateDto';
import { GetCastlesQueryDto } from './dto/getCastlesQueryDto';
import { getCastleDetailsQueryDto } from './dto/getCastleDetailsQueryDto';
import { GetDistanceBetweenCastlesQueryDto } from './dto/getDistanceBetweenPointsQueryDto';

const router = express.Router();

router.route('/')
  .get(validateGuard({ Query: GetCastlesQueryDto }), getCastles)
  .post(validateGuard({ Body: CastleCreateDto }), createCastle);

router.get('/my', getCurrentUserCastle)

router.get('/distance', validateGuard({ Query: GetDistanceBetweenCastlesQueryDto }), getDistanceBetweenCastles)

router.get('/details', validateGuard({ Query: getCastleDetailsQueryDto }), getCastleDetails)

export default router;
