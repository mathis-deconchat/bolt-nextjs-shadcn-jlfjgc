"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts"

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function ExpenseByCategory() {
  const supabase = useSupabaseClient()

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses-by-category"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cozy_bank_operations")
        .select(`
          cozy_amount,
          cozy_operation_categories!cozy_bank_operations_cozy_category_id_fkey (
            fr_traduction
          )
        `)
        .lt("cozy_amount", 0)
        .not("cozy_category_id", "is", null)

      if (error) throw error

      const categoryTotals = data.reduce((acc, op) => {
        const category = op.cozy_operation_categories?.fr_traduction || "Other"
        acc[category] = (acc[category] || 0) + Math.abs(op.cozy_amount || 0)
        return acc
      }, {} as Record<string, number>)

      return Object.entries(categoryTotals)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
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
      <PieChart>
        <Pie
          data={expenses}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label={({ name, percent }) => 
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {expenses?.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const data = payload[0].payload
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Category
                    </span>
                    <span className="font-bold">{data.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Amount
                    </span>
                    <span className="font-bold">€{data.value.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}