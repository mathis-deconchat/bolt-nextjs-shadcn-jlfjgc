import { GlobalFilters } from "@/components/filters/global-filters"
import { PageHeader } from "@/components/layout/page-header"
import { AnalyticsSummary } from "@/components/overview/analytics-summary"
import { AccountList } from "@/components/overview/account-list"
import { RecentTransactions } from "@/components/overview/recent-transactions"
import { FinancialOverview } from "@/components/overview/financial-overview"

export default function OverviewPage() {
  return (
    <div className="flex-1 space-y-8 p-8">
      <PageHeader 
        title="Overview" 
        description="Your financial summary and recent activity"
      >
        <GlobalFilters />
      </PageHeader>

      {/* Analytics Summary Cards */}
      <div className="container-section p-6">
        <AnalyticsSummary />
      </div>

      {/* Account Summary Cards */}
      <div className="container-section p-6">
        <h2 className="text-lg font-semibold mb-4">Your Accounts</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AccountList />
        </div>
      </div>

      {/* Financial Overview */}
      <div className="container-section p-6">
        <FinancialOverview />
      </div>

      {/* Recent Transactions */}
      <div className="container-section p-6">
        <RecentTransactions />
      </div>
    </div>
  )
}