"use client"

import { ReactNode } from "react"
import { ResponsiveContainer } from "recharts"

interface BaseChartProps {
  children: ReactNode
  height?: number
  className?: string
}

export function BaseChart({ children, height = 350, className }: BaseChartProps) {
  return (
    <div className={`chart-container ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}