import { addSeconds } from 'date-fns'
import { prisma } from '../../../config/prisma'
import { randomIntFromInterval } from '../../../utils/random'
import { unitTypes as findUnitTypes } from '../../unit/services/unitType.service'
import { troopsSendOperations } from './troopsSending.service'
import { orderUnitsOperations } from './troopsOrdering.service'
import { callFormattedConsoleLog } from '../../../utils/console'
import { INTERVAL_BETWEEN_ACTIONS_SECONDS_RANGE } from '../config'

async function actionsToExecute(date: Date) {
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
              unitsOrders: true
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

  const actionsToPerform = await actionsToExecute(date)
  const unitTypes = await findUnitTypes()

  let operations = []

  for (const action of actionsToPerform) {
    const { user: { castles: [castle], tribeType } } = action

    operations = [
      ...operations,
      ...await orderUnitsOperations(
        castle.castleResources,
        castle.unitsOrders,
        unitTypes,
        tribeType
      ),
      ...await troopsSendOperations(
        castle.unitGroups,
        castle,
        tribeType,
        unitTypes
      )
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

async function botsWithNoActions() {
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
    }
  })
}

export async function botsActionsCreatingTick() {
  const bots = await botsWithNoActions()

  const newDate = new Date()

  await prisma.botAction.createMany({
    data: bots.map(({ id }) => {
      const { min, max } = INTERVAL_BETWEEN_ACTIONS_SECONDS_RANGE
      const secondsToAdd = randomIntFromInterval(min, max)

      return ({
        userId: id,
        date: addSeconds(newDate, secondsToAdd)
      })
    })
  })

  if (bots.length) {
    callFormattedConsoleLog('Bot create action', 'info', { actionsLength: bots.length })
  }
}
