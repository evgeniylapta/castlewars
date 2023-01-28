import config from './config/config'
import logger from './config/logger'
import app from './app'
import { startAttacksProcessing } from './features/attack/attackProcessing.service';

const server = app.listen(config.port, async () => {
  logger.info(`Listening to port ${config.port}`);

  startAttacksProcessing()
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
