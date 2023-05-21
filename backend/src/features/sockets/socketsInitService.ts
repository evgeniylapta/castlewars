/* eslint-disable no-param-reassign */
import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { Castle, UserRole } from '@prisma/client'
import { SocketAction } from 'sharedUtils'

let socketsServer: Server = null

type State = {
  selectedCastleId?: Castle['id'],
  role?: UserRole
}

function addSocketListeners(socket: Socket) {
  console.log('User connected')

  socket.on('set-socket-state', (state) => {
    socket.data = state
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
}

export function startSocketsServer(httpServer: HttpServer) {
  socketsServer = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  socketsServer.on('connection', addSocketListeners)
}

export async function broadcastSocketsEvent(
  eventName: SocketAction | SocketAction[],
  checkAvailability: (socketState: State) => boolean
) {
  if (!socketsServer) {
    throw new Error('Sockets server is not defined')
  }

  (await socketsServer.fetchSockets()).forEach((socket) => {
    if (checkAvailability(socket.data)) {
      (Array.isArray(eventName) ? eventName : [eventName]).forEach((event) => {
        socket.emit('message', event)
      })
    }
  })
}
