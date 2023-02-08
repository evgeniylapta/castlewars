import { TribeType } from '@prisma/client';

export function randomIntFromInterval(first, second) {
  const min = first < second ? first : second;
  const max = first > second ? first : second;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function getRandomArrayItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
