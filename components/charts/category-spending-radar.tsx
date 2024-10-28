"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"

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

export function CategorySpendingRadar() {
  const supabase = useSupabaseClient()

  const { data, isLoading } = useQuery({
    queryKey: ["category-spending-comparison"],
    queryFn: async () => {
      const { data: operations, error } = await supabase
        .from("cozy_bank_operations")
        .select(`
          cozy_amount,
          cozy_realisation_date,
          cozy_operation_categories!cozy_bank_operations_cozy_category_id_fkey (
            fr_traduction
          )
        `)
        .lt("cozy_amount", 0)
        .not("cozy_category_id", "is", null)

      if (error) throw error

      const currentMonth = new Date().getMonth()
      const previousMonth = currentMonth - 1

      const spending = operations.reduce((acc, op) => {
        const date = new Date(op.cozy_realisation_date!)
        const month = date.getMonth()
        const category = op.cozy_operation_categories?.fr_traduction || "Other"
        
        if (month === currentMonth || month === previousMonth) {
          if (!acc[category]) {
            acc[category] = { 
              category,
              current: 0,
              previous: 0
            }
          }
          
          if (month === currentMonth) {
            acc[category].current += Math.abs(op.cozy_amount!)
          } else {
            acc[category].previous += Math.abs(op.cozy_amount!)
          }
        }
        
        return acc
      }, {} as Record<string, { 
        category: string
        current: number
        previous: number 
      }>)

      return Object.values(spending)
        .sort((a, b) => b.current - a.current)
        .slice(0, 8)
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius="80%" 
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <PolarGrid 
          gridType="circle"
          className="stroke-muted/30" 
        />
        <PolarAngleAxis
          dataKey="category"
          tick={{ 
            fontSize: 12,
            fill: "hsl(var(--muted-foreground))",
            fontWeight: 500 
          }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 'auto']}
          tickFormatter={(value) => `€${value/1000}k`}
          tick={{ 
            fontSize: 12,
            fill: "hsl(var(--muted-foreground))" 
          }}
        />
        <Radar
          name="Current Month"
          dataKey="current"
          stroke="hsl(142, 76%, 36%)"
          fill="hsl(142, 76%, 36%)"
          fillOpacity={0.3}
        />
        <Radar
          name="Previous Month"
          dataKey="previous"
          stroke="hsl(214, 100%, 60%)"
          fill="hsl(214, 100%, 60%)"
          fillOpacity={0.3}
        />
        <Legend content={<CustomLegend />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}