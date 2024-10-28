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
import { Database } from "@/types/supabase"
import { cn } from "@/lib/utils"

type BankOperation = Database["vye"]["Tables"]["cozy_bank_operations"]["Row"]

export function RecentTransactions() {
  const supabase = useSupabaseClient()

  const { data: transactions, isLoading } = useQuery<BankOperation[]>({
    queryKey: ["recent-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cozy_bank_operations")
        .select()
        .not("cozy_amount", 'is', null)
        .order("cozy_realisation_date", { ascending: false })
        .limit(10)

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Label</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {transaction.cozy_realisation_date
                  ? format(new Date(transaction.cozy_realisation_date), "MMM dd, yyyy")
                  : "No date"}
              </TableCell>
              <TableCell>{transaction.cozy_label || "Unknown"}</TableCell>
              <TableCell className={cn(
                "text-right font-medium",
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
    </div>
  )
}