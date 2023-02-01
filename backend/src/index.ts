import config from './config/config'
import logger from './config/logger'
import app from './app'
import { generateUsers } from './features/generation/generation.service';
import { selectBotsAmount } from './features/user/user.service';

const server = app.listen(config.port, async () => {
  logger.info(`Listening to port ${config.port}`);

  const botsAmount = await selectBotsAmount()

  generateUsers({ limit: 10, isBot: true, nameFactory: (index) => `Bot user ${botsAmount + index}` })
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
