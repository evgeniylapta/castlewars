/* eslint-disable no-console */
import { asyncTimerStart } from '../../utils/timeout'
import { handleUnitOrders } from '../unit/services/unitsOrdersHandle.service'
import { botsActionsCreatingTick, botsActionsExecuteTick } from '../botsHandle/services/botsHandle.service'
import { attacksProcessingTick } from '../attack/services/attackProcessing.service'
import {
  ATTACKS_PROCESSING_TICK,
  BOTS_ACTIONS_CREATING_TICK,
  BOTS_ACTIONS_EXECUTE_TICK,
  HANDLE_UNIT_ORDERS_TICK
} from './config'

async function executeConsideringTickInterval(
  counter: number,
  tickInterval: number,
  func: () => Promise<void>
): Promise<void> {
  if (counter % tickInterval === 0) {
    await func()
  }
}

export function realTimeHandleStart() {
  let counter = 1

  asyncTimerStart(async () => {
    const timerName = '[REAL TIME TICK DURATION]'
    console.time(timerName)

    await executeConsideringTickInterval(
      counter,
      ATTACKS_PROCESSING_TICK,
      attacksProcessingTick
    )
    await executeConsideringTickInterval(
      counter,
      HANDLE_UNIT_ORDERS_TICK,
      handleUnitOrders
    )
    await executeConsideringTickInterval(
      counter,
      BOTS_ACTIONS_EXECUTE_TICK,
      botsActionsExecuteTick
    )
    await executeConsideringTickInterval(
      counter,
      BOTS_ACTIONS_CREATING_TICK,
      botsActionsCreatingTick
    )

    counter += 1
    console.timeEnd(timerName)
  }, 1000)
}
