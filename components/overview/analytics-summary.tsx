"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { ArrowDown, ArrowUp, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function AnalyticsSummary() {
  const supabase = useSupabaseClient()
  const currentMonth = new Date()
  const previousMonth = subMonths(currentMonth, 1)

  const { data: analytics } = useQuery({
    queryKey: ["monthly-analytics"],
    queryFn: async () => {
      // Get total balance from accounts
      const { data: accounts } = await supabase
        .from("cozy_bank_accounts")
        .select("cozy_balance")

      const totalBalance = accounts?.reduce(
        (sum, account) => sum + parseFloat(account.cozy_balance || "0"),
        0
      ) || 0

      // Current month transactions
      const currentMonthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd")
      const currentMonthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd")
      const { data: currentData } = await supabase
        .from("cozy_bank_operations")
        .select("cozy_amount")
        .gte("cozy_realisation_date", currentMonthStart)
        .lte("cozy_realisation_date", currentMonthEnd)
        .not("cozy_amount", "is", null)

      // Previous month transactions
      const previousMonthStart = format(startOfMonth(previousMonth), "yyyy-MM-dd")
      const previousMonthEnd = format(endOfMonth(previousMonth), "yyyy-MM-dd")
      const { data: previousData } = await supabase
        .from("cozy_bank_operations")
        .select("cozy_amount")
        .gte("cozy_realisation_date", previousMonthStart)
        .lte("cozy_realisation_date", previousMonthEnd)
        .not("cozy_amount", "is", null)

      // Calculate metrics
      const currentMetrics = currentData?.reduce(
        (acc, op) => {
          if (op.cozy_amount! > 0) {
            acc.income += op.cozy_amount!
          } else {
            acc.expenses += Math.abs(op.cozy_amount!)
          }
          return acc
        },
        { income: 0, expenses: 0 }
      )

      const previousMetrics = previousData?.reduce(
        (acc, op) => {
          if (op.cozy_amount! > 0) {
            acc.income += op.cozy_amount!
          } else {
            acc.expenses += Math.abs(op.cozy_amount!)
          }
          return acc
        },
        { income: 0, expenses: 0 }
      )

      const expenseChange = ((currentMetrics?.expenses || 0) - (previousMetrics?.expenses || 0)) / 
                          (previousMetrics?.expenses || 1) * 100

      return {
        totalBalance,
        currentMonth: {
          income: currentMetrics?.income || 0,
          expenses: currentMetrics?.expenses || 0,
        },
        previousMonth: {
          income: previousMetrics?.income || 0,
          expenses: previousMetrics?.expenses || 0,
        },
        changes: {
          expenses: expenseChange,
        },
      }
    },
  })

  const cards = [
    {
      title: "Total Balance",
      value: analytics?.totalBalance || 0,
      icon: Wallet,
      description: "Combined balance across all your accounts",
      gradient: "from-blue-50/50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/50",
    },
    {
      title: "Monthly Income",
      value: analytics?.currentMonth.income || 0,
      change: ((analytics?.currentMonth.income || 0) - (analytics?.previousMonth.income || 0)) /
              (analytics?.previousMonth.income || 1) * 100,
      icon: TrendingUp,
      description: "Total income for the current month",
      gradient: "from-green-50/50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/50",
    },
    {
      title: "Monthly Expenses",
      value: analytics?.currentMonth.expenses || 0,
      change: analytics?.changes.expenses || 0,
      icon: TrendingDown,
      description: "Total expenses for the current month",
      gradient: "from-red-50/50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, i) => (
        <Tooltip key={i} delayDuration={300}>
          <TooltipTrigger asChild>
            <Card className={cn(
              "overflow-hidden bg-gradient-to-br transition-all duration-300",
              card.gradient
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className="rounded-full p-2 bg-background/80 backdrop-blur-sm">
                  <card.icon className="h-4 w-4 text-foreground/80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{Math.abs(card.value).toFixed(2)}
                </div>
                {'change' in card && typeof card.change === 'number' && (
                  <p className="flex items-center text-xs text-muted-foreground mt-2">
                    {card.change > 0 ? (
                      <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span className={cn(
                      "font-medium",
                      card.change > 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {Math.abs(card.change).toFixed(1)}%
                    </span>
                    <span className="ml-1">vs last month</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            className="max-w-[200px] text-center bg-popover text-popover-foreground"
          >
            {card.description}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}