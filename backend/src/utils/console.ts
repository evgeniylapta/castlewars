export function callFormattedConsoleLog(name: string, object?: object) {
  console.log(name, object ? JSON.stringify(object) : undefined)
}
