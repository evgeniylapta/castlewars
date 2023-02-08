import config from './config/config'
import logger from './config/logger'
import app from './app'
import { attacksProcessingTick } from './features/attack/services/attackProcessing.service';
import {
  botsActionsCreatingTick,
  botsActionsExecuteTick,
} from './features/botsHandle/services/botsHandle.service';
import { asyncTimerStart } from './utils/timer';

const server = app.listen(config.port, async () => {
  logger.info(`Listening to port ${config.port}`);

  asyncTimerStart(() => attacksProcessingTick(), 1000)
  asyncTimerStart(() => botsActionsExecuteTick(), 1000)
  asyncTimerStart(() => botsActionsCreatingTick(), 3000)

  // await generateBots(1000)
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
