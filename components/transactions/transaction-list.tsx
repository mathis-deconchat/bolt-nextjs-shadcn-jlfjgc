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
import { cn } from "@/lib/utils"

export function TransactionList() {
  const supabase = useSupabaseClient()

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cozy_bank_operations")
        .select(`
          *,
          cozy_bank_accounts!cozy_bank_operations_cozy_account_id_fkey (
            cozy_label
          ),
          cozy_operation_categories!cozy_bank_operations_cozy_category_id_fkey (
            fr_traduction
          )
        `)
        .not("cozy_amount", "is", null)
        .order("cozy_realisation_date", { ascending: false })
        .limit(50)

      if (error) throw error
      return data
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
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="min-w-[200px]">Description</TableHead>
            <TableHead className="min-w-[150px]">Account</TableHead>
            <TableHead className="min-w-[150px]">Category</TableHead>
            <TableHead className="text-right w-[150px]">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow 
              key={transaction.id}
              className="group hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">
                {transaction.cozy_realisation_date
                  ? format(new Date(transaction.cozy_realisation_date), "MMM dd, yyyy")
                  : "No date"}
              </TableCell>
              <TableCell>
                <div className="truncate max-w-[300px]" title={transaction.cozy_label || ""}>
                  {transaction.cozy_label}
                </div>
              </TableCell>
              <TableCell>
                {transaction.cozy_bank_accounts?.cozy_label || "Unknown Account"}
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
          {!transactions?.length && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}