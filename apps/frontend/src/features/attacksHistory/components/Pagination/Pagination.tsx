import { FC } from 'react'
import {
  Pagination as MuiPagination
} from '@mui/material'
import { useAttacksHistoryContext } from '../../contexts/attacksHistoryContext'

function usePagesCount() {
  const {
    pagination: { itemsPerPage },
    attacksHistoryQuery: { data }
  } = useAttacksHistoryContext()

  return data?.totalCount
    ? Math.ceil(data.totalCount / itemsPerPage)
    : 0
}

const Pagination: FC = () => {
  const { pagination: { page, setPage } } = useAttacksHistoryContext()

  return (
    <MuiPagination
      page={page}
      count={usePagesCount()}
      onChange={(_, pageNumber) => setPage(pageNumber)}
      color="primary"
    />
  )
}

export default Pagination
