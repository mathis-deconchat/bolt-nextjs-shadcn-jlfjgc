"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BalanceChart } from "@/components/charts/balance-chart"
import { ExpenseByCategory } from "@/components/charts/expense-by-category"
import { IncomeExpenses } from "@/components/charts/income-expenses"
import { SpendingTrends } from "@/components/charts/spending-trends"
import { AccountBalanceComparison } from "@/components/charts/account-balance-comparison"
import { CategorySpendingRadar } from "@/components/charts/category-spending-radar"

export function Overview() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income vs Expenses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          <SpendingTrends />
        </TabsContent>
        
        <TabsContent value="balance" className="space-y-4">
          <BalanceChart />
        </TabsContent>
        
        <TabsContent value="accounts" className="space-y-4">
          <AccountBalanceComparison />
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <ExpenseByCategory />
        </TabsContent>
        
        <TabsContent value="income" className="space-y-4">
          <IncomeExpenses />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <CategorySpendingRadar />
        </TabsContent>
      </Tabs>
    </div>
  )
}