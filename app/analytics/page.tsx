import { GlobalFilters } from "@/components/filters/global-filters"
import { PageHeader } from "@/components/layout/page-header"
import { SpendingTrends } from "@/components/analytics/spending-trends"
import { CategoryAnalysis } from "@/components/analytics/category-analysis"
import { AccountComparison } from "@/components/analytics/account-comparison"
import { FinancialMetrics } from "@/components/analytics/financial-metrics"

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-8 p-8">
      <PageHeader 
        title="Analytics" 
        description="Detailed analysis of your financial data"
      >
        <GlobalFilters />
      </PageHeader>

      <div className="container-section p-6">
        <FinancialMetrics />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="container-section p-6">
          <h2 className="text-lg font-semibold mb-4">Spending Trends</h2>
          <SpendingTrends />
        </div>

        <div className="container-section p-6">
          <h2 className="text-lg font-semibold mb-4">Category Analysis</h2>
          <CategoryAnalysis />
        </div>
      </div>

      <div className="container-section p-6">
        <h2 className="text-lg font-semibold mb-4">Account Comparison</h2>
        <AccountComparison />
      </div>
    </div>
  )
}