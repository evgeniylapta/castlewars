import constate from 'constate'
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useSetState } from 'react-use'
import { Socket } from 'socket.io-client/build/esm/socket'
import { SocketAction } from 'sharedUtils'

type Handler = {
  event: SocketAction,
  callback: () => void
}

let handlers: Handler[] = []

function useEventsHandlers() {
  return {
    addHandler: (event: SocketAction, callback: () => void) => {
      handlers = [...handlers, { event, callback }]
    },
    removeHandler: (event: SocketAction, callback: () => void) => {
      handlers = handlers.filter((handler) => (
        !(event === handler.event && handler.callback === callback)
      ))
    }
  }
}

function openSocket() {
  const socket = io('http://localhost:4000')

  socket.on('message', (action: SocketAction) => {
    handlers.forEach(({ event, callback }) => {
      if (action === event) {
        callback()
      }
    })
  })

  return socket
}

function useSocket() {
  const socket = useRef<Socket>()

  useEffect(() => {
    socket.current = openSocket()

    return () => {
      socket.current?.close()
    }
  }, [])

  return socket.current
}

function useSocketStateHandle(socket: ReturnType<typeof useSocket>) {
  const [socketState, setSocketState] = useSetState<object>({})

  useEffect(() => {
    socket?.emit('set-socket-state', socketState)
  }, [socketState, socket])

  return {
    setSocketState: (key: string, value: any) => setSocketState({ [key]: value })
  }
}

const useContext = () => ({
  ...useSocketStateHandle(useSocket()),
  ...useEventsHandlers()
})

export const [SocketsContextProvider, useSocketsContext] = constate(useContext)
