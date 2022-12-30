import constate from 'constate'
import { useCallback, useMemo, useState } from 'react';
import { Point } from '../types';
import { useCastlesContext } from '../../castles';

function usePoints(centerPoint: Point, mapSize: number) {
  const mapSizeHalf = (mapSize - 1) / 2

  const startPoint: Point = useMemo(() => ({ x: centerPoint.x - mapSizeHalf, y: centerPoint.y - mapSizeHalf }), [centerPoint, mapSize])
  const endPoint: Point = useMemo(() => ({ x: centerPoint.x + mapSizeHalf, y: centerPoint.y + mapSizeHalf }), [centerPoint, mapSize])

  const pointsList: Point[] = [];

  for (let y = endPoint.y; y >= startPoint.y; y--) {
    for (let x = startPoint.x; x <= endPoint.x; x++) {
      pointsList.push({ x, y })
    }
  }

  return {
    pointsList,
    startPoint
  }
}

function useNumbers(mapStartPoint: Point, mapSize: number) {
  const x = useMemo(() => {
    let i = mapStartPoint.x;
    return Array.from(Array(mapSize), () => i++);
  }, [mapStartPoint, mapSize]);

  const y = useMemo(() => {
    let i = mapStartPoint.y;
    return Array.from(Array(mapSize), () => i++).reverse();
  }, [mapStartPoint, mapSize]);

  return {
    x,
    y
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

function useExpanding() {
  const [isExtendedMap, setIsExtendedMap] = useState(false)

  return {
    isExtendedMap,
    expandMap: useCallback(() => setIsExtendedMap(true), [isExtendedMap]),
    collapseMap: useCallback(() => setIsExtendedMap(false), [isExtendedMap])
  }
}

function useCenterPoint(initialPoint: Point) {
  const [currentCenterPoint, setCurrentCenterPoint] = useState<Point>(initialPoint)

  return {
    currentCenterPoint,
    setCurrentCenterPoint,
    goToMyCastlePointFactory: useCallback((callback?: () => void) => () => {
      setCurrentCenterPoint(initialPoint)
      callback?.()
    }, [initialPoint])
  }
}

function useMyCastlePoint() {
  const { myCastlePoint } = useCastlesContext()

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

  const { setSelectedPoint, selectedPoint } = useSelection(myCastlePoint)

  const expanding = useExpanding()
  const { isExtendedMap } = expanding

  const { setCurrentCenterPoint, goToMyCastlePointFactory, currentCenterPoint } = useCenterPoint(myCastlePoint)
  const goToMyCastlePoint = goToMyCastlePointFactory(() => setSelectedPoint(undefined))

  const mapSize = useMemo(() => isExtendedMap ? 15 : 9, [isExtendedMap])

  const { pointsList, startPoint } = usePoints(currentCenterPoint, mapSize)

  return {
    numbers: useNumbers(startPoint, mapSize),
    pointsList,
    mapSize,
    controlsHandle: useMapControlsHandle(currentCenterPoint, setCurrentCenterPoint),
    expanding,
    goToMyCastlePoint,
    selection: {
      selectedPoint,
      setSelectedPoint
    }
  }
}

export const [MapProvider, useMapContext] = constate(useContext)
