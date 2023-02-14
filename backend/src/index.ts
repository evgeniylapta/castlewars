import config from './config/config'
import logger from './config/logger'
import app from './app'
import { createUnitOrderItem } from './features/unit/services/unitsOrder.service';
import { realTimeHandleStart } from './features/realTimeHandle/realTimeHandle.service';
import { generateBots } from './features/generation/services/generation.service';

const server = app.listen(config.port, async () => {
  logger.info(`Listening to port ${config.port}`);

  // await generateBots(100)
  realTimeHandleStart()
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
