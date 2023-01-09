import { useQuery } from 'react-query';
import { apiClient } from '../../shared/apiClient';
import { TCastle } from '../castle';
import { TAttack } from './types';

const attacksListKey = (castleId?: TCastle['id']) => ['attacksList', castleId]

export function useAttacksListQuery(castleId?: TCastle['id']) {
  return useQuery(attacksListKey(castleId), async () => {
      const { data } = await apiClient.get<TAttack[]>('/attack', {
        params: {
          castleId
        }
      })

      return data
    },
    {
      enabled: !!castleId
    });
}
