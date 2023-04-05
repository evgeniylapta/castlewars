import { Castle, CastleResources, TribeType, UnitsOrder, UnitType } from '@prisma/client';
import { getRandomArrayItem, rollChance } from '../../../utils/random';
import { CHANCE_TO_ORDER_TROOPS, GOLD_TO_ORDER_TROOPS_COEFFICIENT } from '../config';
import { getAddCastleGoldOperation } from '../../resources/resources.service';
import { getUnitTypesByTribeType } from '../../unit/services/unitType.service';
import { createUnitOrderItem, getCreateUnitOrderItemOperations } from '../../unit/services/unitsOrder.service';
import { callFormattedConsoleLog } from '../../../utils/console';
import { getCalculatedCastleCold } from 'sharedUtils';

type TModel = {[key: UnitType['id']]: {
  amount: number,
  unitType: UnitType
}}

function getRandomUnitTypeToOrder(unitTypes: UnitType[]) {
  return getRandomArrayItem<UnitType>(unitTypes)
}

function getResultToOrder(goldAllowedToUse: number, unitTypes: UnitType[]) {
  let flag = true

  const resultUnitsToOrder: TModel = {}
  let currentUnitsCost = 0

  while(flag) {
    const unitType = getRandomUnitTypeToOrder(unitTypes)

    unitType.goldPrice

    const newCurrentUnitsCost = currentUnitsCost + unitType.goldPrice

    if (newCurrentUnitsCost > goldAllowedToUse) {
      flag = false
      continue
    }

    currentUnitsCost = newCurrentUnitsCost

    const foundItem = resultUnitsToOrder[unitType.id]
    resultUnitsToOrder[unitType.id] = foundItem
      ? {...foundItem, amount: foundItem.amount + 1}
      : { unitType, amount: 1 }
  }

  return {
    resultUnitsToOrder,
    unitsCost: currentUnitsCost
  }
}

async function getOperationsByModel(resultUnitsToOrder: TModel, unitsCost: number, castleResources: CastleResources) {
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
        false,
        entries.findIndex(entryItem => entryItem === entry)
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
  unitOrder: UnitsOrder[],
  unitTypes: UnitType[],
  tribeType: TribeType,
) {
  if(!rollChance(CHANCE_TO_ORDER_TROOPS)) {
    return []
  }

  const availableUnitTypes = getUnitTypesByTribeType(unitTypes, tribeType)
  const calculatedCastleCold = getCalculatedCastleCold(castleResources.gold, castleResources.goldLastUpdate)

  const goldAllowedToUse = calculatedCastleCold * GOLD_TO_ORDER_TROOPS_COEFFICIENT

  const { resultUnitsToOrder, unitsCost } = getResultToOrder(goldAllowedToUse, availableUnitTypes)

  callFormattedConsoleLog('Bot order troops', 'info', {
    goldAllowedToUse,
    calculatedCastleCold,
    unitsCost,
    resultUnitsToOrder: Object.entries(resultUnitsToOrder).map(([, item]) => ({ unitType: item.unitType.name, amount: item.amount })),
  })

  return await getOperationsByModel(resultUnitsToOrder, unitsCost, castleResources)
}
