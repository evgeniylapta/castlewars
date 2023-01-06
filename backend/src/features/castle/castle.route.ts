import express from 'express';
import { createCastle, getCastleDetails, getCastles, getCurrentUserCastle } from './castle.controller';
import validateGuard from '../../middlewares/validate';
import { CastleCreateDto } from './dto/castleCreateDto';
import { GetCastlesQueryDto } from './dto/getCastlesQueryDto';
import { getCastleDetailsQueryDto } from './dto/getCastleDetailsQueryDto';

const router = express.Router();

router.route('/')
  .get(validateGuard({ Query: GetCastlesQueryDto }), getCastles)
  .post(validateGuard({ Body: CastleCreateDto }), createCastle);

router.get('/my', getCurrentUserCastle)

router.get('/details', validateGuard({ Query: getCastleDetailsQueryDto }), getCastleDetails)

export default router;
