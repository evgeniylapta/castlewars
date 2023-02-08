import config from './config/config'
import logger from './config/logger'
import app from './app'
import { attacksProcessingTick } from './features/attack/services/attackProcessing.service';
import {
  botsActionsCreatingTick,
  botsActionsExecuteTick,
} from './features/botsHandle/services/botsHandle.service';
import { asyncTimerStart } from './utils/timer';
import { generateBots } from './features/generation/services/generation.service';

const server = app.listen(config.port, async () => {
  logger.info(`Listening to port ${config.port}`);

  realTimeHandleStart()
  // await generateBots(500)
});

// todo move to feature?
function realTimeHandleStart() {
  let counter = 1

  asyncTimerStart(async () => {
    const timerName = '[REAL TIME TICK DURATION]'

    console.time(timerName)

    await attacksProcessingTick()

    // todo move to method
    if (counter % 3 === 0) {
      await botsActionsExecuteTick()
    }

    if (counter % 6 === 0) {
      await botsActionsCreatingTick()
    }

    counter++
    console.timeEnd(timerName)
  }, 1000)
}

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
