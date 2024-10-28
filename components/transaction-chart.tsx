"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { Loader2 } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Database } from "@/types/supabase"

type Transaction = Database["vye"]["Tables"]["cozy_bank_operations"]["Row"]

interface TransactionChartProps {
  type: "income" | "expenses"
}

export function TransactionChart({ type }: TransactionChartProps) {
  const supabase = useSupabaseClient()
  const currentMonth = new Date()

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["transactions-chart", type],
    queryFn: async () => {
      const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd")
      const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd")

      const { data, error } = await supabase
        .from("cozy_bank_operations")
        .select(`
          *,
          cozy_operation_categories!cozy_bank_operations_cozy_category_id_fkey (
            fr_traduction
          )
        `)
        .gte("cozy_realisation_date", monthStart)
        .lte("cozy_realisation_date", monthEnd)
        .not("cozy_amount", "is", null)

      if (error) throw error

      return data.filter(op => 
        type === "income" ? op.cozy_amount! > 0 : op.cozy_amount! < 0
      )
    },
  })

  const chartData = transactions?.reduce((acc, transaction) => {
    const category = transaction.cozy_operation_categories?.fr_traduction || "Uncategorized"
    const amount = Math.abs(transaction.cozy_amount || 0)
    
    acc[category] = (acc[category] || 0) + amount
    return acc
  }, {} as Record<string, number>)

  const formattedData = Object.entries(chartData || {})
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)

  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const totalAmount = formattedData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg">Category Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Total {type}: €{totalAmount.toFixed(2)}
        </p>
      </div>
      
      <div className="rounded-lg border bg-card p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ left: 0, right: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickFormatter={(value) => `€${value}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const data = payload[0].payload
                  const percentage = ((data.amount / totalAmount) * 100).toFixed(1)
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <div className="grid gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Category
                          </span>
                          <span className="font-bold">{data.category}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Amount
                          </span>
                          <span className="font-bold">€{data.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Percentage
                          </span>
                          <span className="font-bold">{percentage}%</span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
              <Legend />
              <Bar
                name={type === "income" ? "Income" : "Expenses"}
                dataKey="amount"
                fill={type === "income" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}