/* eslint-disable no-console */
import config from "../config/config";

type Level = 'info' | 'warn' | 'error'

export function callFormattedConsoleLog(name: string, level: Level, object: object) {
  if (config.consoleLogsEnabled) {
    // console.log(`[${new Date().toISOString()}]`, `[${level.toUpperCase()}]`, `[${name.toUpperCase()}]`, JSON.stringify(object))
  }
}
