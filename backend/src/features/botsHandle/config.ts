import { convertMinutesToSeconds } from '../../utils/time';

export const INTERVAL_BETWEEN_ACTIONS_SECONDS_RANGE = {
  // min: convertMinutesToSeconds(1),
  // max: convertMinutesToSeconds(5)
  min: 10,
  max: 30
}

export const CHANCE_TO_SEND_TROOPS = 0.5
export const CHANCE_TO_ORDER_TROOPS = 0.3

export const GOLD_TO_ORDER_TROOPS_COEFFICIENT = 0.3
