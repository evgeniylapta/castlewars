import express from 'express';
import { createCastle, getCastles } from './castle.controller';
import validateGuard from '../../middlewares/validate';
import { CastleCreateDto } from './dto/castleCreateDto';

const router = express.Router();

router
  .route('/')
  .get(getCastles)
  .post(validateGuard({ Body: CastleCreateDto }), createCastle);

export default router;
