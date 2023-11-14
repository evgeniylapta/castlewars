import {
  Castle, UnitGroup, UnitType
} from '@prisma/client'
import { getAttackUpdateModels } from './attackCalculation.service'
import { prisma } from '../../../config/prisma'
import { GetAttackHistoryQueryDto } from '../dto/GetAttackHistoryQueryDto'

export async function findCreateAttacksHistory({
  offset,
  limit,
  castleId
}: GetAttackHistoryQueryDto) {
  const where = {
    OR: [
      {
        castleFromId: castleId
      },
      {
        castleToId: castleId
      }
    ]
  }

  return {
    items: await prisma.attackHistory.findMany({
      where,
      include: {
        items: true,
        castleFrom: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        castleTo: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      skip: Number(offset),
      take: Number(limit),
      orderBy: {
        attackDate: 'desc'
      }
    }),
    totalCount: await prisma.attackHistory.count({ where })
  }
}

export function prepareCreateAttacksHistoryOperation(
  castleFromId: Castle['id'],
  castleToId: Castle['id'],
  attackUnitGroups: UnitGroup[],
  castleToUnitGroups: UnitGroup[],
  unitTypes: UnitType[],
  date: Date
) {
  const {
    attackUpdateModels,
    defenceUpdateModels
  } = getAttackUpdateModels(
    attackUnitGroups,
    castleToUnitGroups,
    unitTypes
  )

  return prisma.attackHistory.create({
    data: {
      castleFromId,
      castleToId,
      attackDate: date,
      items: {
        createMany: {
          data: [
            ...attackUpdateModels.map(({ unitTypeId, newAmount, oldAmount }) => ({
              isDefence: false,
              unitTypeId,
              oldAmount,
              newAmount
            })),
            ...defenceUpdateModels
              .filter(({ oldAmount }) => !!oldAmount)
              .map(({ unitTypeId, newAmount, oldAmount }) => ({
                isDefence: true,
                unitTypeId,
                oldAmount,
                newAmount
              }))
          ]
        }
      }
    }
  })
}
