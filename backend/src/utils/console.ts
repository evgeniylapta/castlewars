/* eslint-disable no-console */
type Level = 'info' | 'warn' | 'error'

export function callFormattedConsoleLog(name: string, level: Level, object: object) {
  console.log(`[${new Date().toISOString()}]`, `[${level.toUpperCase()}]`, `[${name.toUpperCase()}]`, JSON.stringify(object))
}
