import { add } from 'date-fns'
import { unitTypesMovingSeconds } from '@castlewars/shared-utils'
import { prisma } from '../../../config/prisma'
import { findUnitGroupsByOwnerCastleId } from '../../unitGroup/unitGroup.service'
import { calculateDistanceBetweenCastles } from '../../castle/castle.service'
import { findUnitTypes } from '../../unitType/unitType.service'
import { AttackCreationData } from '../types'

export async function findAttacksByUser(castleId: string) {
  return prisma.attack.findMany({
    where: {
      OR: [
        {
          castleToId: castleId,
          isReturning: false
        },
        {
          castleFromId: castleId
        }
      ]
    },
    include: {
      unitGroups: true,
      castleFrom: {
        include: {
          user: true
        }
      },
      castleTo: {
        include: {
          user: true
        }
      }
    }
  })
}

export async function getAttackCreateOperations(
  castleFromId: string,
  castleToId: string,
  data: AttackCreationData
) {
  // todo validate if can substract

  const distance = await calculateDistanceBetweenCastles(castleFromId, castleToId)

  const newAmount = (unitTypeId) => data[unitTypeId]

  const unitTypes = await findUnitTypes()
  const requestUnitTypeKeys = Object.keys(data)
  const requestUnitTypes = requestUnitTypeKeys.map((key) => unitTypes.find(({ id }) => id === key))

  const secondsToDestination = unitTypesMovingSeconds(requestUnitTypes, distance)
  const destinationDate = add(new Date(), {
    seconds: secondsToDestination
  })

  const unitGroupsToUpdate = (await findUnitGroupsByOwnerCastleId(castleFromId))
    .filter(({ unitTypeId }) => requestUnitTypeKeys.includes(unitTypeId))

  return [
    prisma.attack.create({
      data: {
        castleToId,
        castleFromId,
        dateTime: destinationDate,
        unitGroups: {
          createMany: {
            data: requestUnitTypes.map(({ id }) => ({
              unitTypeId: id,
              amount: newAmount(id),
              ownerCastleId: null
            }))
          }
        },
        isReturning: false
      }
    }),
    ...unitGroupsToUpdate.map(({ id, unitTypeId, amount }) => prisma.unitGroup.update({
      where: {
        id
      },
      data: {
        amount: amount - newAmount(unitTypeId)
      }
    }))
  ]
}

export async function createAttack(
  castleFromId: string,
  castleToId: string,
  data: AttackCreationData
) {
  return prisma.$transaction(await getAttackCreateOperations(castleFromId, castleToId, data))
}
