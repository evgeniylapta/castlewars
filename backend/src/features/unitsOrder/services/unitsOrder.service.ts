import {
  UnitType, Castle, UnitsOrder, UnitsOrderItem
} from '@prisma/client'
import { prisma } from '../../../config/prisma'
import { getAddCastleGoldOperation } from '../../resources/resources.service'
import { PostCreateUnitsOrderDto } from '../dto/PostCreateUnitsOrderDto'
import { getUnitTypeById } from '../../unit/services/unitType.service'

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
    where: {
      orderId: unitsOrder.id
    },
    orderBy: {
      subsequence: 'desc'
    }
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
  subtractGold = true,
  extraSubsequenceIndex = 0
) {
  // todo pass castleModel as param ??
  const castle = await prisma.castle.findFirst({
    where: {
      id: castleId
    },
    include: {
      castleResources: true,
      unitsOrders: {
        include: {
          items: true
        }
      }
    }
  })

  let unitOrder = castle.unitsOrders[0]
  if (!unitOrder) {
    unitOrder = await createUnitsOrder(castleId)
  }

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
    ...(updateLastCreationDateOperation ? [updateLastCreationDateOperation] : []),
    ...(
      subtractGold
        ? [getAddCastleGoldOperation(castle.castleResources, -unitType.goldPrice)]
        : []
    )
  ]
}

export async function createUnitOrderItems(
  unitTypes: UnitType[],
  { items, castleId }: PostCreateUnitsOrderDto
) {
  return prisma.$transaction(
    await items.reduce(
      async (result, { unitTypeId, amount }) => [
        ...await result,
        ...await getCreateUnitOrderItemOperations(
          getUnitTypeById(unitTypes, unitTypeId),
          castleId,
          amount,
          true
        )
      ],
      Promise.resolve([])
    )
  )
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
