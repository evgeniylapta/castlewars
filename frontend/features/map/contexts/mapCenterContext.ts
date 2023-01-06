import constate from 'constate'
import { useCallback, useState } from 'react';
import { Point } from '../types';
import { useSelectedMapPointContext } from './selectedMapPointContext';
import { useMyCastleContext } from '../../castle';

function useCenterPointHandle(initialPoint: Point, goToMyCastlePointCallback?: () => void, selectedPoint?: Point) {
  const [currentCenterPoint, setCurrentCenterPoint] = useState<Point>(initialPoint)

  console.log(currentCenterPoint);

  return {
    currentCenterPoint,
    setCurrentCenterPoint,
    goToSelectedCastle: useCallback(() => selectedPoint && setCurrentCenterPoint(selectedPoint), [selectedPoint]),
    goToMyCastlePoint: useCallback(()=> {
      setCurrentCenterPoint(initialPoint)
      goToMyCastlePointCallback?.()
    }, [initialPoint, goToMyCastlePointCallback])
  }
}

function useMapControlsHandle(currentCenterPoint: Point, setCurrentCenterPoint: (point: Point) => void) {
  return {
    goLeft: useCallback(() => setCurrentCenterPoint({ ...currentCenterPoint, x: currentCenterPoint.x - 1 }), [currentCenterPoint]),
    goRight: useCallback(() => setCurrentCenterPoint({ ...currentCenterPoint, x: currentCenterPoint.x + 1 }), [currentCenterPoint]),
    goTop: useCallback(() => setCurrentCenterPoint({ ...currentCenterPoint, y: currentCenterPoint.y + 1 }), [currentCenterPoint]),
    goBottom: useCallback(() => setCurrentCenterPoint({ ...currentCenterPoint, y: currentCenterPoint.y - 1 }), [currentCenterPoint]),
  }
}

const useContext = () => {
  const { myCastlePoint } = useMyCastleContext()

  const { setSelectedPoint, selectedPoint } = useSelectedMapPointContext()

  const useCenterPointHandleReturn = useCenterPointHandle(myCastlePoint, () => setSelectedPoint(undefined), selectedPoint)

  return {
    ...useCenterPointHandleReturn,
    ...useMapControlsHandle(useCenterPointHandleReturn.currentCenterPoint, useCenterPointHandleReturn.setCurrentCenterPoint)
  }
}

export const [MapCenterContextProvider, useMapCenterContext] = constate(useContext)
