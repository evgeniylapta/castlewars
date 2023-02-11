import { prisma } from '../../../config/prisma';
import { UnitType, Castle, UnitsOrderItem, UnitsOrder, UnitGroup } from '@prisma/client';
import { addSeconds, subSeconds } from 'date-fns';
import { findUnitTypes } from './unitType.service';
import { callFormattedConsoleLog } from '../../../utils/console';
import { UNIT_ORDER_ITEM_DURATION_COEFFICIENT } from '../config';

async function getActualUnitOrdersToHandle(unitTypes: UnitType[], newDate: Date) {
  return await prisma.unitsOrder.findMany({
    where: {
      lastCreationDate: {
        lte: subSeconds(newDate, getMinimalUnitOrderDurationInSeconds(unitTypes))
      }
    },
    include: {
      castle: {
        include: {
          unitGroups: true
        }
      },
      items: {
        include: {
          unitType: true
        },
        orderBy: {
          subsequence: 'asc'
        }
      }
    }
  })
}

type TOrderItemUnitModel = {
  orderItem: UnitsOrderItem,
  durationSeconds: number,
  unitType: UnitType
}

function getModelsToCreate(models: TOrderItemUnitModel[], nowDate: Date, lastUpdateDate: Date) {
  let date = lastUpdateDate

  const result: TOrderItemUnitModel[] = []

  models.forEach((model) => {
    date = addSeconds(date, model.durationSeconds)

    const isTimePassedForCurrentUnit = date <= nowDate

    if (isTimePassedForCurrentUnit) {
      result.push(model)
    }
  })

  return result
}

function getOrderItemUnitModels(item: UnitsOrderItem, unitType: UnitType) {
  const durationSeconds = getUnitOrderItemDurationByUnitTypeInSeconds(unitType)
  return Array.from({length: item.amount}).map<TOrderItemUnitModel>(() => ({
    durationSeconds,
    orderItem: item,
    unitType
  }))
}

function getUnitOrderLastUpdateOperation(unitsOrder: UnitsOrder, nowDate: Date) {
  return prisma.unitsOrder.update({
    where: {
      id: unitsOrder.id
    },
    data: {
      lastCreationDate: nowDate
    }
  })
}

function getUnitOrderOperations(
  modelsToCreate: TOrderItemUnitModel[],
  castle: Castle,
  castleUnitGroups: UnitGroup[]
) {
  type TModel = { orderItem: UnitsOrderItem, amountToCreate: number, unitType: UnitType }

  const toOperate = modelsToCreate.reduce<TModel[]>(
    (result, { orderItem, unitType }) => {
      const found = result.find((item) => item.orderItem.id === orderItem.id)

      if (found) {
        found.amountToCreate += 1
      } else {
        result.push({ amountToCreate: 1, orderItem, unitType })
      }

      return result
    },
    []
  )

  return toOperate.reduce((result, model) => {
    const { orderItem, amountToCreate, unitType } = model

    const orderItemToRemove = amountToCreate >= orderItem.amount

    const orderItemOperation = orderItemToRemove
      ? prisma.unitsOrderItem.delete({ where: { id: orderItem.id } })
      : prisma.unitsOrderItem.update({
        where: { id: orderItem.id },
        data: {
          amount: {
            decrement: amountToCreate
          }
        }
      })

    const foundUnitGroup = castleUnitGroups.find((unitGroup) => unitGroup.unitTypeId === unitType.id)

    const unitGroupOperation = prisma.unitGroup.update({
      where: {
        id: foundUnitGroup.id,
      },
      data: {
        amount: {
          increment: amountToCreate
        }
      }
    })

    callFormattedConsoleLog('[HANDLE UNITS ORDER ITEM]', {
      orderItemId: orderItem.id,
      orderItemToRemove: !!orderItemToRemove,
      amountToCreate,
      unitType: unitType.name
    })

    return [
      ...result,
      orderItemOperation,
      unitGroupOperation
    ]
  }, [])
}

export async function handleUnitOrders() {
  const unitTypes = await findUnitTypes()

  const date = new Date()

  const foundUnitOrders = await getActualUnitOrdersToHandle(unitTypes, date)

  const operations = foundUnitOrders.reduce((result, unitOrder) => {
    const unitModels = unitOrder.items.reduce<TOrderItemUnitModel[]>(
      (result, item) => result.concat(getOrderItemUnitModels(item, item.unitType)),
      []
    )

    const modelsToCreate = getModelsToCreate(unitModels, date, unitOrder.lastCreationDate)

    if (!modelsToCreate.length) {
      return result
    }

    return [
      ...result,
      ...getUnitOrderOperations(modelsToCreate, unitOrder.castle, unitOrder.castle.unitGroups),
      getUnitOrderLastUpdateOperation(unitOrder, date)
    ]
  }, [])

  await prisma.$transaction(operations)
}

function getUnitOrderItemDurationByUnitTypeInSeconds(unitType: UnitType) {
  return UNIT_ORDER_ITEM_DURATION_COEFFICIENT * unitType.creatingSpeed
}

function getMinimalUnitOrderDurationInSeconds(unitTypes: UnitType[]) {
  return Math.min(...unitTypes.map((unitType) => getUnitOrderItemDurationByUnitTypeInSeconds(unitType)))
}
