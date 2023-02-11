import { differenceInMilliseconds } from 'date-fns';

const BASE_GOLD_PER_TICK = 10
const GOLD_TICK_INTERVAL_MS = 1000

export function getCalculatedCastleCold(gold: number, goldLastUpdate: Date) {
  const difference = differenceInMilliseconds(new Date(), goldLastUpdate)

  const passedTicks = Math.floor(difference / GOLD_TICK_INTERVAL_MS)

  return gold + (passedTicks * BASE_GOLD_PER_TICK)
}
