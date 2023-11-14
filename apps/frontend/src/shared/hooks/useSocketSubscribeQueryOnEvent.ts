import { QueryKey, useQueryClient } from 'react-query'
import { useCallback, useEffect } from 'react'
import { SocketAction } from '@castlewars/shared-utils'
import { useSocketsContext } from '../contexts/socketsContext'

export function useSocketSubscribeOnEvent(
  eventName: SocketAction | SocketAction[],
  callback: () => void
) {
  const { addHandler, removeHandler } = useSocketsContext()
  const events = Array.isArray(eventName) ? eventName : [eventName]

  useEffect(() => {
    events.forEach((event) => addHandler(event, callback))

    return () => {
      events.forEach((event) => removeHandler(event, callback))
    }
  }, [eventName, callback])
}

export function useSocketSubscribeQueryOnEvent(
  eventName: SocketAction | SocketAction[],
  queryKey: QueryKey
) {
  const queryClient = useQueryClient()

  const callback = useCallback(() => {
    queryClient.invalidateQueries(queryKey)
  }, [JSON.stringify(queryKey)])

  useSocketSubscribeOnEvent(eventName, callback)
}
