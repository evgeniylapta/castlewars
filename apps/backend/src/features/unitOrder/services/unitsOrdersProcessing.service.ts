import {
  UnitType, UnitsOrderItem, UnitsOrder, UnitGroup
} from '@prisma/client'
import { addSeconds, subSeconds } from 'date-fns'
import { SocketAction } from '@castlewars/shared-utils'
import { prisma } from '../../../config/prisma'
import { callFormattedConsoleLog } from '../../../utils/console'
import { UNIT_ORDER_ITEM_DURATION_COEFFICIENT } from '../config'
import { findUnitTypes } from '../../unitType/unitType.service'
import { broadcastSocketsEvent } from '../../sockets/socketsInitService'

function getUnitOrderItemDurationByUnitTypeInSeconds(unitType: UnitType) {
  return UNIT_ORDER_ITEM_DURATION_COEFFICIENT * unitType.creatingSpeed
}

function getMinimalUnitOrderDurationInSeconds(types: UnitType[]) {
  return Math.min(
    ...types.map((unitType) => getUnitOrderItemDurationByUnitTypeInSeconds(unitType))
  )
}

async function findActualUnitOrdersToHandle(types: UnitType[], newDate: Date) {
  return prisma.unitsOrder.findMany({
    where: {
      lastCreationDate: {
        lte: subSeconds(newDate, getMinimalUnitOrderDurationInSeconds(types))
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

type FoundUnitsOrder = Awaited<ReturnType<typeof findActualUnitOrdersToHandle>>[0];

type OrderItemUnitModel = {
  orderItem: UnitsOrderItem,
  unitType: UnitType
}

function getModelsToCreate(unitOrder: FoundUnitsOrder, nowDate: Date) {
  let date = unitOrder.lastCreationDate

  const result: OrderItemUnitModel[] = []

  for (let i = 0; i < unitOrder.items.length; i += 1) {
    const item = unitOrder.items[i]
    for (let j = 0; j < item.amount; j += 1) {
      const model = {
        orderItem: item,
        unitType: item.unitType
      }

      date = addSeconds(date, getUnitOrderItemDurationByUnitTypeInSeconds(item.unitType))

      if (date <= nowDate) {
        result.push(model)
      } else {
        break
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

function getUnitOrderOperations(
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

async function emitSocketEvents(
  unitOrders: Awaited<ReturnType<typeof findActualUnitOrdersToHandle>>
) {
  return Promise.all(unitOrders.map(({ castle }) => (
    broadcastSocketsEvent(
      SocketAction.UNITS_ORDERING_CHANGED,
      ({ selectedCastleId }) => castle.id === selectedCastleId
    )
  )))
}

export async function processUnitOrders() {
  const now = new Date()
  const foundUnitOrders = await findActualUnitOrdersToHandle(await findUnitTypes(), now)

  const operations = foundUnitOrders.reduce((result, unitOrder) => {
    const models = getModelsToCreate(unitOrder, now)
    if (!models.length) {
      return result
    }

    return [
      ...result,
      ...getUnitOrderOperations(models, unitOrder.castle.unitGroups),
      getUnitOrderLastUpdateOperation(unitOrder, now)
    ]
  }, [])

  await prisma.$transaction(operations)

  await emitSocketEvents(
    foundUnitOrders.filter((unitOrder) => getModelsToCreate(unitOrder, now).length)
  )
}
