import constate from 'constate'
import { useCallback, useMemo, useState } from 'react'

function useExpandingHandle() {
  const [isExpandedMap, setIsExpandedMap] = useState(false)

  return {
    isExpandedMap,
    expandMap: useCallback(() => setIsExpandedMap(true), [isExpandedMap]),
    collapseMap: useCallback(() => setIsExpandedMap(false), [isExpandedMap])
  }
}

function useMapSize(isExpandedMap: boolean) {
  const minSize = 9
  const maxSize = 15

  const mapSize = useMemo(
    () => (isExpandedMap ? maxSize : minSize),
    [isExpandedMap, minSize, maxSize]
  )

  return {
    mapSizeHalf: useMemo(() => (mapSize - 1) / 2, []),
    mapSize
  }
}

const useContext = () => {
  const useExpandingHandleReturn = useExpandingHandle()
  const { isExpandedMap } = useExpandingHandleReturn

  return {
    ...useMapSize(isExpandedMap),
    ...useExpandingHandleReturn
  }
}

export const [MapSizeProvider, useMapSizeContext] = constate(useContext)
