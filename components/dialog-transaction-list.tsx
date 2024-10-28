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

interface DialogTransactionListProps {
  type: "income" | "expenses"
}

export function DialogTransactionList({ type }: DialogTransactionListProps) {
  const supabase = useSupabaseClient()
  const currentMonth = new Date()

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["dialog-transactions", type],
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

  const totalAmount = transactions?.reduce((sum, t) => sum + Math.abs(t.cozy_amount || 0), 0) || 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-medium">All Transactions</h3>
          <p className="text-sm text-muted-foreground">
            {transactions?.length || 0} transactions this month
          </p>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Total {type}:</span>
          <span className={cn(
            "ml-2 font-medium",
            type === "income" ? "text-green-500" : "text-red-500"
          )}>
            €{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="relative rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-fit whitespace-nowrap">Date</TableHead>
              <TableHead className="min-w-[100px]">Description</TableHead>
              <TableHead className="hidden md:table-cell min-w-[100px]">Category</TableHead>
              <TableHead className="text-right w-fit whitespace-nowrap">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {transaction.cozy_realisation_date
                    ? format(new Date(transaction.cozy_realisation_date), "MMM dd")
                    : "No date"}
                </TableCell>
                <TableCell>
                  <div className="truncate max-w-[100px] " 
                       title={transaction.cozy_label || ""}>
                    {transaction.cozy_label}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="truncate max-w-[140px]" 
                       title={transaction.cozy_operation_categories?.fr_traduction || "Uncategorized"}>
                    {transaction.cozy_operation_categories?.fr_traduction || "Uncategorized"}
                  </div>
                </TableCell>
                <TableCell className={cn(
                  "text-right font-medium tabular-nums whitespace-nowrap",
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