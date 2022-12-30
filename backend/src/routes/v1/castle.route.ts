import express from 'express';
import { getCastles } from '../../controllers/castle.controller';

const router = express.Router();

router
  .route('/')
  .get(getCastles);

export default router;
