import { add } from 'date-fns'
import { unitTypesMovingSeconds } from 'sharedUtils'
import { prisma } from '../../../config/prisma'
import { unitGroupsByCastleId } from '../../unit/services/unitGroup.service'
import { calculateDistanceBetweenCastles } from '../../castle/castle.service'
import { unitTypes as findUnitTypes } from '../../unit/services/unitType.service'
import { AttackCreationData } from '../types'

export async function attacksByUser(castleId: string) {
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

export async function attackCreateOperations(
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

  const unitGroupsToUpdate = (await unitGroupsByCastleId(castleFromId))
    .filter(({ unitTypeId }) => requestUnitTypeKeys.includes(unitTypeId))

  // todo удалять если пустая группа

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
  await prisma.$transaction(await attackCreateOperations(castleFromId, castleToId, data))
}
