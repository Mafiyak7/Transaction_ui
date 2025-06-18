"use client";
import { COLUMNS } from '@/utils/transactions/columns'
import { useEffect, useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { fetchData } from '@/utils/transactions/fetchData'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const [{ pageIndex, pageSize }, setPagination] =useState({
    pageIndex: 0,
    pageSize: 2,
  })
  const [data,setData] = useState({
    transactions:[],
    totalCount:0
  })
  const [sorting, setSorting] = useState([])
  const [loading, setLoading] = useState(false)

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )
  const columns = useMemo(() => COLUMNS, []);

  const fetch = async () => {
    setLoading(true)
    const latestData = await fetchData({pagination,sorting})
    setData(latestData)
    setLoading(false)
  }

  useEffect(()=>{    
    fetch()
      .catch(console.error);
  },[pageIndex,sorting])

  const table = useReactTable({
    data: data.transactions,
    columns,
    pageCount: Math.ceil(data?.totalCount/2|| 0),
    state: {
      pagination,
      sorting
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  if(loading)return (<div>Loading...</div>)
  else{
    return (
      <>
      <h2 className='m-4'> DAOFAB</h2>
      <div className="p-2">
      <div className="h-2" />
      <table className='w-100 mb-5'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.id === "id"
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {
                          header.column.id === "id" && (
                            {
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? ' ➡️'
                          )
                        }
                        
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id} onClick={()=>router.push(`/transaction/${row.original.id}`)} className='hoverable-row'>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="pagination-bar gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
      <hr />
      <div>
        <button onClick={() => fetch()}>Refresh Data</button>
      </div>
    </>
  )
  }
   
}
