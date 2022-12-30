import { User } from '../../../types';

export const getUser = async (req, res) => {
  const result: User = {
    id: 1,
    name: 'TextUser'
  }
  res.send(result);
};

