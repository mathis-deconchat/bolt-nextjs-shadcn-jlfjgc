"use client"

import { useQuery } from "@tanstack/react-query"
import useSupabaseClient from "@/lib/supabase-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Wallet, PiggyBank, CreditCard, Briefcase } from "lucide-react"

const accountTypeIcons = {
  Checkings: Wallet,
  LongTermSavings: PiggyBank,
  CreditCard: CreditCard,
  Business: Briefcase,
} as const

export function AccountList() {
  const supabase = useSupabaseClient()

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cozy_bank_accounts")
        .select("*")
        .order("cozy_label")

      if (error) throw error

      return data.map((account) => ({
        label: account.cozy_label,
        balance: parseFloat(account.cozy_balance || "0"),
        type: account.cozy_account_type as keyof typeof accountTypeIcons,
      }))
    },
  })

  return (
    <>
      {accounts?.map((account, index) => {
        const Icon = accountTypeIcons[account.type] || Wallet
        return (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {account.label}
              </CardTitle>
              <div className="rounded-full p-2 bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={cn(
                  "tabular-nums",
                  account.balance > 0 ? "text-green-500" : "text-red-500"
                )}>
                  €{account.balance.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {account.type}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}