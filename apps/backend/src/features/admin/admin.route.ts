import express from 'express'
import {generateBotsController} from './admin.controller'
import {auth} from "../../middlewares/auth";

const router = express.Router()

router.post(
  '/generate-bots',
  auth('generateBots'),
  generateBotsController
)

export default router
