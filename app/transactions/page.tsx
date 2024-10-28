import { GlobalFilters } from "@/components/filters/global-filters"
import { PageHeader } from "@/components/layout/page-header"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionFilters } from "@/components/transactions/transaction-filters"

export default function TransactionsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          heading="Transactions" 
          text="View and manage your transactions"
        />
        <GlobalFilters />
      </div>

      <div className="space-y-4">
        <TransactionFilters />
        <TransactionList />
      </div>
    </div>
  )
}