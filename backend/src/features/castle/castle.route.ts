import express from 'express';
import {
  createCastle,
  getCastleDetails,
  getCastles,
  getCurrentUserCastle,
  getDistanceBetweenCastles
} from './castle.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CastleCreateDto } from './dto/CastleCreateDto';
import { GetCastlesQueryDto } from './dto/GetCastlesQueryDto';
import { getCastleDetailsQueryDto } from './dto/GetCastleDetailsQueryDto';
import { GetDistanceBetweenCastlesQueryDto } from './dto/GetDistanceBetweenPointsQueryDto';

const router = express.Router();

router.route('/')
  .get(validateRequest({ query: GetCastlesQueryDto }), getCastles)
  .post(validateRequest({ body: CastleCreateDto }), createCastle);

router.get('/my', getCurrentUserCastle)

router.get('/distance', validateRequest({ query: GetDistanceBetweenCastlesQueryDto }), getDistanceBetweenCastles)

router.get('/details', validateRequest({ query: getCastleDetailsQueryDto }), getCastleDetails)

export default router;
