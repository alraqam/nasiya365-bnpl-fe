import { GridPaginationModel } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'

const usePagination = (pageConfig: { current_page: string | undefined; per_page: number | undefined }) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10
  })

  useEffect(() => {
    setPaginationModel({
      page: Number(pageConfig.current_page) - 1 || 0,
      pageSize: pageConfig.per_page || 10
    })
  }, [pageConfig])

  return { paginationModel, setPaginationModel }
}

export default usePagination
