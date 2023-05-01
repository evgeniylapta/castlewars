import constate from 'constate'
import { useState } from 'react'
import { useCastleDetailsQuery } from '../query'
import { Uuid } from '../../../shared/types'

function useCastleDetails(myCastleId?: Uuid) {
  const [selectedCastleId, setSelectedCastleId] = useState<Uuid>()

  const selectedCastleQuery = useCastleDetailsQuery(selectedCastleId || myCastleId)

  return {
    selectedCastleQuery,
    setSelectedCastleId
  }
}

type Props = {
  myCastleId?: Uuid
}
const useContext = ({ myCastleId }: Props) => {
  const myCastleQuery = useCastleDetailsQuery(myCastleId)
  const castleDetails = useCastleDetails(myCastleId)

  return ({
    ...castleDetails,
    myCastleQuery: useCastleDetailsQuery(myCastleId),
    isMyCastleSelected: castleDetails.selectedCastleQuery.data?.id === myCastleQuery.data?.id
  })
}

export const [CastleProvider, useCastleContext] = constate(useContext)
