import TransactionTable from '@/components/transaction/Transaction'

export default function Page(data){
  return <TransactionTable transactionId={data.params.transactionId}/>
}