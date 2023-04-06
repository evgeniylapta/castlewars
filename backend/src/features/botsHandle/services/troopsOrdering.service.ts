import {
  CastleResources, TribeType, UnitsOrder, UnitType
} from '@prisma/client'
import { calculateCastleCold } from 'sharedUtils'
import { randomArrayItem, rollChance } from '../../../utils/random'
import { CHANCE_TO_ORDER_TROOPS, GOLD_TO_ORDER_TROOPS_COEFFICIENT } from '../config'
import { operationAddCastleGold } from '../../resources/resources.service'
import { unitTypesByTribeType } from '../../unit/services/unitType.service'
import { operationsCreateUnitOrderItem } from '../../unit/services/unitsOrder.service'
import { callFormattedConsoleLog } from '../../../utils/console'

type Model = {[key: UnitType['id']]: {
  amount: number,
  unitType: UnitType
}}

function randomUnitTypeToOrder(unitTypes: UnitType[]) {
  return randomArrayItem<UnitType>(unitTypes)
}

function resultToOrder(goldAllowedToUse: number, unitTypes: UnitType[]) {
  let flag = true

  const resultUnitsToOrder: Model = {}
  let currentUnitsCost = 0

  while (flag) {
    const unitType = randomUnitTypeToOrder(unitTypes)

    const newCurrentUnitsCost = currentUnitsCost + unitType.goldPrice

    if (newCurrentUnitsCost > goldAllowedToUse) {
      flag = false
      continue
    }

    currentUnitsCost = newCurrentUnitsCost

    const foundItem = resultUnitsToOrder[unitType.id]
    resultUnitsToOrder[unitType.id] = foundItem
      ? { ...foundItem, amount: foundItem.amount + 1 }
      : { unitType, amount: 1 }
  }

  return {
    resultUnitsToOrder,
    unitsCost: currentUnitsCost
  }
}

async function operationsByModel(
  resultUnitsToOrder: Model,
  unitsCost: number,
  castleResources: CastleResources
) {
  let result = []

  const entries = Object.entries(resultUnitsToOrder)

  if (!entries.length) {
    return []
  }

  for (const entry of entries) {
    const [, item] = entry

    result = [
      ...result,
      ...await operationsCreateUnitOrderItem(
        item.unitType,
        castleResources.castleId,
        item.amount,
        false,
        entries.findIndex((entryItem) => entryItem === entry)
      )
    ]
  }

  return [
    ...result,
    operationAddCastleGold(castleResources, -unitsCost)
  ]
}

export async function orderUnitsOperations(
  castleResources: CastleResources,
  unitOrder: UnitsOrder[],
  unitTypes: UnitType[],
  tribeType: TribeType
) {
  if (!rollChance(CHANCE_TO_ORDER_TROOPS)) {
    return []
  }

  const availableUnitTypes = unitTypesByTribeType(unitTypes, tribeType)

  const goldAllowedToUse = calculateCastleCold(
    castleResources.gold,
    castleResources.goldLastUpdate
  ) * GOLD_TO_ORDER_TROOPS_COEFFICIENT

  const { resultUnitsToOrder, unitsCost } = resultToOrder(goldAllowedToUse, availableUnitTypes)

  callFormattedConsoleLog('Bot order troops', 'info', {
    goldAllowedToUse,
    calculatedCastleCold: calculateCastleCold(
      castleResources.gold,
      castleResources.goldLastUpdate
    ),
    unitsCost,
    resultUnitsToOrder: Object.entries(resultUnitsToOrder)
      .map(([, item]) => ({ unitType: item.unitType.name, amount: item.amount }))
  })

  return operationsByModel(resultUnitsToOrder, unitsCost, castleResources)
}
