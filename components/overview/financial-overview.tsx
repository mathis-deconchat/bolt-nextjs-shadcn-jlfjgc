"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BalanceChart } from "@/components/charts/balance-chart"
import { ExpenseByCategory } from "@/components/charts/expense-by-category"
import { IncomeExpenses } from "@/components/charts/income-expenses"

export function FinancialOverview() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income vs Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="balance" className="space-y-4">
            <BalanceChart />
          </TabsContent>
          <TabsContent value="expenses" className="space-y-4">
            <ExpenseByCategory />
          </TabsContent>
          <TabsContent value="income" className="space-y-4">
            <IncomeExpenses />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}