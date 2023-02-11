export function calculateDistanceBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
  let resX;
  let resY;

  if(x1 > x2) {
    resX = x1 - x2;
  } else {
    resX = x2 - x1;
  }

  if(y1 > y2) {
    resY = y1 - y2;
  } else {
    resY = y2 - y1;
  }

  return resX + resY;
}
