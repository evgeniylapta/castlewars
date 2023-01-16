import { prisma } from '../../config/prisma';
import { findUnitGroupsByCastleId, findUnitTypes } from '../unit/unit.service';
import { calculateDistanceBetweenCastles } from '../castle/castle.service';
import { add } from 'date-fns';

export async function findAttacksByUser(castleId: string) {
  return await prisma.attack.findMany({
    where: {
      OR: [
        {castleToId: castleId},
        {castleFromId: castleId}
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
  });
}

export async function createAttack(castleFromId: string, castleToId: string, data: object) {
  // todo validate if can substract

  const distance = await calculateDistanceBetweenCastles(castleFromId, castleToId)

  const getNewAmount = (unitTypeId) => data[unitTypeId]

  const unitTypes = await findUnitTypes()
  const requestUnitTypeKeys = Object.keys(data)
  const requestUnitTypes = requestUnitTypeKeys.map((key) => unitTypes.find(({ id }) => id === key))

  const slowestUnitSpeed = Math.min(...requestUnitTypes.map(({ speed }) => speed))

  const minutesToDestination = Math.ceil(60 / slowestUnitSpeed) * distance

  const destinationDate = add(new Date(), {
    minutes: minutesToDestination
  })

  const unitGroupsToUpdate = (await findUnitGroupsByCastleId(castleFromId))
    .filter(({ unitTypeId }) => requestUnitTypeKeys.includes(unitTypeId))

  await prisma.$transaction([
    prisma.attack.create({
      data: {
        castleToId,
        castleFromId,
        dateTime: destinationDate,
        unitGroups: {
          createMany: {
            data: requestUnitTypes.map(({ id }) => ({
              unitTypeId: id,
              amount: getNewAmount(id),
              ownerCastleId: null,
            }))
          }
        }
      }
    }),
    ...unitGroupsToUpdate.map(({ id, unitTypeId, amount }) => prisma.unitGroup.update({
      where: {
        id
      },
      data: {
        amount: amount - getNewAmount(unitTypeId)
      }
    }))
  ])
}
