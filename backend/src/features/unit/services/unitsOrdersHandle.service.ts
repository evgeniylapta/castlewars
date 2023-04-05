import { prisma } from '../../../config/prisma';
import { UnitType, UnitsOrderItem, UnitsOrder, UnitGroup } from '@prisma/client';
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

type TFoundUnitsOrder = Awaited<ReturnType<typeof getActualUnitOrdersToHandle>>[0];

type TOrderItemUnitModel = {
  orderItem: UnitsOrderItem,
  unitType: UnitType
}

function getModelsToCreate(unitOrder: TFoundUnitsOrder, nowDate: Date) {
  let date = unitOrder.lastCreationDate

  const result: TOrderItemUnitModel[] = []

  for (let i = 0; i < unitOrder.items.length; i++) {
    const item = unitOrder.items[i]
    for (let j = 0; j < item.amount; j++) {
      const model = {
        orderItem: item,
        unitType: item.unitType
      }

      date = addSeconds(date, getUnitOrderItemDurationByUnitTypeInSeconds(item.unitType))

      if (date <= nowDate) {
        result.push(model)
      } else {
        break;
      }
    }
  }

  return result
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

function getUnitOrderOperations(modelsToCreate: TOrderItemUnitModel[], castleUnitGroups: UnitGroup[]) {
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

    callFormattedConsoleLog('Handle units order item', 'info', {
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

  const nowDate = new Date()

  const foundUnitOrders = await getActualUnitOrdersToHandle(unitTypes, nowDate)

  const operations = foundUnitOrders.reduce((result, unitOrder) => {
    const modelsToCreate = getModelsToCreate(unitOrder, nowDate)

    if (!modelsToCreate.length) {
      return result
    }

    return [
      ...result,
      ...getUnitOrderOperations(modelsToCreate, unitOrder.castle.unitGroups),
      getUnitOrderLastUpdateOperation(unitOrder, nowDate)
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
