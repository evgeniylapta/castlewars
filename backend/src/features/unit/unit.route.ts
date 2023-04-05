import express from 'express';
import { postCreateUnitCreating } from './unit.controller';
import validateRequest from '../../middlewares/validateRequest';
import { PostCreateUnitOrderDto } from './dto/PostCreateUnitOrderDto';

const router = express.Router();

router.post('/order', validateRequest({ body: PostCreateUnitOrderDto }), postCreateUnitCreating)

export default router;
