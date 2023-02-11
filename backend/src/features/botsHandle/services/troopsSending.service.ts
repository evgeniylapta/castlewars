import { Castle, TribeType, UnitGroup, UnitType } from '@prisma/client';
import { findCastlesByCoordsRanges } from '../../castle/castle.service';
import { getRandomArrayItem, rollChance } from '../../../utils/random';
import { TAttackCreationData } from '../../attack/types';
import { getUnitTypesByTribeType } from '../../unit/services/unitType.service';
import { findUnitGroupByUnitType } from '../../unit/services/unitGroup.service';
import { getCreateAttackOperations } from '../../attack/services/attack.service';
import { callFormattedConsoleLog } from '../../../utils/console';
import { CHANCE_TO_SEND_TROOPS } from '../config';

async function getRandomCastleToAttack(castle: Castle) {
  const { x, y } = castle

  // todo to config
  const rangeOffset = 5

  const nearCastles = (await findCastlesByCoordsRanges(
    x - rangeOffset,
    y - rangeOffset,
    x + rangeOffset,
    y + rangeOffset,
  )).filter(({ id }) => id !== castle.id)

  if (!nearCastles.length) {
    return undefined
  }

  return getRandomArrayItem<Castle>(nearCastles)
}

function calculateUnitsPower({ attack }: UnitType, amount: number) {
  return attack * amount
}

function getUnitsToAttack(
  tribeType: TribeType,
  unitTypes: UnitType[],
  castleUnitGroups: UnitGroup[]
): TAttackCreationData | undefined {
  const availableUnitTypes = getUnitTypesByTribeType(unitTypes, tribeType)

  // todo to config
  const availableCoefficient = [0.2, 0.3, 0.4, 0.5]

  const { totalPower, data } = availableUnitTypes.reduce<{data: TAttackCreationData, totalPower: number}>(
    (result, unitType) => {
      const foundUnitGroup = findUnitGroupByUnitType(castleUnitGroups, unitType)
      const randomCoefficient = getRandomArrayItem<number>(availableCoefficient)

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
    {data: {}, totalPower: 0}
  )

  const maxPower = 10_000
  // todo to method
  const isTotalPowerLessThanExpected = totalPower < (maxPower * getRandomArrayItem<number>(availableCoefficient))

  if (isTotalPowerLessThanExpected) {
    return undefined
  }

  return data
}

export async function getTroopsSendOperations(
  castleUnitGroups: UnitGroup[],
  castle: Castle,
  tribeType: TribeType,
  unitTypes: UnitType[]
) {
  if(!rollChance(CHANCE_TO_SEND_TROOPS)) {
    return []
  }

  const unitsToAttack = getUnitsToAttack(tribeType, unitTypes, castleUnitGroups)

  if (!unitsToAttack) {
    return []
  }

  const randomCastleToAttack = await getRandomCastleToAttack(castle)

  if (!randomCastleToAttack) {
    return []
  }

  callFormattedConsoleLog('[BOT SEND TROOPS]', {
    castleFrom: { id: castle.id, x: castle.x, y:castle.y },
    castleTo: { id: randomCastleToAttack.id, x: randomCastleToAttack.x, y: randomCastleToAttack.y },
    unitsToAttack
  })

  return await getCreateAttackOperations(
    castle.id,
    randomCastleToAttack.id,
    unitsToAttack
  )
}
