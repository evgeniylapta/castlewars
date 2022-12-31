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

function useExpandingHandle() {
  const [isExpandedMap, setIsExpandedMap] = useState(false)

  return {
    isExpandedMap,
    expandMap: useCallback(() => setIsExpandedMap(true), [isExpandedMap]),
    collapseMap: useCallback(() => setIsExpandedMap(false), [isExpandedMap])
  }
}

function useCenterPointHandle(initialPoint: Point, goToMyCastlePointCallback?: () => void, selectedPoint?: Point) {
  const [currentCenterPoint, setCurrentCenterPoint] = useState<Point>(initialPoint)

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

function useMapSize(isExpandedMap: boolean) {
  const minSize = 9;
  const maxSize = 15;

  return useMemo(() => isExpandedMap ? maxSize : minSize, [isExpandedMap, minSize, maxSize])
}

const useContext = () => {
  const myCastlePoint = useMyCastlePoint()

  const { setSelectedPoint, selectedPoint } = useSelection(myCastlePoint)

  const expandingHandle = useExpandingHandle()
  const { isExpandedMap } = expandingHandle

  const centerPointHandle = useCenterPointHandle(myCastlePoint, () => setSelectedPoint(undefined), selectedPoint)
  const { currentCenterPoint, setCurrentCenterPoint } = centerPointHandle

  const mapSize = useMapSize(isExpandedMap)

  const { pointsList, startPoint } = usePoints(currentCenterPoint, mapSize)

  return {
    numbers: useNumbers(startPoint, mapSize),
    pointsList,
    mapSize,
    controlsHandle: useMapControlsHandle(currentCenterPoint, setCurrentCenterPoint),
    centerPointHandle,
    expandingHandle,
    selection: {
      selectedPoint,
      setSelectedPoint
    },
    myCastlePoint
  }
}

export const [MapProvider, useMapContext] = constate(useContext)
