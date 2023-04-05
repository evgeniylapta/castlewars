import {
  Castle, TribeType, UnitGroup, UnitType
} from '@prisma/client'
import { castlesByCoordsRanges } from '../../castle/castle.service'
import { randomArrayItem, rollChance } from '../../../utils/random'
import { AttackCreationData } from '../../attack/types'
import { unitTypesByTribeType } from '../../unit/services/unitType.service'
import { unitGroupByUnitType } from '../../unit/services/unitGroup.service'
import { attackCreateOperations } from '../../attack/services/attack.service'
import { callFormattedConsoleLog } from '../../../utils/console'
import { CHANCE_TO_SEND_TROOPS } from '../config'

async function randomCastleToAttack(castle: Castle) {
  const { x, y } = castle

  // todo to config
  const rangeOffset = 5

  const nearCastles = (await castlesByCoordsRanges(
    x - rangeOffset,
    y - rangeOffset,
    x + rangeOffset,
    y + rangeOffset
  )).filter(({ id }) => id !== castle.id)

  if (!nearCastles.length) {
    return undefined
  }

  return randomArrayItem<Castle>(nearCastles)
}

function calculateUnitsPower({ attack }: UnitType, amount: number) {
  return attack * amount
}

function unitsToAttack(
  tribeType: TribeType,
  unitTypes: UnitType[],
  castleUnitGroups: UnitGroup[]
): AttackCreationData | undefined {
  const availableUnitTypes = unitTypesByTribeType(unitTypes, tribeType)

  // todo to config
  const availableCoefficient = [0.2, 0.3, 0.4, 0.5]

  const { totalPower, data } = availableUnitTypes
    .reduce<{data: AttackCreationData, totalPower: number}>(
      (result, unitType) => {
        const foundUnitGroup = unitGroupByUnitType(castleUnitGroups, unitType)
        const randomCoefficient = randomArrayItem<number>(availableCoefficient)

        if (!foundUnitGroup) {
          return result
        }

        // todo to method
        const calculatedAmount = Math.ceil(foundUnitGroup.amount * randomCoefficient)

        if (foundUnitGroup.amount <= calculatedAmount) {
          return result
        }

        const unitsCalculatedPower = calculateUnitsPower(unitType, calculatedAmount)

        return {
          data: {
            ...result.data,
            [unitType.id]: calculatedAmount
          },
          totalPower: result.totalPower + unitsCalculatedPower
        }
      },
      { data: {}, totalPower: 0 }
    )

  const maxPower = 10_000
  // todo to method
  const isTotalPowerLessThanExpected = totalPower < (
    maxPower * randomArrayItem<number>(availableCoefficient)
  )

  if (isTotalPowerLessThanExpected) {
    return undefined
  }

  return data
}

export async function troopsSendOperations(
  castleUnitGroups: UnitGroup[],
  castle: Castle,
  tribeType: TribeType,
  unitTypes: UnitType[]
) {
  if (!rollChance(CHANCE_TO_SEND_TROOPS)) {
    return []
  }

  const foundUnitsToAttack = unitsToAttack(tribeType, unitTypes, castleUnitGroups)

  if (!foundUnitsToAttack) {
    return []
  }

  const castleToAttack = await randomCastleToAttack(castle)

  if (!castleToAttack) {
    return []
  }

  callFormattedConsoleLog('Bot send troops', 'info', {
    castleFrom: { id: castle.id, x: castle.x, y: castle.y },
    castleTo: { id: castleToAttack.id, x: castleToAttack.x, y: castleToAttack.y },
    unitsToAttack: foundUnitsToAttack
  })

  return attackCreateOperations(
    castle.id,
    castleToAttack.id,
    foundUnitsToAttack
  )
}
