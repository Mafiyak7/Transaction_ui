"use client";
import { COLUMNS } from '@/utils/installments/columns'
import { useEffect, useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { fetchInstallments } from '@/utils/installments/fetchData'
import { useRouter } from 'next/navigation'

export default function TransactionTable(transactionId) {
  const router = useRouter()

  const [data,setData] = useState({
    installments:[],
    transaction:{}
  });
  const [loading, setLoading] = useState(false)

  const columns = useMemo(() => COLUMNS, []);

  const fetch = async () => {
    setLoading(true)
    const latestData = await fetchInstallments(transactionId)
    setData(latestData)
    setLoading(false)
  }

  useEffect(()=>{  
    if(transactionId)  fetch().catch(console.error);
  },[transactionId])

  const table = useReactTable({
    data: data.installments.map((installment)=>{
        return {...(data.transaction),...installment}
    }),
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  if(loading)return (<div>Loading...</div>)
  else{
    return (
      <>
      <h2 className='m-4'> DAOFAB</h2>
      <div>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
      <hr />
      <div className="p-2">
      <div className="h-2" />
      {
        data.installments.length > 0 ? (
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
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
              <tr key={row.id}>
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
        ):(
          <h1>No Intallments Done Yet</h1>
        )
      }
      
    </div>
      <hr />
      <div>
        <button onClick={() => fetch()}>Refresh Data</button>
      </div>
    </>
  )
  }
}
