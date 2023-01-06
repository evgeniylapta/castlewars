import constate from 'constate'
import { useMemo, useState } from 'react';
import { Point } from '../types';
import { useMyCastleContext } from '../../castle';

function useMyCastlePoint() {
  const { myCastlePoint } = useMyCastleContext()

  return useMemo(() => myCastlePoint ? myCastlePoint : { y: 0 , x: 0 }, [myCastlePoint])
}

function useSelection(defaultPoint: Point) {
  const [selectedPoint, setSelectedPoint] = useState<Point>()

  return {
    selectedPoint: selectedPoint || defaultPoint,
    setSelectedPoint
  }
}

const useContext = () => {
  const myCastlePoint = useMyCastlePoint()

  return {
    ...useSelection(myCastlePoint),
  }
}

export const [SelectedMapPointContextProvider, useSelectedMapPointContext] = constate(useContext)
