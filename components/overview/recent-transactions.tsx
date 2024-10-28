"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function RecentTransactions() {
  const supabase = useSupabaseClient()

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cozy_bank_operations")
        .select(`
          *,
          cozy_operation_categories!cozy_bank_operations_cozy_category_id_fkey (
            fr_traduction
          )
        `)
        .not("cozy_amount", "is", null)
        .order("cozy_realisation_date", { ascending: false })
        .limit(5)

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id} className="group">
                <TableCell className="font-medium">
                  {transaction.cozy_realisation_date
                    ? format(new Date(transaction.cozy_realisation_date), "MMM dd")
                    : "No date"}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {transaction.cozy_label}
                </TableCell>
                <TableCell>
                  {transaction.cozy_operation_categories?.fr_traduction || "Uncategorized"}
                </TableCell>
                <TableCell className={cn(
                  "text-right font-medium tabular-nums",
                  transaction.cozy_amount && transaction.cozy_amount > 0 
                    ? "text-green-500" 
                    : "text-red-500"
                )}>
                  €{Math.abs(transaction.cozy_amount || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}