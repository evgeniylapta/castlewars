import { useState } from 'react'
import { useHarmonicIntervalFn } from 'react-use'

export function useNewDateInterval() {
  const [newDate, setNewDate] = useState(new Date())

  useHarmonicIntervalFn(() => setNewDate(new Date()), 1000)

  return newDate
}
