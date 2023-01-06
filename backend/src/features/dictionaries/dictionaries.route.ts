import express from 'express';
import { getTribeTypes, getUnitTypes } from './dictionaries.controller';

const router = express.Router();

router.get('/unit-types', getUnitTypes);
router.get('/tribe-types', getTribeTypes);

export default router;
