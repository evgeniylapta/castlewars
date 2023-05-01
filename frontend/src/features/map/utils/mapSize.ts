export function halfMapSize(currentMapSize: number) {
  return (currentMapSize - 1) / 2
}

export function mapSize(isExpanded: boolean) {
  const minSize = 9
  const maxSize = 15

  return isExpanded ? maxSize : minSize
}
