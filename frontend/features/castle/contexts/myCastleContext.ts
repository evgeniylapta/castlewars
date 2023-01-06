import constate from 'constate'
import { Point } from '../../map/types';
import { useMemo } from 'react';
import { useMyCastleQuery } from '../query';

const useContext = () => {
  const { data: myCastle, isFetched } = useMyCastleQuery()

  const myCastlePoint: Point | undefined = useMemo(() => {
    if (!myCastle) {
      return { y: 0 , x: 0 }
    }

    return { x: myCastle.x, y: myCastle.y }
  }, [myCastle]);

  return {
    myCastlePoint,
    myCastleId: myCastle?.id,
    isMyCastleFetched: isFetched
  }
}

export const [MyCastleProvider, useMyCastleContext] = constate(useContext)
