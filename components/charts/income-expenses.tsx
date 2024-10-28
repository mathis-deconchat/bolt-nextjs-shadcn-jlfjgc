"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
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

export function IncomeExpenses() {
  const supabase = useSupabaseClient()
  const startDate = startOfMonth(subMonths(new Date(), 5))
  const endDate = endOfMonth(new Date())

  const { data, isLoading } = useQuery({
    queryKey: ["income-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cozy_bank_operations")
        .select("cozy_amount, cozy_realisation_date")
        .gte("cozy_realisation_date", format(startDate, "yyyy-MM-dd"))
        .lte("cozy_realisation_date", format(endDate, "yyyy-MM-dd"))
        .not("cozy_amount", "is", null)

      if (error) throw error

      const monthlyData = data.reduce((acc, op) => {
        const date = format(new Date(op.cozy_realisation_date!), "yyyy-MM")
        if (!acc[date]) {
          acc[date] = { income: 0, expenses: 0 }
        }
        if (op.cozy_amount! > 0) {
          acc[date].income += op.cozy_amount!
        } else {
          acc[date].expenses += Math.abs(op.cozy_amount!)
        }
        return acc
      }, {} as Record<string, { income: number; expenses: number }>)

      return Object.entries(monthlyData)
        .map(([date, values]) => ({
          date,
          income: values.income,
          expenses: values.expenses,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), "MMM yyyy")}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
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
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Date
                    </span>
                    <span className="font-bold">
                      {format(new Date(payload[0].payload.date), "MMMM yyyy")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Income
                    </span>
                    <span className="font-bold text-green-500">
                      €{payload[0].value.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Expenses
                    </span>
                    <span className="font-bold text-red-500">
                      €{payload[1].value.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )
          }}
        />
        <Legend />
        <Bar dataKey="income" name="Income" fill="hsl(var(--chart-2))" />
        <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-1))" />
      </BarChart>
    </ResponsiveContainer>
  )
}