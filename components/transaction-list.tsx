"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Database } from "@/types/supabase"
import { cn } from "@/lib/utils"

type Transaction = Database["vye"]["Tables"]["cozy_bank_operations"]["Row"]

interface TransactionListProps {
  type: "income" | "expenses"
}

export function TransactionList({ type }: TransactionListProps) {
  const supabase = useSupabaseClient()
  const currentMonth = new Date()

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["transactions", type],
    queryFn: async () => {
      const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd")
      const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd")

      const { data, error } = await supabase
        .from("cozy_bank_operations")
        .select(`
          *,
          cozy_operation_categories!cozy_bank_operations_cozy_category_id_fkey (
            fr_traduction
          )
        `)
        .gte("cozy_realisation_date", monthStart)
        .lte("cozy_realisation_date", monthEnd)
        .not("cozy_amount", "is", null)
        .order("cozy_realisation_date", { ascending: false })

      if (error) throw error

      return data.filter(op => 
        type === "income" ? op.cozy_amount! > 0 : op.cozy_amount! < 0
      )
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Transaction List</h3>
          <p className="text-sm text-muted-foreground">
            {transactions?.length || 0} transactions this month
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[130px]">Date</TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
              <TableHead className="min-w-[150px]">Category</TableHead>
              <TableHead className="text-right w-[130px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {transaction.cozy_realisation_date
                    ? format(new Date(transaction.cozy_realisation_date), "MMM dd, yyyy")
                    : "No date"}
                </TableCell>
                <TableCell>
                  <div className="truncate" title={transaction.cozy_label || ""}>
                    {transaction.cozy_label}
                  </div>
                </TableCell>
                <TableCell>
                  {transaction.cozy_operation_categories?.fr_traduction || "Uncategorized"}
                </TableCell>
                <TableCell className={cn(
                  "text-right font-medium tabular-nums",
                  type === "income" ? "text-green-500" : "text-red-500"
                )}>
                  €{Math.abs(transaction.cozy_amount || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {!transactions?.length && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}