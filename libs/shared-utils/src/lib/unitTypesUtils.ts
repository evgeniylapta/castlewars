import { convertMinutesToSeconds } from './timeUtils';

const UNIT_BASE_SPEED_PER_CELL_INTERVAL_SECONDS = convertMinutesToSeconds(1)

function getSlowestUnitSpeed(unitTypes: Partial<{ speed: number }>[]) {
  return Math.min(...unitTypes.map(({ speed }) => speed || 0))
}

export function unitTypesMovingSeconds(unitTypes: Partial<{ speed: number }>[], distance: number) {
  return Math.ceil(UNIT_BASE_SPEED_PER_CELL_INTERVAL_SECONDS / getSlowestUnitSpeed(unitTypes)) * distance
}
