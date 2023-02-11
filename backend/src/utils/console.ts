export function callFormattedConsoleLog(name: string, object: object) {
  console.log(name, JSON.stringify(object))
}
