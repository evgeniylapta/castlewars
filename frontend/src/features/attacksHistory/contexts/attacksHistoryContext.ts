import constate from 'constate'
import { useEffect, useState } from 'react'
import { useAttacksHistoryQuery } from '../query'
import { useCastleContext } from '../../../entities/castle'

const initialPage = 1

function usePagination(isActive: boolean) {
  const [page, setPage] = useState(initialPage)

  useEffect(() => {
    if (!isActive) {
      setPage(initialPage)
    }
  }, [])

  return {
    page,
    setPage,
    itemsPerPage: 10
  }
}

const useContext = () => {
  const [isActive, setIsActive] = useState(false)

  const pagination = usePagination(isActive)

  return ({
    attacksHistoryQuery: useAttacksHistoryQuery(
      useCastleContext().selectedCastleQuery.data?.id,
      isActive,
      pagination.page,
      pagination.itemsPerPage
    ),
    setIsActive,
    pagination
  })
}

export const [AttacksHistoryContextProvider, useAttacksHistoryContext] = constate(useContext)
