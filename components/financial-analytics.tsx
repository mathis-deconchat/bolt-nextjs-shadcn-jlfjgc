"use client"

import { useFilteredOperations } from "@/hooks/use-filtered-operations"
import { format } from "date-fns"
import { Loader2, TrendingUp, TrendingDown, Calendar, Target, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface AnalyticMetric {
  label: string
  value: number
  change?: number
  tooltip: string
  icon?: React.ReactNode
}

export function FinancialAnalytics() {
  const { data: operations, isLoading } = useFilteredOperations()

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Calculate metrics based on filtered operations
  const metrics = operations?.reduce(
    (acc, op) => {
      const amount = op.cozy_amount!
      if (amount > 0) {
        acc.totalIncome += amount
        acc.maxIncome = Math.max(acc.maxIncome, amount)
      } else {
        acc.totalExpenses += Math.abs(amount)
        acc.maxExpense = Math.max(acc.maxExpense, Math.abs(amount))
      }
      acc.transactions += 1
      return acc
    },
    { totalIncome: 0, totalExpenses: 0, maxIncome: 0, maxExpense: 0, transactions: 0 }
  ) || { totalIncome: 0, totalExpenses: 0, maxIncome: 0, maxExpense: 0, transactions: 0 }

  const averages = {
    dailyExpenses: metrics.totalExpenses / (operations?.length || 1),
    transactionsPerDay: metrics.transactions / (operations?.length || 1),
  }

  const analyticsMetrics: AnalyticMetric[] = [
    {
      label: "Total Income",
      value: metrics.totalIncome,
      tooltip: "Total income for the selected period",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
    },
    {
      label: "Total Expenses",
      value: metrics.totalExpenses,
      tooltip: "Total expenses for the selected period",
      icon: <TrendingDown className="h-4 w-4 text-red-500" />,
    },
    {
      label: "Daily Average Spending",
      value: averages.dailyExpenses,
      tooltip: "Average daily spending for the selected period",
      icon: <Calendar className="h-4 w-4 text-blue-500" />,
    },
    {
      label: "Largest Single Expense",
      value: metrics.maxExpense,
      tooltip: "Largest single expense in the selected period",
      icon: <Target className="h-4 w-4 text-orange-500" />,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Financial Analytics</CardTitle>
          <Button variant="ghost" size="sm" className="text-sm">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TooltipProvider>
            {analyticsMetrics.map((metric, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Card className="relative overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between space-y-0 pb-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          {metric.label}
                        </p>
                        {metric.icon}
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold tracking-tight">
                          €{metric.value.toFixed(2)}
                        </p>
                        {metric.change && (
                          <span
                            className={cn(
                              "text-xs font-medium",
                              metric.change > 0 ? "text-green-500" : "text-red-500"
                            )}
                          >
                            {metric.change > 0 ? "+" : ""}
                            {metric.change}%
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{metric.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Transactions</span>
                <span className="font-medium">
                  {metrics.transactions}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Daily Transactions</span>
                <span className="font-medium">
                  {averages.transactionsPerDay.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Net Balance</span>
                <span className={cn(
                  "font-medium",
                  metrics.totalIncome - metrics.totalExpenses > 0
                    ? "text-green-500"
                    : "text-red-500"
                )}>
                  €{(metrics.totalIncome - metrics.totalExpenses).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Spending Analysis</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Income to Expense Ratio</span>
                <span className="font-medium">
                  {((metrics.totalIncome / (metrics.totalExpenses || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Transaction Size</span>
                <span className="font-medium">
                  €{(metrics.totalExpenses / (metrics.transactions || 1)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Largest Income</span>
                <span className="font-medium text-green-500">
                  €{metrics.maxIncome.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}