import { Response } from 'express'
import { SocketAction } from '@castlewars/shared-utils'
import { CustomRequest } from '../../types/express'
import { generateBots } from '../generation/services/generation.service'
import { broadcastSocketsEvent } from '../sockets/socketsInitService'

export const generateBotsController = async (req: CustomRequest<true>, res: Response) => {
  await generateBots(10)

  await broadcastSocketsEvent(
    SocketAction.BOTS_GENERATED,
    ({ currentUserId }) => req.user.id === currentUserId
  )

  res.status(200).end()
}
