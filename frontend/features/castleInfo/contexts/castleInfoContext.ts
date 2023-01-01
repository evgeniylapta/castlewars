import constate from 'constate'
import { CastleInfo } from '../types';

const useContext = () => {
  const castleInfo: CastleInfo = {
    money: 123,
    tribe: 'gaul',
    userId: 1,
    units: [
      {
        type: 'legionnaire',
        amount: 21
      },
      {
        type: 'praetorian',
        amount: 123
      },
      {
        type: 'emperor cavalry',
        amount: 41
      },
    ]
  }

  return {
    castleInfo
  }
}

export const [CastleInfoProvider, useCastleInfoContext] = constate(useContext)
