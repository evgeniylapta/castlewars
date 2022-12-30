import { Castle } from '../../../types';

export const getCastles = async (req, res) => {
  const result: Castle[] = [
    {
      id: 1,
      userId: 1,
      y: 1,
      x: 1,
    },
    {
      id: 2,
      userId: 2,
      y: 2,
      x: 2,
    },
    {
      id: 2,
      userId: 3,
      y: 3,
      x: 3,
    },
  ];
  res.send(result);
};
