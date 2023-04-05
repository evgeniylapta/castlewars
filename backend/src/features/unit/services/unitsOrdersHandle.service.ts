import {
  UnitType, UnitsOrderItem, UnitsOrder, UnitGroup
} from '@prisma/client'
import { addSeconds, subSeconds } from 'date-fns'
import { prisma } from '../../../config/prisma'
import { unitTypes } from './unitType.service'
import { callFormattedConsoleLog } from '../../../utils/console'
import { UNIT_ORDER_ITEM_DURATION_COEFFICIENT } from '../config'

function unitOrderItemDurationByUnitTypeInSeconds(unitType: UnitType) {
  return UNIT_ORDER_ITEM_DURATION_COEFFICIENT * unitType.creatingSpeed
}

function minimalUnitOrderDurationInSeconds(types: UnitType[]) {
  return Math.min(
    ...types.map((unitType) => unitOrderItemDurationByUnitTypeInSeconds(unitType))
  )
}

async function actualUnitOrdersToHandle(types: UnitType[], newDate: Date) {
  return prisma.unitsOrder.findMany({
    where: {
      lastCreationDate: {
        lte: subSeconds(newDate, minimalUnitOrderDurationInSeconds(types))
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

type FoundUnitsOrder = Awaited<ReturnType<typeof actualUnitOrdersToHandle>>[0];

type OrderItemUnitModel = {
  orderItem: UnitsOrderItem,
  unitType: UnitType
}

function modelsToCreate(unitOrder: FoundUnitsOrder, nowDate: Date) {
  let date = unitOrder.lastCreationDate

  const result: OrderItemUnitModel[] = []

  for (let i = 0; i < unitOrder.items.length; i += 1) {
    const item = unitOrder.items[i]
    for (let j = 0; j < item.amount; j += 1) {
      const model = {
        orderItem: item,
        unitType: item.unitType
      }

      date = addSeconds(date, unitOrderItemDurationByUnitTypeInSeconds(item.unitType))

      if (date <= nowDate) {
        result.push(model)
      } else {
        break
      }
    }
  }

  return result
}

function unitOrderLastUpdateOperation(unitsOrder: UnitsOrder, nowDate: Date) {
  return prisma.unitsOrder.update({
    where: {
      id: unitsOrder.id
    },
    data: {
      lastCreationDate: nowDate
    }
  })
}

function unitOrderOperations(
  models: OrderItemUnitModel[],
  castleUnitGroups: UnitGroup[]
) {
  type Model = { orderItem: UnitsOrderItem, amountToCreate: number, unitType: UnitType }

  const toOperate = models.reduce<Model[]>(
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

    const foundUnitGroup = castleUnitGroups.find(
      (unitGroup) => unitGroup.unitTypeId === unitType.id
    )

    const unitGroupOperation = prisma.unitGroup.update({
      where: {
        id: foundUnitGroup.id
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
  const nowDate = new Date()

  const foundUnitOrders = await actualUnitOrdersToHandle(await unitTypes(), nowDate)

  const operations = foundUnitOrders.reduce((result, unitOrder) => {
    if (!modelsToCreate(unitOrder, nowDate).length) {
      return result
    }

    return [
      ...result,
      ...unitOrderOperations(modelsToCreate(unitOrder, nowDate), unitOrder.castle.unitGroups),
      unitOrderLastUpdateOperation(unitOrder, nowDate)
    ]
  }, [])

  await prisma.$transaction(operations)
}
