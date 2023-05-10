import { QueryKey, useQueryClient } from 'react-query'
import { useCallback, useEffect } from 'react'
import { SocketAction } from 'sharedutils'
import { useSocketsContext } from '../contexts/socketsContext'

export function socketSubscribeOnEvent(eventName: SocketAction, queryKey: QueryKey) {
  const { addHandler, removeHandler } = useSocketsContext()
  const queryClient = useQueryClient()

  const callback = useCallback(() => {
    queryClient.invalidateQueries(queryKey)
  }, [JSON.stringify(queryKey)])

  useEffect(() => {
    addHandler(eventName, callback)

    return () => removeHandler(eventName, callback)
  }, [eventName, callback])
}
