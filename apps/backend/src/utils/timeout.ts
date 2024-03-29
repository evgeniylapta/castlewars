const startTimeout = (func: () => void, intervalMs) => {
  setTimeout(() => {
    func()
  }, intervalMs)
}

export function asyncTimerStart(func: () => Promise<void>, intervalMs: number) {
  const start = async () => {
    await func()
    startTimeout(start, intervalMs)
  }

  start()
}
