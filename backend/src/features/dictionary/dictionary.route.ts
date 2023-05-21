import express from 'express'
import { tribeTypesController, unitTypesController } from './dictionary.controller'

const router = express.Router()

router.get('/unit-types', unitTypesController)
router.get('/tribe-types', tribeTypesController)

export default router
