import { addSeconds } from 'date-fns';
import { prisma } from '../../../config/prisma';
import { randomIntFromInterval } from '../../../utils/random';
import { findUnitTypes } from '../../unit/services/unitType.service';
import { getTroopsSendOperations } from './troopsSending.service';
import { getOrderUnitsOperations } from './troopsOrdering.service';

async function findActionsToExecute(date: Date) {
  return prisma.botAction.findMany({
    where: {
      date: {
        lte: date
      }
    },
    include: {
      user: {
        include: {
          castles: {
            include: {
              castleResources: true,
              unitGroups: true,
              unitOrders: true,
            }
          },
          tribeType: true
        }
      }
    }
  })
}

export async function botsActionsExecuteTick() {
  const date = new Date()

  const actionsToPerform  = await findActionsToExecute(date)
  const unitTypes  = await findUnitTypes()

  let operations = []

  for (const action of actionsToPerform) {
    const { user: { castles: [castle], tribeType } } = action
    const orderUnitsOperations = getOrderUnitsOperations(castle.castleResources, castle.unitOrders)
    const troopsSendOperations = await getTroopsSendOperations(castle.unitGroups, castle, tribeType, unitTypes)

    operations = [
      ...operations,
      ...orderUnitsOperations,
      ...troopsSendOperations
    ]
  }

  await prisma.$transaction([
    ...operations,
    prisma.botAction.deleteMany({
      where: {
        date: {
          lte: date
        }
      }
    })
  ])
}

async function findBotsWithNoActions() {
  return prisma.user.findMany({
    where: {
      isBot: true,
      botAction: {
        is: null
      }
    },
    include: {
      botAction: true,
      tribeType: true
    },
  })
}

export async function botsActionsCreatingTick() {
  const bots = await findBotsWithNoActions()

  await prisma.botAction.createMany({
    data: bots.map(({ id }) => {
      const minutesToAdd = randomIntFromInterval(5, 15)
      // date: addMinutes(new Date(), minutesToAdd),
      // todo only for test
      const date = addSeconds(new Date(), minutesToAdd)

      return ({
        userId: id,
        date
      });
    })
  })

  console.log(`[Bot create action]`, { actionsLength: bots.length })
}
