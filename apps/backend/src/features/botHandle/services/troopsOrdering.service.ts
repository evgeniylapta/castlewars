import {
  CastleResources, TribeType, UnitType
} from '@prisma/client'
import { calculateCastleCold } from '@castlewars/shared-utils'
import { randomArrayItem, rollChance } from '../../../utils/random'
import { CHANCE_TO_ORDER_TROOPS, GOLD_TO_ORDER_TROOPS_COEFFICIENT } from '../config'
import { getAddCastleGoldOperation } from '../../resource/resource.service'
import { getUnitTypesByTribeType } from '../../unitType/unitType.service'
import { callFormattedConsoleLog } from '../../../utils/console'
import { getCreateUnitOrderItemOperations } from '../../unitOrder/services/unitsOrder.service'

type Model = {[key: UnitType['id']]: {
  amount: number,
  unitType: UnitType
}}

function getRandomUnitTypeToOrder(unitTypes: UnitType[]) {
  return randomArrayItem<UnitType>(unitTypes)
}

function getResultToOrder(goldAllowedToUse: number, unitTypes: UnitType[]) {
  let flag = true

  const resultUnitsToOrder: Model = {}
  let currentUnitsCost = 0

  while (flag) {
    const unitType = getRandomUnitTypeToOrder(unitTypes)

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

async function getOperationsByModel(
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
      ...await getCreateUnitOrderItemOperations(
        item.unitType,
        castleResources.castleId,
        item.amount,
        entries.findIndex((entryItem) => entryItem === entry)
      )
    ]
  }

  return [
    ...result,
    getAddCastleGoldOperation(castleResources, -unitsCost)
  ]
}

export async function getOrderUnitsOperations(
  castleResources: CastleResources,
  unitTypes: UnitType[],
  tribeType: TribeType,
  orderItemsLength: number
) {
  const maxItemsLength = 10
  if (!rollChance(CHANCE_TO_ORDER_TROOPS) || orderItemsLength > maxItemsLength) {
    return []
  }

  const availableUnitTypes = getUnitTypesByTribeType(unitTypes, tribeType)

  const goldAllowedToUse = calculateCastleCold(
    castleResources.gold,
    castleResources.goldLastUpdate
  ) * GOLD_TO_ORDER_TROOPS_COEFFICIENT

  const { resultUnitsToOrder, unitsCost } = getResultToOrder(goldAllowedToUse, availableUnitTypes)

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

  return getOperationsByModel(resultUnitsToOrder, unitsCost, castleResources)
}
