import constate from 'constate'
import { Castle } from '../../../../types';
import { Point } from '../../map/types';
import { useAuthContext } from '../../auth';
import { useMemo } from 'react';

const useContext = () => {
  const { currentUserId } = useAuthContext()

  const castles: Castle[] = [
    {
      x: 15,
      y: 15,
      userId: 1,
      id: 1
    },
    {
      x: 16,
      y: 16,
      userId: 2,
      id: 2
    },
    {
      x: 11,
      y: 12,
      userId: 3,
      id: 3
    },
  ]

  const myCastlePoint: Point | undefined = useMemo(() => {
    const found = castles.find(({ userId }) => userId === currentUserId)

    return found ? { x: found.x, y: found.y } : undefined
  }, [currentUserId, castles]);

  return {
    castles,
    myCastlePoint
  }
}

export const [CastlesProvider, useCastlesContext] = constate(useContext)
