"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useFilteredOperations } from "@/hooks/use-filtered-operations"
import useSupabaseClient from "@/lib/supabase-client"
import { format } from "date-fns"
import { 
  ArrowDown, 
  ArrowUp, 
  TrendingDown, 
  TrendingUp, 
  Wallet,
  DollarSign,
  CreditCard,
  PiggyBank 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { TransactionDialog } from "./dialogs/transaction-dialog"

export function AnalyticsSummary() {
  const supabase = useSupabaseClient()
  const { data: operations, isLoading: isLoadingOperations } = useFilteredOperations()
  const [selectedType, setSelectedType] = useState<"income" | "expenses" | null>(null)

  // Get current balance from accounts
  const { data: accountsBalance, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["accounts-balance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cozy_bank_accounts")
        .select("cozy_balance")

      if (error) throw error

      return data.reduce((total, account) => 
        total + parseFloat(account.cozy_balance || "0"), 
        0
      )
    },
  })

  // Calculate metrics based on filtered operations
  const metrics = operations?.reduce(
    (acc, op) => {
      if (op.cozy_amount! > 0) {
        acc.currentIncome += op.cozy_amount!
      } else {
        acc.currentExpenses += Math.abs(op.cozy_amount!)
      }
      return acc
    },
    { currentIncome: 0, currentExpenses: 0 }
  )

  const cards = [
    {
      title: "Current Balance",
      value: accountsBalance || 0,
      icon: Wallet,
      type: null,
      description: "Total balance across all your accounts",
      gradient: "from-blue-50/50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/50",
    },
    {
      title: "Total Income",
      value: metrics?.currentIncome || 0,
      icon: TrendingUp,
      type: "income" as const,
      description: "Click to view detailed breakdown of all income transactions",
      gradient: "from-green-50/50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/50",
    },
    {
      title: "Total Expenses",
      value: metrics?.currentExpenses || 0,
      icon: TrendingDown,
      type: "expenses" as const,
      description: "Click to view detailed breakdown of all expense transactions",
      gradient: "from-red-50/50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/50",
    },
  ]

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card, i) => (
          <Tooltip key={i} delayDuration={300}>
            <TooltipTrigger asChild>
              <Card 
                className={cn(
                  "p-1 bg-gradient-to-br transition-all duration-300",
                  card.gradient,
                  card.type && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
                  "relative overflow-hidden"
                )}
                onClick={() => card.type && setSelectedType(card.type)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <div className="rounded-full p-2 bg-background/80 backdrop-blur-sm">
                    <card.icon className="h-4 w-4 text-foreground/80" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">
                    €{Math.abs(card.value).toFixed(2)}
                  </div>
                  <p className="flex items-center text-xs text-muted-foreground mt-2">
                    {card.value > 0 ? (
                      <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span className={cn(
                      "font-medium",
                      card.value > 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {Math.abs(card.value / (metrics?.currentIncome || 1) * 100).toFixed(1)}%
                    </span>
                    <span className="ml-1">of total flow</span>
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px] text-center">
              {card.description}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <TransactionDialog 
        type={selectedType} 
        onClose={() => setSelectedType(null)} 
      />
    </TooltipProvider>
  )
}