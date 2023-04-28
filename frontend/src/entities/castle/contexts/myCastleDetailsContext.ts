import constate from 'constate'
import { useMemo } from 'react'
import { Point } from '../../../features/map/types'
import { useCastleDetailsQuery } from '../query'
import { useAuthContext } from '../../auth'

const useContext = () => {
  const { currentUserQuery: { data: currentUser } } = useAuthContext()
  const myCastleDetailsQuery = useCastleDetailsQuery(currentUser?.castles[0].id)

  const myCastlePoint: Point | undefined = useMemo(() => {
    const { data: myCastle } = myCastleDetailsQuery

    if (!myCastle) {
      return { y: 0, x: 0 }
    }

    return { x: myCastle.x, y: myCastle.y }
  }, [myCastleDetailsQuery.data])

  return {
    myCastleDetailsQuery,
    myCastlePoint
  }
}

export const [MyCastleProvider, useMyCastleContext] = constate(useContext)
