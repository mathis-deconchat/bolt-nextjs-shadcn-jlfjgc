"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Database } from "@/types/supabase"

type BalanceData = Database["vye"]["Functions"]["get_balance_series"]["Returns"][0]

export function BalanceChart() {
  const supabase = useSupabaseClient()

  const { data: balances, isLoading } = useQuery<BalanceData[]>({
    queryKey: ["balance-series"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_balance_series", {
        start_date: format(new Date().setMonth(new Date().getMonth() - 1), "yyyy-MM-dd"),
      })
      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!balances?.length) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <p className="text-sm text-muted-foreground">No balance data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={balances}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="balance_date"
          tickFormatter={(value) => format(new Date(value), "MMM dd")}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          padding={{ left: 20, right: 20 }}
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
            const data = payload[0].payload as BalanceData
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Date
                    </span>
                    <span className="font-bold">
                      {format(new Date(data.balance_date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Balance
                    </span>
                    <span className="font-bold">
                      €{data.balance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )
          }}
        />
        <Line
          type="monotone"
          dataKey="balance"
          strokeWidth={2}
          dot={false}
          activeDot={{
            r: 4,
            className: "fill-primary",
          }}
          className="stroke-primary"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}