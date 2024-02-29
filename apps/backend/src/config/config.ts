const config = {
  env: process.env.NODE_ENV,
  port: 4000,
  generateBotsOnStart: process.env.GENERATE_BOTS_ON_START === 'true',
  consoleLogsEnabled: process.env.CONSOLE_LOGS_ENABLED === 'true',
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  }
}

export default config
