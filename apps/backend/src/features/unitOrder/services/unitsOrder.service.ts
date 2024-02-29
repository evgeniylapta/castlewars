import {
  UnitType, Castle, UnitsOrder, UnitsOrderItem
} from '@prisma/client'
import { SocketAction } from '@castlewars/shared-utils'
import { prisma } from '../../../config/prisma'
import { getAddCastleGoldOperation } from '../../resource/resource.service'
import { PostCreateUnitsOrderDto } from '../dto/PostCreateUnitsOrderDto'
import { getUnitTypeById } from '../../unitType/unitType.service'
import { broadcastSocketsEvent } from '../../sockets/socketsInitService'

async function createUnitsOrder(castleId) {
  return prisma.unitsOrder.create({
    data: {
      castleId,
      lastCreationDate: new Date()
    },
    include: {
      items: true
    }
  })
}

async function getUnitsOrderItemCreatingOperations(
  unitsOrder: UnitsOrder,
  unitTypeId: UnitType['id'],
  amount: number,
  extraSubsequenceIndex = 0
) {
  const lastUnitOrderItem = await prisma.unitsOrderItem.findFirst({
    where: { orderId: unitsOrder.id },
    orderBy: { subsequence: 'desc' }
  })

  return [
    prisma.unitsOrderItem.create({
      data: {
        amount,
        unitTypeId,
        orderId: unitsOrder.id,
        subsequence: (
          lastUnitOrderItem
            ? lastUnitOrderItem.subsequence + 1
            : 1
        ) + extraSubsequenceIndex
      }
    })
  ]
}

function getUpdateUnitsOrderLastCreationDateOperation(
  unitOrder: UnitsOrder,
  unitOrderItems: UnitsOrderItem[]
) {
  if (unitOrderItems.length) {
    return undefined
  }

  return prisma.unitsOrder.update({
    where: {
      id: unitOrder.id
    },
    data: {
      lastCreationDate: new Date()
    }
  })
}

export async function getCreateUnitOrderItemOperations(
  unitType: UnitType,
  castleId: Castle['id'],
  amount?: number,
  extraSubsequenceIndex = 0
) {
  const unitOrder = await prisma.unitsOrder.findFirst({
    where: { castleId },
    include: { items: true }
  }) || await createUnitsOrder(castleId)

  const updateLastCreationDateOperation = getUpdateUnitsOrderLastCreationDateOperation(
    unitOrder,
    unitOrder.items
  )

  return [
    ...await getUnitsOrderItemCreatingOperations(
      unitOrder,
      unitType.id,
      amount,
      extraSubsequenceIndex
    ),
    ...(updateLastCreationDateOperation ? [updateLastCreationDateOperation] : [])
  ]
}

async function emitSocketEvents(castleId: Castle['id']) {
  return broadcastSocketsEvent(
    [
      SocketAction.UNITS_ORDERING_CHANGED,
      SocketAction.RESOURCES_CHANGED
    ],
    ({ selectedCastleId }) => castleId === selectedCastleId
  )
}

function calculateUnitsPrice(items: PostCreateUnitsOrderDto['items'], unitTypes: UnitType[]) {
  return items.reduce((result, { unitTypeId, amount }) => (
    result + (getUnitTypeById(unitTypes, unitTypeId).goldPrice * amount)
  ), 0)
}

export async function createUnitOrderItems(
  unitTypes: UnitType[],
  { items, castleId }: PostCreateUnitsOrderDto
) {
  const castleResources = await prisma.castleResources.findFirst({ where: { castleId } })

  await prisma.$transaction(
    await items.reduce(
      async (result, { unitTypeId, amount }, index) => [
        ...await result,
        ...await getCreateUnitOrderItemOperations(
          getUnitTypeById(unitTypes, unitTypeId),
          castleId,
          amount,
          index
        ),
        getAddCastleGoldOperation(
          castleResources,
          -(calculateUnitsPrice(items, unitTypes))
        )
      ],
      Promise.resolve([])
    )
  )

  await emitSocketEvents(castleId)
}

export async function findUnitOrderItemByCastleId(castleId: Castle['id']) {
  return prisma.unitsOrder.findFirst({
    where: {
      castleId
    },
    include: {
      items: {
        orderBy: { subsequence: 'asc' }
      }
    }
  })
}
