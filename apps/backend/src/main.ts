import config from './config/config'
import logger from './config/logger'
import app from './app'
import { realTimeHandleStart } from './features/realTimeHandle/realTimeHandle.service'
import { generateBots } from './features/generation/services/generation.service'

const server = app.listen(config.port, async () => {
  logger.info(`Listening to port ${config.port}`)

  if (config.generateBotsOnStart) {
    await generateBots(30)
  }

  realTimeHandleStart()
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)
