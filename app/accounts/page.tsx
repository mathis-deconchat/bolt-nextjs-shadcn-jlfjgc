import { GlobalFilters } from "@/components/filters/global-filters"
import { PageHeader } from "@/components/layout/page-header"
import { AccountGrid } from "@/components/accounts/account-grid"
import { AccountBalances } from "@/components/accounts/account-balances"
import { AccountActivity } from "@/components/accounts/account-activity"

export default function AccountsPage() {
  return (
    <div className="flex-1 space-y-8 p-8">
      <PageHeader 
        title="Accounts" 
        description="Manage your bank accounts and track balances"
      >
        <GlobalFilters />
      </PageHeader>

      <div className="container-section p-6">
        <AccountGrid />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="container-section p-6">
          <h2 className="text-lg font-semibold mb-4">Balance History</h2>
          <AccountBalances />
        </div>

        <div className="container-section p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <AccountActivity />
        </div>
      </div>
    </div>
  )
}