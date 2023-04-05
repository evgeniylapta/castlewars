type TLevel = 'info' | 'warn' | 'error'

export function callFormattedConsoleLog(name: string, level: TLevel, object: object) {
  console.log(`[${new Date().toISOString()}]`, `[${level.toUpperCase()}]`, `[${name.toUpperCase()}]`, JSON.stringify(object))
}
