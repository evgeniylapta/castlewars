import express from 'express';
import { postCreateUnitCreating } from './unit.controller';
import validateGuard from '../../middlewares/validate';
import { PostCreateUnitOrderDto } from './dto/PostCreateUnitOrderDto';

const router = express.Router();

router.post('/order', validateGuard({ Body: PostCreateUnitOrderDto }), postCreateUnitCreating)

export default router;
