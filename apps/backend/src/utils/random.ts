export function randomIntFromInterval(first, second) {
  const min = first < second ? first : second
  const max = first > second ? first : second

  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomArrayItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function rollChance(value: number) {
  if (value < 0 || value > 1) {
    throw new Error('Value is not correct')
  }

  if (value === 0) {
    return false
  }

  if (value === 1) {
    return true
  }

  return Math.random() < value
}
