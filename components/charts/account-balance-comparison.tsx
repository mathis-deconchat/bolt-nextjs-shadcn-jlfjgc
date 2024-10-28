"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xl">
      <div className="grid gap-3">
        <div className="flex flex-col">
          <span className="text-[0.70rem] font-medium uppercase text-muted-foreground">
            Date
          </span>
          <span className="text-base font-bold">
            {format(new Date(payload[0].payload.date), "MMMM dd, yyyy")}
          </span>
        </div>
        <div className="grid gap-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex flex-col">
              <span className="text-[0.70rem] font-medium uppercase text-muted-foreground">
                {entry.name}
              </span>
              <span className="text-base font-bold" style={{ color: entry.color }}>
                €{entry.value?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 px-4 pt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function AccountBalanceComparison() {
  const supabase = useSupabaseClient()

  const { data, isLoading } = useQuery({
    queryKey: ["account-balances"],
    queryFn: async () => {
      const { data: accounts, error: accountsError } = await supabase
        .from("cozy_bank_accounts")
        .select("cozy_doc_id, cozy_label")

      if (accountsError) throw accountsError

      const { data: balances, error: balancesError } = await supabase
        .from("cozy_balance_histories")
        .select("*")
        .order("day", { ascending: true })

      if (balancesError) throw balancesError

      const balancesByDate = balances.reduce((acc, balance) => {
        const date = balance.day
        if (!acc[date]) {
          acc[date] = {}
        }
        acc[date][balance.cozy_account_id!] = balance.balance
        return acc
      }, {} as Record<string, Record<string, number>>)

      return {
        accounts: accounts.map(a => ({
          id: a.cozy_doc_id,
          label: a.cozy_label
        })),
        balances: Object.entries(balancesByDate).map(([date, balances]) => ({
          date,
          ...balances
        }))
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const colors = [
    "hsl(142, 76%, 36%)", // Emerald
    "hsl(214, 100%, 60%)", // Blue
    "hsl(271, 91%, 65%)", // Purple
    "hsl(346, 87%, 43%)", // Rose
    "hsl(31, 97%, 55%)", // Orange
  ]

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart 
        data={data?.balances}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <defs>
          {data?.accounts.map((account, index) => (
            <linearGradient
              key={account.id}
              id={`gradient-${account.id}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={colors[index % colors.length]}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={colors[index % colors.length]}
                stopOpacity={0.05}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false}
          className="stroke-muted/30" 
        />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), "MMM dd")}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          tickFormatter={(value) => `€${value/1000}k`}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        {data?.accounts.map((account, index) => (
          <Area
            key={account.id}
            type="monotone"
            dataKey={account.id}
            name={account.label}
            stroke={colors[index % colors.length]}
            fill={`url(#gradient-${account.id})`}
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}