"use client"

import { useFilteredOperations } from "@/hooks/use-filtered-operations"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { BaseChart } from "./base-chart"

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="grid gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Date
          </span>
          <span className="font-bold text-foreground">{payload[0].payload.name}</span>
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
            €{payload[1]?.value.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function SpendingTrends() {
  const { data: operations, isLoading } = useFilteredOperations()

  if (isLoading) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const monthlyData = operations?.reduce((acc, op) => {
    const month = format(new Date(op.cozy_realisation_date!), "MMM yyyy")
    if (!acc[month]) {
      acc[month] = { name: month, income: 0, expenses: 0 }
    }
    if (op.cozy_amount! > 0) {
      acc[month].income += op.cozy_amount!
    } else {
      acc[month].expenses += Math.abs(op.cozy_amount!)
    }
    return acc
  }, {} as Record<string, { name: string; income: number; expenses: number }>)

  const data = Object.values(monthlyData || {}).sort((a, b) => 
    new Date(a.name).getTime() - new Date(b.name).getTime()
  )

  return (
    <div className="space-y-8">
      <BaseChart>
        <BarChart data={data}>
          <CartesianGrid className="chart-grid" horizontal vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            dy={10}
            height={60}
            className="chart-text"
          />
          <YAxis
            tickFormatter={(value) => `€${value}`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={80}
            className="chart-text"
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
          />
          <Bar
            dataKey="income"
            name="Income"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </BaseChart>

      <BaseChart>
        <LineChart data={data}>
          <CartesianGrid className="chart-grid" horizontal vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            dy={10}
            height={60}
            className="chart-text"
          />
          <YAxis
            tickFormatter={(value) => `€${value}`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={80}
            className="chart-text"
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey={(d) => d.income - d.expenses}
            name="Net Income"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              style: { fill: "hsl(var(--chart-2))" },
            }}
          />
        </LineChart>
      </BaseChart>
    </div>
  )
}