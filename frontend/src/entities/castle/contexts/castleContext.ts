import constate from 'constate'
import { useEffect, useState } from 'react'
import { useCastleDetailsQuery } from '../query'
import { Uuid } from '../../../shared/types'
import { useSocketsContext } from '../../../shared/contexts/socketsContext'

function useCastleDetails(myCastleId?: Uuid) {
  const [selectedCastleId, setSelectedCastleId] = useState<Uuid>()

  const selectedCastleQuery = useCastleDetailsQuery(selectedCastleId || myCastleId)

  return {
    selectedCastleQuery,
    setSelectedCastleId
  }
}

function useSocketStateUpdate(
  { selectedCastleQuery: { data } }: ReturnType<typeof useCastleDetails>
) {
  const { setSocketState } = useSocketsContext()

  useEffect(() => {
    if (data) {
      setSocketState('selectedCastleId', data.id)
    }
  }, [data])
}

type Props = {
  myCastleId?: Uuid
}
const useContext = ({ myCastleId }: Props) => {
  const myCastleQuery = useCastleDetailsQuery(myCastleId)
  const castleDetails = useCastleDetails(myCastleId)

  useSocketStateUpdate(castleDetails)

  return ({
    ...castleDetails,
    myCastleQuery,
    isMyCastleSelected: castleDetails.selectedCastleQuery.data?.id === myCastleQuery.data?.id
  })
}

export const [CastleProvider, useCastleContext] = constate(useContext)
